import Link from "next/link";

const statusLabels: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pendente", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300" },
  CONFIRMED: { label: "Confirmado", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" },
  PREPARING: { label: "Preparando", className: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300" },
  READY: { label: "Pronto", className: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" },
  DELIVERING: { label: "Entregando", className: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300" },
  DELIVERED: { label: "Entregue", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" },
  CANCELLED: { label: "Cancelado", className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300" },
};

const originLabels: Record<string, string> = {
  SITE: "Site",
  IFOOD: "iFood",
  WHATSAPP: "WhatsApp",
  TABLE: "Mesa",
};

function formatBRL(value: number | string): string {
  return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  origin?: string;
  type: string;
  total: number | string;
  createdAt: string;
  user: { name: string | null; email: string | null };
  items: { quantity: number; product: { name: string } }[];
}

export function RecentOrdersTable({ orders }: { orders: Order[] }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Pedidos recentes</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Ultimos pedidos recebidos</p>
        </div>
        <Link
          href="/dashboard/pedidos"
          className="text-xs font-semibold text-primary hover:underline"
        >
          Ver todos
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="p-8 text-center text-sm text-muted-foreground">
          Nenhum pedido ainda
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-border">
            {orders.map((order) => {
              const status = statusLabels[order.status] || { label: order.status, className: "bg-muted text-muted-foreground" };
              return (
                <div key={order.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold">#{order.orderNumber}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{timeAgo(order.createdAt)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {order.user?.name || order.user?.email || "Cliente"}
                    {order.origin && <span className="ml-2 text-muted-foreground/60">via {originLabels[order.origin] || order.origin}</span>}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {order.items.map((i) => `${i.quantity}x ${i.product.name}`).join(", ")}
                  </div>
                  <div className="text-sm font-bold">{formatBRL(order.total)}</div>
                </div>
              );
            })}
          </div>

          {/* Desktop table */}
          <table className="hidden sm:table w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wider">
                <th className="px-4 py-3 font-medium">Pedido</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Itens</th>
                <th className="px-4 py-3 font-medium">Origem</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
                <th className="px-4 py-3 font-medium text-right">Tempo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => {
                const status = statusLabels[order.status] || { label: order.status, className: "bg-muted text-muted-foreground" };
                return (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold">#{order.orderNumber}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {order.user?.name || order.user?.email || "Cliente"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">
                      {order.items.map((i) => `${i.quantity}x ${i.product.name}`).join(", ")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        {originLabels[order.origin ?? "SITE"] || order.origin}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatBRL(order.total)}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground text-xs">
                      {timeAgo(order.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
