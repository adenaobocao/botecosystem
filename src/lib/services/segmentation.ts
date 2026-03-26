// Segmentacao automatica de clientes

import { db } from "@/lib/db";
import { getCustomerSegmentData } from "@/lib/queries/analytics";

// Regras de segmentacao:
// NEW: primeiro pedido nos ultimos 30 dias, total <= 2 pedidos
// VIP: 10+ pedidos OU total gasto > R$500, ultimo pedido nos ultimos 30 dias
// RECURRING: 3+ pedidos, ultimo pedido nos ultimos 30 dias
// INACTIVE: ultimo pedido > 30 dias atras

export async function segmentAllCustomers() {
  const customers = await getCustomerSegmentData();
  const counts = { NEW: 0, RECURRING: 0, VIP: 0, INACTIVE: 0 };

  for (const c of customers) {
    let segment: string;

    if (c.days_since_last != null && c.days_since_last > 30) {
      segment = "INACTIVE";
    } else if (c.order_count >= 10 || c.total_spent >= 500) {
      segment = "VIP";
    } else if (c.order_count >= 3) {
      segment = "RECURRING";
    } else {
      segment = "NEW";
    }

    counts[segment as keyof typeof counts]++;

    // Upsert segmento
    await db.$executeRawUnsafe(
      `INSERT INTO "CustomerSegmentAssignment" (id, "userId", segment, "assignedAt")
       VALUES (gen_random_uuid(), $1, $2, NOW())
       ON CONFLICT ("userId") DO UPDATE SET segment = $2, "assignedAt" = NOW()`,
      c.user_id,
      segment
    );
  }

  return counts;
}
