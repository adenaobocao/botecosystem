// Gera sugestoes de cupons personalizados via IA

import { db } from "@/lib/db";
import { askGemini } from "@/lib/ai/gemini";
import { buildCouponPrompt } from "@/lib/ai/prompts";

// Busca clientes inativos (30+ dias sem pedir) que ainda nao tem sugestao pendente
async function getInactiveCustomers() {
  return db.$queryRawUnsafe<
    {
      user_id: string;
      name: string;
      order_count: number;
      total_spent: number;
      days_since_last: number;
      avg_ticket: number;
    }[]
  >(
    `SELECT
       u.id as user_id, u.name,
       COUNT(o.id)::int as order_count,
       COALESCE(SUM(o.total), 0)::float as total_spent,
       EXTRACT(DAY FROM NOW() - MAX(o."createdAt"))::int as days_since_last,
       CASE WHEN COUNT(o.id) > 0 THEN (SUM(o.total) / COUNT(o.id))::float ELSE 0 END as avg_ticket
     FROM "User" u
     JOIN "Order" o ON o."userId" = u.id AND o."deletedAt" IS NULL AND o.status != 'CANCELLED'
     WHERE u.role = 'CUSTOMER' AND u."deletedAt" IS NULL
       AND u.id NOT IN (SELECT "userId" FROM "AiCouponSuggestion" WHERE status = 'PENDING')
     GROUP BY u.id, u.name
     HAVING EXTRACT(DAY FROM NOW() - MAX(o."createdAt")) > 15
     ORDER BY days_since_last DESC
     LIMIT 10`
  );
}

// Busca produtos favoritos de um cliente
async function getFavoriteProducts(userId: string) {
  const rows = await db.$queryRawUnsafe<{ name: string }[]>(
    `SELECT p.name
     FROM "OrderItem" oi
     JOIN "Order" o ON o.id = oi."orderId"
     JOIN "Product" p ON p.id = oi."productId"
     WHERE o."userId" = $1 AND o."deletedAt" IS NULL AND o.status != 'CANCELLED'
     GROUP BY p.name
     ORDER BY SUM(oi.quantity) DESC
     LIMIT 3`,
    userId
  );
  return rows.map((r) => r.name);
}

export async function generateCouponSuggestions() {
  const customers = await getInactiveCustomers();
  let generated = 0;

  for (const c of customers) {
    const favorites = await getFavoriteProducts(c.user_id);

    const prompt = buildCouponPrompt({
      customerName: c.name || "Cliente",
      totalOrders: c.order_count,
      totalSpent: c.total_spent,
      daysSinceLastOrder: c.days_since_last,
      avgTicket: c.avg_ticket,
      favoriteProducts: favorites.length > 0 ? favorites : ["variados"],
    });

    const response = await askGemini(prompt, { maxTokens: 256 });

    // Parse resposta
    const typeMatch = response.match(/TIPO:\s*(PERCENTAGE|FIXED)/);
    const valueMatch = response.match(/VALOR:\s*(\d+(?:\.\d+)?)/);
    const reasonMatch = response.match(/MOTIVO:\s*(.+)/);

    if (typeMatch && valueMatch) {
      await db.$executeRawUnsafe(
        `INSERT INTO "AiCouponSuggestion" (id, "userId", reason, "couponType", "suggestedValue", status, "createdAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, 'PENDING', NOW())`,
        c.user_id,
        reasonMatch ? reasonMatch[1].trim() : `Cliente inativo ha ${c.days_since_last} dias`,
        typeMatch[1],
        parseFloat(valueMatch[1])
      );
      generated++;
    }
  }

  return generated;
}
