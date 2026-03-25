"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { updateOrderStatus } from "@/lib/actions/orders";

const columns = [
  { status: "CONFIRMED", label: "Novos", color: "border-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30", next: "PREPARING", nextLabel: "Preparar" },
  { status: "PREPARING", label: "Preparando", color: "border-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30", next: "READY", nextLabel: "Pronto" },
  { status: "READY", label: "Prontos", color: "border-green-500", bg: "bg-green-50 dark:bg-green-950/30", next: null, nextLabel: null },
];

function minutesAgo(date: string): number {
  return Math.floor((Date.now() - new Date(date).getTime()) / 60000);
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  origin?: string;
  type: string;
  tableNumber?: number | null;
  createdAt: string;
  items: { quantity: number; notes?: string | null; product: { name: string } }[];
}

export function KitchenBoard({ orders }: { orders: Order[] }) {
  const router = useRouter();

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 15000);
    return () => clearInterval(interval);
  }, [router]);

  async function handleAdvance(orderId: string, newStatus: string) {
    try {
      await updateOrderStatus(orderId, newStatus);
      router.refresh();
    } catch {
      // silently fail
    }
  }

  return (
    <div className="h-dvh flex flex-col bg-background">
      {/* KDS Header */}
      <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 h-14 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold">Cozinha</h1>
          <span className="text-xs text-muted-foreground">
            Auto-refresh 15s
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {orders.length} pedido{orders.length !== 1 ? "s" : ""} ativos
          </span>
          <button
            onClick={() => router.refresh()}
            className="h-8 px-3 text-xs font-medium bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Atualizar
          </button>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0 overflow-hidden">
        {columns.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.status);
          return (
            <div key={col.status} className="flex flex-col border-r border-border last:border-r-0 overflow-hidden">
              {/* Column header */}
              <div className={`shrink-0 px-4 py-3 border-b-2 ${col.color} ${col.bg}`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-wider">
                    {col.label}
                  </h2>
                  <span className="text-xs font-bold bg-background/80 px-2 py-0.5 rounded-full">
                    {colOrders.length}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {colOrders.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    Nenhum pedido
                  </div>
                )}
                {colOrders.map((order) => {
                  const mins = minutesAgo(order.createdAt);
                  const isUrgent = mins > 20;

                  return (
                    <div
                      key={order.id}
                      className={`p-4 rounded-xl border bg-card transition-all ${
                        isUrgent
                          ? "border-red-300 ring-1 ring-red-200 animate-pulse"
                          : "border-border"
                      }`}
                    >
                      {/* Order header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-black font-mono">
                            #{order.orderNumber}
                          </span>
                          {order.type === "TABLE" && order.tableNumber && (
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                              Mesa {order.tableNumber}
                            </span>
                          )}
                        </div>
                        <span className={`text-sm font-bold tabular-nums ${isUrgent ? "text-red-600" : "text-muted-foreground"}`}>
                          {mins}min
                        </span>
                      </div>

                      {/* Items — big readable font */}
                      <div className="space-y-2.5 mb-4">
                        {order.items.map((item, i) => (
                          <div key={i} className="border-b border-border/50 last:border-0 pb-2 last:pb-0">
                            <div className="flex items-start gap-2">
                              <span className="text-lg font-black text-primary min-w-[2rem]">
                                {item.quantity}x
                              </span>
                              <span className="text-base font-semibold leading-tight">
                                {item.product.name}
                              </span>
                            </div>
                            {item.notes && (
                              <div className="ml-8 mt-1 space-y-0.5">
                                {item.notes.split(" | ").map((note, j) => (
                                  <p key={j} className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                                    {note}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Action */}
                      {col.next && (
                        <button
                          onClick={() => handleAdvance(order.id, col.next!)}
                          className="w-full h-10 text-sm font-bold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                        >
                          {col.nextLabel}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
