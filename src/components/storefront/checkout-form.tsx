"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { createOrder } from "@/lib/actions/checkout";
import Link from "next/link";
import Image from "next/image";
import { DeliveryZonePicker } from "./delivery-zone-picker";
import { AddressPicker } from "./address-picker";

function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type OrderType = "DELIVERY" | "PICKUP" | "TABLE";
type PaymentMethod = "PIX" | "CREDIT_CARD" | "CASH";

const orderTypes = [
  { value: "DELIVERY" as OrderType, label: "Entrega", desc: "Receba em casa", icon: "🛵" },
  { value: "PICKUP" as OrderType, label: "Retirada", desc: "Busque no balcao", icon: "🏪" },
  { value: "TABLE" as OrderType, label: "Mesa", desc: "Consumo no local", icon: "🪑" },
];

const paymentMethods = [
  { value: "PIX" as PaymentMethod, label: "PIX", desc: "Aprovacao instantanea", icon: "pix" },
  { value: "CREDIT_CARD" as PaymentMethod, label: "Cartao", desc: "Credito ou debito", icon: "card" },
  { value: "CASH" as PaymentMethod, label: "Dinheiro", desc: "Pague na entrega", icon: "cash" },
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

interface UserAddress {
  id: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface CheckoutFormProps {
  suggestions?: Suggestion[];
  deliveryZones?: DeliveryZone[];
  addresses?: UserAddress[];
  isLoggedIn?: boolean;
}

// ============================================================
// Componente de QR Code PIX
// ============================================================
function PixPaymentView({
  qrCode,
  qrCodeBase64,
  orderNumber,
  orderId,
  total,
}: {
  qrCode: string;
  qrCodeBase64: string;
  orderNumber: string;
  orderId: string;
  total: number;
}) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(true);

  // Polling pra checar se pagamento foi aprovado
  const pollPayment = useCallback(async () => {
    try {
      const res = await fetch(`/api/payments/status?orderId=${orderId}`);
      const data = await res.json();
      if (data.status === "APPROVED") {
        setChecking(false);
        router.push(`/pedido-confirmado?pedido=${orderNumber}`);
      }
    } catch {
      // silently retry
    }
  }, [orderId, orderNumber, router]);

  useEffect(() => {
    const interval = setInterval(pollPayment, 3000);
    // Timeout de 10 min
    const timeout = setTimeout(() => setChecking(false), 10 * 60 * 1000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pollPayment]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-green-600">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-xl font-bold">Pague com PIX</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pedido #{orderNumber} — {formatPrice(total)}
        </p>
      </div>

      {/* QR Code */}
      {qrCodeBase64 && (
        <div className="inline-block p-4 bg-white rounded-2xl shadow-sm border border-border mb-4">
          <img
            src={`data:image/png;base64,${qrCodeBase64}`}
            alt="QR Code PIX"
            className="w-48 h-48"
          />
        </div>
      )}

      {/* Copia e cola */}
      <div className="mb-6">
        <p className="text-xs text-muted-foreground mb-2">Ou copie o codigo PIX:</p>
        <div className="flex gap-2 max-w-xs mx-auto">
          <input
            type="text"
            value={qrCode}
            readOnly
            className="flex-1 h-10 px-3 text-xs bg-muted rounded-lg border border-border truncate"
          />
          <button
            onClick={handleCopy}
            className={`h-10 px-4 text-xs font-semibold rounded-lg transition-colors ${
              copied
                ? "bg-green-500 text-white"
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          >
            {copied ? "Copiado!" : "Copiar"}
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="p-4 bg-card border border-border rounded-xl">
        {checking ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">Aguardando pagamento...</span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Tempo esgotado. Se ja pagou, aguarde ou entre em contato.
          </p>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground mt-4">
        O pagamento e confirmado automaticamente em segundos.
      </p>
    </div>
  );
}

// ============================================================
// Checkout Form principal
// ============================================================
export function CheckoutForm({ suggestions = [], deliveryZones = [], addresses = [], isLoggedIn = false }: CheckoutFormProps) {
  const { items, subtotal, clearCart, addItem } = useCart();
  const router = useRouter();
  const [type, setType] = useState<OrderType>("DELIVERY");
  const [payment, setPayment] = useState<PaymentMethod>("PIX");
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deliveryFeeFromZone, setDeliveryFeeFromZone] = useState<number | null>(null);
  const [deliveryEstimate, setDeliveryEstimate] = useState<number | null>(null);
  const [deliveryNeighborhood, setDeliveryNeighborhood] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null);

  // Estado pra tela de PIX
  const [pixData, setPixData] = useState<{
    qrCode: string;
    qrCodeBase64: string;
    orderNumber: string;
    orderId: string;
    total: number;
  } | null>(null);

  const hasZones = deliveryZones.length > 0;
  const deliveryFee = type === "DELIVERY" ? (hasZones ? (deliveryFeeFromZone ?? 0) : 8.0) : 0;
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal + deliveryFee - discount;

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

  // Se tela de PIX ta ativa, mostra ela
  if (pixData) {
    return <PixPaymentView {...pixData} />;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-28 h-28 mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-primary/40">
              <circle cx="8" cy="21" r="1.5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="19" cy="21" r="1.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <h1 className="text-lg font-bold">Adicione itens antes de finalizar</h1>
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
        addressId: type === "DELIVERY" && selectedAddress ? selectedAddress.id : undefined,
        paymentMethod: payment === "CREDIT_CARD" ? "CREDIT_CARD" : payment,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          notes: [item.variantName, item.notes].filter(Boolean).join(" | ") || undefined,
        })),
      });

      // PIX com QR code real
      if (result.paymentMethod === "PIX" && "pix" in result) {
        setPixData({
          qrCode: result.pix.qrCode,
          qrCodeBase64: result.pix.qrCodeBase64,
          orderNumber: result.orderNumber,
          orderId: result.orderId,
          total,
        });
        setLoading(false);
        return;
      }

      // Cartao — redireciona pro checkout do Mercado Pago
      if (result.paymentMethod === "CARD" && "card" in result) {
        clearCart();
        window.location.href = result.card.checkoutUrl;
        return;
      }

      // Fallbacks (dinheiro, demo, MP nao configurado) — vai direto pra confirmacao
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

      {/* Address picker */}
      {type === "DELIVERY" && (
        <AddressPicker
          addresses={addresses}
          isLoggedIn={isLoggedIn}
          onSelect={(addr) => {
            setSelectedAddress(addr);
            if (addr && hasZones) {
              const allNeighborhoods = deliveryZones.flatMap((z) =>
                z.neighborhoods.map((n) => ({ ...n, fee: Number(z.fee), estimatedMin: z.estimatedMin }))
              );
              const match = allNeighborhoods.find(
                (n) => n.name.toLowerCase() === addr.neighborhood.toLowerCase()
              );
              if (match) {
                setDeliveryFeeFromZone(match.fee);
                setDeliveryEstimate(match.estimatedMin);
                setDeliveryNeighborhood(match.name);
              }
            }
          }}
        />
      )}

      {/* Delivery zone picker */}
      {type === "DELIVERY" && hasZones && !deliveryFeeFromZone && (
        <div className="mb-6">
          <DeliveryZonePicker
            zones={deliveryZones}
            onSelect={(fee, est, neighborhood) => {
              setDeliveryFeeFromZone(fee);
              setDeliveryEstimate(est);
              setDeliveryNeighborhood(neighborhood);
            }}
          />
        </div>
      )}

      {/* Delivery estimate */}
      {type === "DELIVERY" && deliveryEstimate && (
        <div className="mb-6 flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/30 rounded-xl">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 shrink-0">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="text-xs text-blue-800 dark:text-blue-300">
            Entrega em ~{deliveryEstimate}min — {deliveryNeighborhood} — {formatPrice(deliveryFee)}
          </span>
        </div>
      )}

      {/* Payment method */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-3">Forma de pagamento</h2>
        <div className="grid grid-cols-3 gap-2">
          {paymentMethods.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPayment(opt.value)}
              className={`p-3 rounded-xl border text-center transition-colors ${
                payment === opt.value
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <span className="block mb-1">
                {opt.icon === "pix" && (
                  <svg width="24" height="24" viewBox="0 0 24 24" className="mx-auto text-[#32BCAD]">
                    <path fill="currentColor" d="M18.09 15.59l-2.72-2.72a1.25 1.25 0 010-1.77l2.72-2.72a2.49 2.49 0 000-3.54l-.34-.34-3.54 3.54a2.74 2.74 0 000 3.88l3.54 3.54.34-.34a2.49 2.49 0 000-3.54zM5.91 8.38l2.72 2.72a1.25 1.25 0 010 1.77l-2.72 2.72a2.49 2.49 0 000 3.54l.34.34 3.54-3.54a2.74 2.74 0 000-3.88L6.25 8.51l-.34.34a2.49 2.49 0 000-.47z"/>
                  </svg>
                )}
                {opt.icon === "card" && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-blue-500">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                )}
                {opt.icon === "cash" && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-green-600">
                    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                  </svg>
                )}
              </span>
              <span className={`text-sm font-semibold block ${payment === opt.value ? "text-primary" : ""}`}>
                {opt.label}
              </span>
              <span className="text-[11px] text-muted-foreground">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

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

      {error && (
        <p className="text-sm text-red-600 font-medium mb-4">{error}</p>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || (type === "TABLE" && !tableNumber) || (type === "DELIVERY" && hasZones && deliveryFeeFromZone === null) || (type === "DELIVERY" && isLoggedIn && !selectedAddress)}
        className="w-full h-13 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processando...
          </span>
        ) : (
          `${payment === "PIX" ? "Pagar com PIX" : payment === "CREDIT_CARD" ? "Pagar com cartao" : "Confirmar pedido"} — ${formatPrice(total)}`
        )}
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
