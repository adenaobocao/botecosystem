"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { updateOrderStatus } from "@/lib/actions/orders";
import { PrintButton } from "./order-ticket";

const statusOptions = [
  { value: "ALL", label: "Todos" },
  { value: "PENDING", label: "Pendentes" },
  { value: "CONFIRMED", label: "Confirmados" },
  { value: "PREPARING", label: "Preparando" },
  { value: "READY", label: "Prontos" },
  { value: "DELIVERING", label: "Entregando" },
  { value: "DELIVERED", label: "Entregues" },
  { value: "CANCELLED", label: "Cancelados" },
];

const originOptions = [
  { value: "ALL", label: "Todas origens" },
  { value: "SITE", label: "Site" },
  { value: "IFOOD", label: "iFood" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "TABLE", label: "Mesa" },
];

const statusLabels: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
  CONFIRMED: { label: "Confirmado", className: "bg-blue-100 text-blue-800" },
  PREPARING: { label: "Preparando", className: "bg-orange-100 text-orange-800" },
  READY: { label: "Pronto", className: "bg-green-100 text-green-800" },
  DELIVERING: { label: "Entregando", className: "bg-purple-100 text-purple-800" },
  DELIVERED: { label: "Entregue", className: "bg-emerald-100 text-emerald-800" },
  CANCELLED: { label: "Cancelado", className: "bg-red-100 text-red-800" },
};

const nextStatusMap: Record<string, string> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "PREPARING",
  PREPARING: "READY",
  READY: "DELIVERING",
  DELIVERING: "DELIVERED",
};

const nextStatusLabels: Record<string, string> = {
  PENDING: "Confirmar",
  CONFIRMED: "Preparar",
  PREPARING: "Pronto",
  READY: "Entregar",
  DELIVERING: "Entregue",
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

function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  origin?: string;
  type: string;
  tableNumber?: number | null;
  total: number | string;
  notes?: string | null;
  createdAt: string;
  user: { name: string | null; email: string | null };
  items: { quantity: number; notes?: string | null; product: { name: string } }[];
  payments: { method: string; status: string }[];
}

export function OrdersList({
  orders,
  currentStatus,
  currentOrigin,
}: {
  orders: Order[];
  currentStatus: string;
  currentOrigin: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    startTransition(() => {
      router.push(`/dashboard/pedidos?${params.toString()}`);
    });
  }

  async function handleAdvance(orderId: string, newStatus: string) {
    try {
      await updateOrderStatus(orderId, newStatus);
      router.refresh();
    } catch {
      // silently fail for demo
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Status pills */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter("status", opt.value)}
              className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                currentStatus === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Origin select */}
        <select
          value={currentOrigin}
          onChange={(e) => setFilter("origin", e.target.value)}
          className="h-8 px-3 text-xs font-medium rounded-full border border-border bg-card text-foreground"
        >
          {originOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground">
        {orders.length} pedido{orders.length !== 1 ? "s" : ""}
        {isPending && " — atualizando..."}
      </p>

      {/* Orders */}
      {orders.length === 0 ? (
        <div className="p-12 text-center text-sm text-muted-foreground rounded-xl border border-border bg-card">
          Nenhum pedido encontrado
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const status = statusLabels[order.status] || { label: order.status, className: "bg-muted" };
            const nextStatus = nextStatusMap[order.status];
            const nextLabel = nextStatusLabels[order.status];

            return (
              <div
                key={order.id}
                className="p-4 rounded-xl border border-border bg-card"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-base font-bold">#{order.orderNumber}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${status.className}`}>
                      {status.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {originLabels[order.origin ?? "SITE"]}
                    </span>
                    {order.type === "TABLE" && order.tableNumber && (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                        Mesa {order.tableNumber}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatTime(order.createdAt)}
                  </span>
                </div>

                {/* Client */}
                <p className="text-xs text-muted-foreground mb-2">
                  {order.user?.name || order.user?.email || "Cliente anonimo"}
                  {order.payments?.[0] && (
                    <span className="ml-2">
                      — {order.payments[0].method === "PIX" ? "PIX" :
                         order.payments[0].method === "CREDIT_CARD" ? "Credito" :
                         order.payments[0].method === "DEBIT_CARD" ? "Debito" : "Dinheiro"}
                    </span>
                  )}
                </p>

                {/* Items */}
                <div className="space-y-1.5 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-muted-foreground">{item.quantity}x</span>
                        <span className="font-medium">{item.product.name}</span>
                      </div>
                      {item.notes && (
                        <div className="ml-7 flex flex-wrap gap-1 mt-0.5">
                          {item.notes.split(" | ").map((note, j) => (
                            <span key={j} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-[10px] font-medium rounded">
                              {note}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {order.notes && (
                  <p className="text-xs text-muted-foreground italic mb-3 p-2 bg-muted/50 rounded-lg">
                    Obs: {order.notes}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-lg font-bold">{formatBRL(order.total)}</span>
                  <div className="flex gap-2">
                    <PrintButton order={order} size="sm" />
                    {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                      <button
                        onClick={() => handleAdvance(order.id, "CANCELLED")}
                        className="h-8 px-3 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
                    {nextStatus && (
                      <button
                        onClick={() => handleAdvance(order.id, nextStatus)}
                        className="h-8 px-4 text-xs font-bold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                      >
                        {nextLabel}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
