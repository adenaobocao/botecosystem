"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { createOrder } from "@/lib/actions/checkout";
import Link from "next/link";
import Image from "next/image";
import { DeliveryZonePicker } from "./delivery-zone-picker";

function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type OrderType = "DELIVERY" | "PICKUP" | "TABLE";

const orderTypes = [
  { value: "DELIVERY" as OrderType, label: "Entrega", desc: "Receba em casa", icon: "🛵" },
  { value: "PICKUP" as OrderType, label: "Retirada", desc: "Busque no balcao", icon: "🏪" },
  { value: "TABLE" as OrderType, label: "Mesa", desc: "Consumo no local", icon: "🪑" },
];

interface Suggestion {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  basePrice: number | string;
}

interface DeliveryZone {
  id: string;
  name: string;
  fee: number | string;
  estimatedMin: number;
  neighborhoods: { id: string; name: string }[];
}

interface CheckoutFormProps {
  suggestions?: Suggestion[];
  deliveryZones?: DeliveryZone[];
}

export function CheckoutForm({ suggestions = [], deliveryZones = [] }: CheckoutFormProps) {
  const { items, subtotal, clearCart, addItem } = useCart();
  const router = useRouter();
  const [type, setType] = useState<OrderType>("DELIVERY");
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deliveryFeeFromZone, setDeliveryFeeFromZone] = useState<number | null>(null);
  const [deliveryEstimate, setDeliveryEstimate] = useState<number | null>(null);
  const [deliveryNeighborhood, setDeliveryNeighborhood] = useState("");

  const hasZones = deliveryZones.length > 0;
  const deliveryFee = type === "DELIVERY" ? (hasZones ? (deliveryFeeFromZone ?? 0) : 8.0) : 0;
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal + deliveryFee - discount;

  // Filter suggestions to exclude items already in cart
  const cartProductIds = new Set(items.map((i) => i.productId));
  const filteredSuggestions = suggestions.filter((s) => !cartProductIds.has(s.id));

  function handleCoupon() {
    if (coupon.toUpperCase().trim() === "BOTECO10") {
      setCouponApplied(true);
    }
  }

  function handleAddSuggestion(s: Suggestion) {
    addItem({
      productId: s.id,
      name: s.name,
      price: Number(s.basePrice),
      image: s.image,
    });
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h1 className="text-lg font-bold">Carrinho vazio</h1>
        <p className="text-sm text-muted-foreground mt-1">Adicione itens antes de finalizar</p>
        <Link
          href="/cardapio"
          className="inline-flex items-center justify-center h-11 px-6 mt-6 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-90 transition-opacity"
        >
          Ver cardapio
        </Link>
      </div>
    );
  }

  async function handleSubmit() {
    setError("");
    setLoading(true);

    try {
      const result = await createOrder({
        type,
        tableNumber: type === "TABLE" ? Number(tableNumber) || undefined : undefined,
        notes: notes || undefined,
        deliveryFee: type === "DELIVERY" ? deliveryFee : undefined,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          notes: item.notes,
        })),
      });

      clearCart();
      router.push(`/pedido-confirmado?pedido=${result.orderNumber}`);
    } catch {
      setError("Erro ao criar pedido. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-40 md:pb-6">
      <h1 className="text-xl font-bold tracking-tight mb-6">Finalizar pedido</h1>

      {/* Order type */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-3">Como quer receber?</h2>
        <div className="grid grid-cols-3 gap-2">
          {orderTypes.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setType(opt.value)}
              className={`p-3 rounded-xl border text-center transition-colors ${
                type === opt.value
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <span className="text-xl block mb-1">{opt.icon}</span>
              <span className={`text-sm font-semibold block ${type === opt.value ? "text-primary" : ""}`}>
                {opt.label}
              </span>
              <span className="text-[11px] text-muted-foreground">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table number */}
      {type === "TABLE" && (
        <div className="mb-6">
          <label className="text-sm font-semibold block mb-2">Numero da mesa</label>
          <input
            type="number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="Ex: 7"
            min={1}
            className="flex h-12 w-full rounded-xl border border-border bg-card px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
          />
        </div>
      )}

      {/* Delivery zone picker */}
      {type === "DELIVERY" && hasZones && (
        <div className="mb-6">
          <DeliveryZonePicker
            zones={deliveryZones}
            onSelect={(fee, est, neighborhood) => {
              setDeliveryFeeFromZone(fee);
              setDeliveryEstimate(est);
              setDeliveryNeighborhood(neighborhood);
            }}
          />
          {deliveryEstimate && (
            <p className="text-[11px] text-muted-foreground mt-1.5 ml-1">
              Tempo estimado: ~{deliveryEstimate} minutos
            </p>
          )}
        </div>
      )}

      {/* Notes */}
      <div className="mb-6">
        <label className="text-sm font-semibold block mb-2">Observacoes do pedido</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Algo a mais que precisamos saber?"
          rows={2}
          maxLength={300}
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors resize-none"
        />
      </div>

      {/* Complement suggestions */}
      {filteredSuggestions.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold mb-3">Combina com seu pedido</h2>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {filteredSuggestions.slice(0, 4).map((s) => (
              <button
                key={s.id}
                onClick={() => handleAddSuggestion(s)}
                className="shrink-0 w-[140px] p-2 bg-card border border-border rounded-xl hover:border-primary/30 transition-all text-left group"
              >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted mb-2">
                  {s.image ? (
                    <Image src={s.image} alt={s.name} fill className="object-cover" sizes="140px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl text-muted-foreground">🍽️</div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </div>
                </div>
                <p className="text-xs font-semibold truncate">{s.name}</p>
                <p className="text-xs text-primary font-bold">{formatPrice(Number(s.basePrice))}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Items summary */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-3">Resumo</h2>
        <div className="p-4 bg-card border border-border rounded-xl space-y-2">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantId || ""}`} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {item.quantity}x {item.name}
                {item.variantName ? ` (${item.variantName})` : ""}
              </span>
              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-border pt-2 mt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxa de entrega</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
            )}
            {couponApplied && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-medium">Cupom BOTECO10</span>
                <span className="text-green-600 font-medium">-{formatPrice(discount)}</span>
              </div>
            )}
          </div>
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-bold text-lg">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Coupon */}
      {!couponApplied && (
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Tem cupom? Digite aqui"
              maxLength={20}
              className="flex-1 h-11 rounded-xl border border-border bg-card px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
            />
            <button
              onClick={handleCoupon}
              disabled={!coupon.trim()}
              className="h-11 px-5 bg-secondary text-secondary-foreground font-semibold text-sm rounded-xl hover:bg-secondary/80 transition-colors disabled:opacity-50"
            >
              Aplicar
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1.5 ml-1">
            Primeira compra? Experimente BOTECO10
          </p>
        </div>
      )}
      {couponApplied && (
        <div className="mb-6 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200/60 dark:border-green-800/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-green-800 dark:text-green-300 font-medium">
                Cupom BOTECO10 aplicado — 10% off
              </span>
            </div>
            <button
              onClick={() => { setCouponApplied(false); setCoupon(""); }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Remover
            </button>
          </div>
        </div>
      )}

      {/* Payment info */}
      <div className="mb-6 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200/60 dark:border-green-800/30 rounded-xl">
        <div className="flex items-center gap-2 text-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 shrink-0">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span className="text-green-800 dark:text-green-300 font-medium">
            Pagamento via PIX — aprovacao automatica
          </span>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 font-medium mb-4">{error}</p>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || (type === "TABLE" && !tableNumber) || (type === "DELIVERY" && hasZones && deliveryFeeFromZone === null)}
        className="w-full h-13 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? "Enviando pedido..." : `Confirmar pedido — ${formatPrice(total)}`}
      </button>

      <Link
        href="/carrinho"
        className="flex items-center justify-center w-full h-11 mt-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        Voltar ao carrinho
      </Link>
    </div>
  );
}
