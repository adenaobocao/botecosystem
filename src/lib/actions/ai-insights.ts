"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { askGemini } from "@/lib/ai/gemini";
import { getPeriodKpis, getTopProducts, getOriginBreakdown } from "@/lib/queries/analytics";

export async function markInsightRead(id: string) {
  await db.$executeRawUnsafe(
    `UPDATE "AiInsight" SET status = 'READ' WHERE id = $1`,
    id
  );
  revalidatePath("/dashboard/inteligencia");
}

export async function dismissInsight(id: string) {
  await db.$executeRawUnsafe(
    `UPDATE "AiInsight" SET status = 'DISMISSED' WHERE id = $1`,
    id
  );
  revalidatePath("/dashboard/inteligencia");
}

// Chat IA on-demand — pergunta livre sobre o negocio
export async function askAboutBusiness(question: string): Promise<string> {
  const [kpis, topProducts, origins] = await Promise.all([
    getPeriodKpis(7),
    getTopProducts(7, 10),
    getOriginBreakdown(7),
  ]);

  const originStr = origins.map((o) => `${o.origin}: ${o.count}`).join(", ");
  const productsStr = topProducts
    .map((p) => `${p.name}: ${p.quantity}x, R$${p.revenue.toFixed(0)}`)
    .join("; ");

  const prompt = `O dono do Boteco da Estacao perguntou: "${question}"

DADOS DA ULTIMA SEMANA:
- Faturamento: R$ ${kpis.revenue.toFixed(2)}
- Pedidos: ${kpis.orders}
- Ticket medio: R$ ${kpis.avgTicket.toFixed(2)}
- Cancelamentos: ${kpis.cancellationRate.toFixed(1)}%
- Origens: ${originStr}
- Top produtos: ${productsStr}

Responda de forma direta e util em 2-3 paragrafos curtos. Use os dados concretos na resposta.`;

  return askGemini(prompt);
}
