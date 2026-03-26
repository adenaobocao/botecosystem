import { Metadata } from "next";
import { Suspense } from "react";
import { PeriodSelector } from "@/components/dashboard/analytics/period-selector";
import { RevenueChart } from "@/components/dashboard/analytics/revenue-chart";
import { TopProductsChart } from "@/components/dashboard/analytics/top-products-chart";
import { PeakHoursHeatmap } from "@/components/dashboard/analytics/peak-hours-heatmap";
import { OriginTrendChart } from "@/components/dashboard/analytics/origin-trend-chart";
import { CustomerMetricsCard } from "@/components/dashboard/analytics/customer-metrics-card";
import { AiInsightsPanel } from "@/components/dashboard/analytics/ai-insights-panel";
import { HealthScore } from "@/components/dashboard/analytics/health-score";
import {
  getRevenueOverTime,
  getTopProducts,
  getPeakHoursData,
  getOriginTrend,
  getCustomerMetrics,
  getPeriodKpis,
  getOriginBreakdown,
} from "@/lib/queries/analytics";
import { getRecentInsights } from "@/lib/queries/marketing";
import { serialize } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = { title: "Inteligencia | Boteco da Estacao" };
export const dynamic = "force-dynamic";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function InteligenciaPage({
  searchParams,
}: {
  searchParams: Promise<{ dias?: string }>;
}) {
  const params = await searchParams;
  const days = ([7, 30, 90].includes(Number(params.dias)) ? Number(params.dias) : 7) as 7 | 30 | 90;

  const [revenue, topProducts, peakHours, originTrend, customerMetrics, kpis, insights] =
    await Promise.all([
      getRevenueOverTime(days),
      getTopProducts(days, 10),
      getPeakHoursData(days),
      getOriginTrend(days),
      getCustomerMetrics(),
      getPeriodKpis(days),
      getRecentInsights(10),
    ]);

  const healthInsight = insights.find((i) => i.type === "HEALTH_SCORE") || null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Inteligencia</h1>
          <p className="text-sm text-muted-foreground">Analytics e insights com IA</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/inteligencia/roadmap"
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-violet-300 text-violet-600 hover:bg-violet-50 transition-colors"
          >
            SOON -- Roadmap
          </Link>
          <Link
            href="/dashboard/inteligencia/alertas"
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-muted transition-colors"
          >
            Alertas
          </Link>
          <Suspense>
            <PeriodSelector />
          </Suspense>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Faturamento", value: formatBRL(kpis.revenue), color: "text-green-600" },
          { label: "Pedidos", value: kpis.orders.toString(), color: "text-blue-600" },
          { label: "Ticket medio", value: formatBRL(kpis.avgTicket), color: "text-amber-600" },
          { label: "Cancelamentos", value: `${kpis.cancellationRate.toFixed(1)}%`, color: "text-red-600" },
        ].map((kpi) => (
          <div key={kpi.label} className="p-4 bg-card border border-border rounded-xl">
            <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart + Health score */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-3">Faturamento</h2>
          <RevenueChart data={serialize(revenue)} />
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-3">Saude do negocio</h2>
          <HealthScore insight={healthInsight} />
        </div>
      </div>

      {/* Top products + Peak hours */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-3">Top produtos</h2>
          <TopProductsChart data={serialize(topProducts)} />
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-3">Horarios de pico</h2>
          <PeakHoursHeatmap data={serialize(peakHours)} />
        </div>
      </div>

      {/* Origin trend + Customer metrics */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-3">Origem dos pedidos</h2>
          <OriginTrendChart data={serialize(originTrend)} />
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-3">Clientes</h2>
          <CustomerMetricsCard metrics={customerMetrics} />
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Insights da IA</h2>
          <span className="text-[10px] text-muted-foreground">Gerados automaticamente</span>
        </div>
        <AiInsightsPanel insights={insights} />
      </div>
    </div>
  );
}
