import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getActiveAlertRules } from "@/lib/queries/alerts";
import { getPeriodKpis } from "@/lib/queries/analytics";

// Vercel Cron — roda a cada 30min
// Checa regras de alerta e cria Alert se threshold cruzado

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rules = await getActiveAlertRules();
    if (rules.length === 0) {
      return NextResponse.json({ ok: true, checked: 0 });
    }

    const kpis = await getPeriodKpis(1); // metricas de hoje

    const metricValues: Record<string, number> = {
      DAILY_REVENUE: kpis.revenue,
      ORDER_COUNT: kpis.orders,
      AVG_TICKET: kpis.avgTicket,
      CANCELLATION_RATE: kpis.cancellationRate,
    };

    const metricLabels: Record<string, string> = {
      DAILY_REVENUE: "Faturamento diario",
      ORDER_COUNT: "Qtd pedidos",
      AVG_TICKET: "Ticket medio",
      CANCELLATION_RATE: "Taxa de cancelamento",
    };

    let triggered = 0;

    for (const rule of rules) {
      const value = metricValues[rule.metric];
      if (value === undefined) continue;

      const shouldAlert =
        (rule.operator === "LT" && value < rule.threshold) ||
        (rule.operator === "GT" && value > rule.threshold);

      if (shouldAlert) {
        // Evita alerta duplicado nas ultimas 6h
        const [existing] = await db.$queryRawUnsafe<{ count: number }[]>(
          `SELECT COUNT(*)::int as count FROM "Alert"
           WHERE "ruleId" = $1 AND "createdAt" > NOW() - INTERVAL '6 hours'`,
          rule.id
        );
        if (existing.count > 0) continue;

        const op = rule.operator === "LT" ? "abaixo" : "acima";
        const message = `${metricLabels[rule.metric] || rule.metric} esta ${op} do limite: ${value.toFixed(2)} (limite: ${rule.threshold})`;

        await db.$executeRawUnsafe(
          `INSERT INTO "Alert" (id, "ruleId", message, "currentValue", "isRead", "createdAt")
           VALUES (gen_random_uuid(), $1, $2, $3, false, NOW())`,
          rule.id,
          message,
          value
        );
        triggered++;
      }
    }

    return NextResponse.json({ ok: true, checked: rules.length, triggered });
  } catch (error) {
    console.error("[cron/alerts] Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
