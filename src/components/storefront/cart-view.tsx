"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";

function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function CartView() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        {/* Ilustracao carrinho vazio */}
        <div className="w-28 h-28 mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-primary/40">
              <circle cx="8" cy="21" r="1.5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="19" cy="21" r="1.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {/* Detalhes decorativos */}
          <div className="absolute top-2 right-4 w-2 h-2 bg-accent/30 rounded-full" />
          <div className="absolute bottom-4 left-3 w-1.5 h-1.5 bg-primary/20 rounded-full" />
        </div>
        <h1 className="text-xl font-bold">Seu carrinho esta vazio</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-[250px] mx-auto">
          Que tal dar uma olhada no nosso cardapio? Tem hamburguer, porcao, drinks...
        </p>
        <Link
          href="/cardapio"
          className="inline-flex items-center justify-center h-12 px-8 mt-6 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-90 transition-opacity shadow-sm"
        >
          Ver cardapio
        </Link>
        <p className="text-[11px] text-muted-foreground mt-3">
          Entrega e retirada disponiveis
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-40 md:pb-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold tracking-tight">Carrinho</h1>
        <button
          onClick={clearCart}
          className="text-xs text-muted-foreground hover:text-red-600 transition-colors"
        >
          Limpar tudo
        </button>
      </div>

      {/* Items */}
      <div className="space-y-3 mb-6">
        {items.map((item) => {
          const key = `${item.productId}-${item.variantId || ""}`;
          return (
            <div key={key} className="flex gap-3 p-3 bg-card border border-border rounded-xl">
              {/* Image */}
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-lg">
                    🍽️
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold leading-tight">{item.name}</h3>
                {item.variantName && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">+ {item.variantName}</p>
                )}
                {item.notes && (
                  <p className="text-[11px] text-muted-foreground italic mt-0.5">{item.notes}</p>
                )}
                <p className="text-sm font-bold text-primary mt-1">{formatPrice(item.price)}</p>
              </div>

              {/* Quantity + remove */}
              <div className="flex flex-col items-end justify-between shrink-0">
                <button
                  onClick={() => removeItem(item.productId, item.variantId)}
                  className="text-muted-foreground hover:text-red-600 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </svg>
                </button>
                <div className="flex items-center gap-1 border border-border rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                    className="w-7 h-7 flex items-center justify-center text-xs text-muted-foreground hover:text-foreground"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-xs font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                    className="w-7 h-7 flex items-center justify-center text-xs text-muted-foreground hover:text-foreground"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="p-4 bg-card border border-border rounded-xl space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Taxa de entrega</span>
          <span className="text-muted-foreground text-xs">Definida no checkout</span>
        </div>
        <div className="border-t border-border pt-3 flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold text-lg">{formatPrice(subtotal)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Link
          href="/checkout"
          className="flex items-center justify-center w-full h-12 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-90 transition-opacity"
        >
          Finalizar pedido
        </Link>
        <Link
          href="/cardapio"
          className="flex items-center justify-center w-full h-11 bg-secondary text-secondary-foreground font-semibold text-sm rounded-xl hover:bg-secondary/80 transition-colors"
        >
          Adicionar mais itens
        </Link>
      </div>
    </div>
  );
}
