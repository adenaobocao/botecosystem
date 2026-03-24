import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getOrderDetail } from "@/lib/queries/my-orders";
import { serialize } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { RepeatOrderButton } from "@/components/storefront/repeat-order-button";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ orderNumber: string }> }): Promise<Metadata> {
  const { orderNumber } = await params;
  return { title: `Pedido #${orderNumber}` };
}

const statusSteps = [
  { key: "CONFIRMED", label: "Confirmado", icon: "check" },
  { key: "PREPARING", label: "Preparando", icon: "cook" },
  { key: "READY", label: "Pronto", icon: "ready" },
  { key: "DELIVERING", label: "Saiu pra entrega", icon: "delivery" },
  { key: "DELIVERED", label: "Entregue", icon: "done" },
];

function getStepIndex(status: string): number {
  const idx = statusSteps.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : -1;
}

function formatPrice(v: number | string) {
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function StepIcon({ type, done, active }: { type: string; done: boolean; active: boolean }) {
  const base = `w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
    done ? "bg-green-500 text-white" : active ? "bg-primary text-primary-foreground animate-progress-pulse" : "bg-muted text-muted-foreground"
  }`;

  const iconProps = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  return (
    <div className={base}>
      {type === "check" && <svg {...iconProps}><polyline points="20 6 9 17 4 12" /></svg>}
      {type === "cook" && <svg {...iconProps}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
      {type === "ready" && <svg {...iconProps}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>}
      {type === "delivery" && <svg {...iconProps}><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" /><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" /><circle cx="7" cy="18" r="2" /><path d="M15 18H9" /><circle cx="17" cy="18" r="2" /></svg>}
      {type === "done" && <svg {...iconProps}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
    </div>
  );
}

export default async function OrderStatusPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/meus-pedidos");

  const { orderNumber } = await params;
  const order = serialize(await getOrderDetail(orderNumber));
  if (!order) notFound();

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === "CANCELLED";
  const isPending = order.status === "PENDING";
  const isDelivery = order.type === "DELIVERY";
  const isDelivered = order.status === "DELIVERED";

  // WhatsApp message for delivery notification
  const whatsappMsg = encodeURIComponent(
    `Oi! Quero ser avisado(a) quando meu pedido #${order.orderNumber} sair pra entrega. Obrigado!`
  );

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/meus-pedidos" className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Pedido #{order.orderNumber}</h1>
          <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>
      </div>

      {/* Cancelled state */}
      {isCancelled && (
        <div className="p-4 mb-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-xl text-center">
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">Pedido cancelado</p>
        </div>
      )}

      {/* Pending state */}
      {isPending && (
        <div className="p-4 mb-6 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800/30 rounded-xl text-center">
          <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">Aguardando confirmacao</p>
        </div>
      )}

      {/* Timeline — so mostra se nao cancelado/pendente */}
      {!isCancelled && !isPending && (
        <div className="mb-8 p-5 bg-card border border-border rounded-2xl">
          <h2 className="text-sm font-semibold mb-5">Status do pedido</h2>
          <div className="space-y-0">
            {statusSteps.map((step, i) => {
              const done = i < currentStep;
              const active = i === currentStep;
              const isLast = i === statusSteps.length - 1;

              return (
                <div key={step.key} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <StepIcon type={step.icon} done={done} active={active} />
                    {!isLast && (
                      <div className={`w-0.5 h-8 my-1 rounded-full transition-colors ${
                        done
                          ? "bg-green-500"
                          : active
                          ? "animate-status-flow w-1 rounded-full"
                          : "bg-muted"
                      }`} />
                    )}
                  </div>
                  <div className="pt-2.5 pb-4">
                    <p className={`text-sm font-semibold leading-tight ${
                      done ? "text-green-700 dark:text-green-400"
                        : active ? "text-foreground"
                        : "text-muted-foreground"
                    }`}>
                      {step.label}
                    </p>
                    {active && (
                      <p className="text-xs text-primary font-medium mt-0.5 animate-progress-pulse">Agora</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WhatsApp notification CTA */}
      {isDelivery && !isCancelled && order.status !== "DELIVERED" && (
        <a
          href={`https://wa.me/5542999327823?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 mb-6 bg-green-50 dark:bg-green-950/20 border border-green-200/60 dark:border-green-800/30 rounded-xl hover:bg-green-100 dark:hover:bg-green-950/30 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-800 dark:text-green-300">Avise-me no WhatsApp</p>
            <p className="text-xs text-green-700/70 dark:text-green-400/70">Receba um aviso quando seu pedido sair pra entrega</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 shrink-0">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </a>
      )}

      {/* Order items */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-3">Itens do pedido</h2>
        <div className="space-y-2">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                {item.product.image ? (
                  <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="48px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">🍽️</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight">{item.product.name}</p>
                {item.notes && <p className="text-[11px] text-muted-foreground italic">{item.notes}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">{item.quantity}x</p>
                <p className="text-sm font-semibold">{formatPrice(item.totalPrice)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="p-4 bg-card border border-border rounded-xl space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        {Number(order.deliveryFee) > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Entrega</span>
            <span>{formatPrice(order.deliveryFee)}</span>
          </div>
        )}
        {Number(order.discount) > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Desconto</span>
            <span className="text-green-600">-{formatPrice(order.discount)}</span>
          </div>
        )}
        <div className="border-t border-border pt-2 flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold text-lg">{formatPrice(order.total)}</span>
        </div>
      </div>

      {/* Payment info */}
      {order.payments?.[0] && (
        <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200/60 dark:border-green-800/30 rounded-xl mb-6">
          <div className="flex items-center gap-2 text-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-green-800 dark:text-green-300 font-medium">
              Pago via {order.payments[0].method === "PIX" ? "PIX" : order.payments[0].method === "CREDIT_CARD" ? "Cartao de credito" : order.payments[0].method}
            </span>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="space-y-2">
        {/* Repeat order — for delivered/cancelled orders */}
        {(isDelivered || isCancelled) && order.items.length > 0 && (
          <RepeatOrderButton items={order.items} />
        )}

        <Link
          href="/cardapio"
          className="flex items-center justify-center w-full h-12 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-90 transition-opacity"
        >
          Fazer novo pedido
        </Link>
      </div>
    </div>
  );
}
