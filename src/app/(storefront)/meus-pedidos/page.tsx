import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getMyOrders } from "@/lib/queries/my-orders";
import { serialize } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = { title: "Meus Pedidos" };
export const dynamic = "force-dynamic";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Pendente", color: "text-yellow-700", bg: "bg-yellow-100" },
  CONFIRMED: { label: "Confirmado", color: "text-blue-700", bg: "bg-blue-100" },
  PREPARING: { label: "Preparando", color: "text-orange-700", bg: "bg-orange-100" },
  READY: { label: "Pronto", color: "text-green-700", bg: "bg-green-100" },
  DELIVERING: { label: "Saiu pra entrega", color: "text-purple-700", bg: "bg-purple-100" },
  DELIVERED: { label: "Entregue", color: "text-emerald-700", bg: "bg-emerald-100" },
  CANCELLED: { label: "Cancelado", color: "text-red-700", bg: "bg-red-100" },
};

function formatPrice(v: number | string) {
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
  });
}

export default async function MeusPedidosPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/meus-pedidos");

  const orders = serialize(await getMyOrders(session.user.id));

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24 md:pb-6">
      <h1 className="text-xl font-bold tracking-tight mb-6">Meus pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          {/* Ilustracao pedidos */}
          <div className="w-28 h-28 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" className="text-primary/40">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="absolute top-3 right-3 w-2 h-2 bg-accent/30 rounded-full" />
            <div className="absolute bottom-5 left-4 w-1.5 h-1.5 bg-primary/20 rounded-full" />
          </div>
          <h2 className="text-lg font-bold">Nenhum pedido ainda</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-[260px] mx-auto">
            Quando voce fizer seu primeiro pedido, ele vai aparecer aqui com acompanhamento em tempo real.
          </p>
          <Link
            href="/cardapio"
            className="inline-flex items-center justify-center h-12 px-8 mt-6 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-90 transition-opacity shadow-sm"
          >
            Fazer primeiro pedido
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order: any) => {
            const status = statusConfig[order.status] || { label: order.status, color: "text-muted-foreground", bg: "bg-muted" };
            const isActive = !["DELIVERED", "CANCELLED"].includes(order.status);

            return (
              <Link
                key={order.id}
                href={`/meus-pedidos/${order.orderNumber}`}
                className={`block p-4 rounded-xl border transition-all ${
                  isActive
                    ? "bg-card border-primary/20 shadow-sm hover:shadow-md"
                    : "bg-card border-border hover:border-primary/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold">#{order.orderNumber}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-1">
                  {order.items.map((i: any) => `${i.quantity}x ${i.product.name}`).join(", ")}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold">{formatPrice(order.total)}</span>
                  {isActive && (
                    <span className="text-xs text-primary font-medium">
                      Acompanhar →
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
