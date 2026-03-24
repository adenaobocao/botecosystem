import { getDashboardMetrics, getRecentOrders } from "@/lib/queries/dashboard";
import { serialize } from "@/lib/utils";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { OriginBreakdown } from "@/components/dashboard/origin-breakdown";
import { RecentOrdersTable } from "@/components/dashboard/recent-orders-table";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = { title: "Painel | Boteco da Estacao" };

export default async function DashboardPage() {
  const [metrics, recentOrders] = await Promise.all([
    getDashboardMetrics(),
    getRecentOrders(10),
  ]);

  const data = serialize(metrics);
  const orders = serialize(recentOrders);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Painel</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Visao geral do dia
          </p>
        </div>
        <Link
          href="/dashboard/pedidos"
          className="inline-flex items-center justify-center h-9 px-4 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
        >
          Ver pedidos
        </Link>
      </div>

      {/* KPIs */}
      <KpiCards
        vendasHoje={data.vendasHoje}
        pedidosHoje={data.pedidosHoje}
        ticketMedio={data.ticketMedio}
        pedidosPendentes={data.pedidosPendentes}
      />

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SalesChart data={data.salesByDay} />
        </div>
        <div>
          <OriginBreakdown data={data.originCount} total={data.pedidosHoje} />
        </div>
      </div>

      {/* Recent orders */}
      <RecentOrdersTable orders={orders} />
    </div>
  );
}
