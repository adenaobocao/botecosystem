// Geracao de insights via Gemini

import { db } from "@/lib/db";
import { askGemini } from "./gemini";
import {
  buildInsightPrompt,
  buildAnomalyPrompt,
  buildForecastPrompt,
  buildHealthScorePrompt,
} from "./prompts";
import {
  getPeriodKpis,
  getTopProducts,
  getOriginBreakdown,
  getCustomerMetrics,
  getWeekdayHistory,
} from "@/lib/queries/analytics";

// Salva insight no banco
async function saveInsight(type: string, title: string, content: string, data?: object) {
  await db.$executeRawUnsafe(
    `INSERT INTO "AiInsight" (id, type, title, content, data, status, "createdAt")
     VALUES (gen_random_uuid(), $1, $2, $3, $4::jsonb, 'NEW', NOW())`,
    type,
    title,
    content,
    data ? JSON.stringify(data) : null
  );
}

// Resumo diario
export async function generateDailySummary() {
  const today = await getPeriodKpis(1);
  const yesterday = await getPeriodKpis(2); // 2 dias pra pegar ontem
  const topProducts = await getTopProducts(1, 5);
  const origins = await getOriginBreakdown(1);

  const originMap: Record<string, number> = {};
  origins.forEach((o) => (originMap[o.origin] = o.count));

  const prompt = buildInsightPrompt({
    revenue: today.revenue,
    orders: today.orders,
    avgTicket: today.avgTicket,
    cancellations: today.cancelled,
    topProducts: topProducts.map((p) => ({ name: p.name, qty: p.quantity, revenue: p.revenue })),
    originBreakdown: originMap,
    previousRevenue: yesterday.revenue - today.revenue, // approx yesterday only
    previousOrders: yesterday.orders - today.orders,
  });

  const content = await askGemini(prompt);
  await saveInsight("DAILY_SUMMARY", "Resumo do dia", content, today);
}

// Detecta anomalias (desvio > 30% da media)
export async function checkAnomalies() {
  const current = await getPeriodKpis(1);
  const avg = await getPeriodKpis(7);

  const metrics = [
    { name: "Faturamento", current: current.revenue, average: avg.revenue / 7 },
    { name: "Pedidos", current: current.orders, average: avg.orders / 7 },
    { name: "Ticket medio", current: current.avgTicket, average: avg.avgTicket },
  ];

  for (const m of metrics) {
    if (m.average === 0) continue;
    const deviation = ((m.current - m.average) / m.average) * 100;
    if (Math.abs(deviation) > 30) {
      const prompt = buildAnomalyPrompt({
        metric: m.name,
        value: m.current,
        average: m.average,
        deviation,
      });
      const content = await askGemini(prompt, { maxTokens: 512 });
      await saveInsight("ANOMALY", `Anomalia: ${m.name}`, content, {
        metric: m.name,
        value: m.current,
        average: m.average,
        deviation,
      });
    }
  }
}

// Previsao de demanda
export async function generateForecast() {
  const history = await getWeekdayHistory();
  if (history.length === 0) return;

  const prompt = buildForecastPrompt(history);
  const content = await askGemini(prompt, { maxTokens: 512 });
  await saveInsight("FORECAST", "Previsao para amanha", content, { history });
}

// Analise de produtos
export async function analyzeProducts() {
  const products = await getTopProducts(7, 15);
  if (products.length === 0) return;

  const prompt = `Analise a performance dos produtos do Boteco da Estacao na ultima semana:

${products.map((p, i) => `${i + 1}. ${p.name}: ${p.quantity}x vendidos, R$ ${p.revenue.toFixed(2)} receita`).join("\n")}

Em 2-3 paragrafos curtos: quais estao indo bem, quais estao fracos, e sugestoes (combos, promos, remocao).`;

  const content = await askGemini(prompt);
  await saveInsight("PRODUCT_ANALYSIS", "Performance de produtos", content, { products });
}

// Health score
export async function calculateHealthScore() {
  const thisWeek = await getPeriodKpis(7);
  const lastWeek = await getPeriodKpis(14);
  const customerMetrics = await getCustomerMetrics();
  const topProducts = await getTopProducts(7, 50);

  const lastWeekOnly = {
    revenue: lastWeek.revenue - thisWeek.revenue,
    orders: lastWeek.orders - thisWeek.orders,
  };

  const revenueTrend =
    lastWeekOnly.revenue > 0
      ? ((thisWeek.revenue - lastWeekOnly.revenue) / lastWeekOnly.revenue) * 100
      : 0;

  const prompt = buildHealthScorePrompt({
    revenueTrend,
    customerRetention:
      customerMetrics.withOrders > 0
        ? (customerMetrics.recurring / customerMetrics.withOrders) * 100
        : 0,
    cancellationRate: thisWeek.cancellationRate,
    avgTicket: thisWeek.avgTicket,
    avgTicketPrev: lastWeekOnly.orders > 0 ? lastWeekOnly.revenue / lastWeekOnly.orders : 0,
    totalCustomers: customerMetrics.totalCustomers,
    orderDiversity: topProducts.length,
  });

  const content = await askGemini(prompt, { maxTokens: 512 });
  await saveInsight("HEALTH_SCORE", "Score de saude do negocio", content, {
    revenueTrend,
    cancellationRate: thisWeek.cancellationRate,
  });
}
