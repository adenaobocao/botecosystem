"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

interface OptionChoice {
  id: string;
  name: string;
  priceModifier: number | string;
  isDefault: boolean;
}

interface OptionGroup {
  id: string;
  name: string;
  required: boolean;
  maxChoices: number;
  options: OptionChoice[];
}

interface Variant {
  id: string;
  name: string;
  priceModifier: number | string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ingredients: string | null;
  image: string | null;
  basePrice: number | string;
  promoPrice: number | string | null;
  isFeatured: boolean;
  preparationTime: number | null;
  category: { name: string; slug: string };
  variants: Variant[];
  optionGroups: OptionGroup[];
}

function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ProductDetail({ product }: { product: Product }) {
  const [selectedVariants, setSelectedVariants] = useState<Set<string>>(new Set());
  const [selectedOptions, setSelectedOptions] = useState<Record<string, Set<string>>>(() => {
    // Pre-select default options
    const defaults: Record<string, Set<string>> = {};
    product.optionGroups.forEach((g) => {
      const defaultIds = g.options.filter((o) => o.isDefault).map((o) => o.id);
      if (defaultIds.length > 0) defaults[g.id] = new Set(defaultIds);
    });
    return defaults;
  });
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const hasPromo = product.promoPrice !== null && product.promoPrice !== undefined;
  const effectiveBase = hasPromo ? Number(product.promoPrice) : Number(product.basePrice);

  const variantExtra = product.variants
    .filter((v) => selectedVariants.has(v.id))
    .reduce((sum, v) => sum + Number(v.priceModifier), 0);

  const optionExtra = Object.entries(selectedOptions).reduce((sum, [, choices]) => {
    return sum + product.optionGroups
      .flatMap((g) => g.options)
      .filter((o) => choices.has(o.id))
      .reduce((s, o) => s + Number(o.priceModifier), 0);
  }, 0);

  const unitPrice = effectiveBase + variantExtra + optionExtra;
  const totalPrice = unitPrice * quantity;

  function toggleVariant(id: string) {
    setSelectedVariants((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleOption(groupId: string, optionId: string, maxChoices: number) {
    setSelectedOptions((prev) => {
      const current = prev[groupId] || new Set<string>();
      const next = new Set(current);

      if (maxChoices === 1) {
        // Radio behavior
        return { ...prev, [groupId]: new Set([optionId]) };
      }

      // Checkbox behavior
      if (next.has(optionId)) next.delete(optionId);
      else if (next.size < maxChoices) next.add(optionId);
      return { ...prev, [groupId]: next };
    });
  }

  function handleAdd() {
    const selectedVariantsList = product.variants.filter((v) => selectedVariants.has(v.id));
    const variantName = selectedVariantsList.map((v) => v.name).join(", ");

    // Build options summary
    const optionsSummary = product.optionGroups
      .map((g) => {
        const chosen = g.options.filter((o) => selectedOptions[g.id]?.has(o.id));
        if (chosen.length === 0) return null;
        return chosen.map((o) => o.name).join(", ");
      })
      .filter(Boolean)
      .join(" | ");

    const fullVariant = [variantName, optionsSummary].filter(Boolean).join(" | ");

    addItem({
      productId: product.id,
      variantId: selectedVariantsList.length > 0
        ? selectedVariantsList.map((v) => v.id).join("+")
        : undefined,
      name: product.name,
      variantName: fullVariant || undefined,
      price: unitPrice,
      quantity,
      image: product.image,
      notes: notes || undefined,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  // Check if all required groups have selections
  const missingRequired = product.optionGroups.some(
    (g) => g.required && (!selectedOptions[g.id] || selectedOptions[g.id].size === 0)
  );

  return (
    <div className="max-w-3xl mx-auto">
      {/* Image */}
      <div className="relative w-full aspect-[4/3] bg-muted">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground">
            🍽️
          </div>
        )}
        {hasPromo && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg uppercase">
            Promo
          </span>
        )}
      </div>

      <div className="px-4 py-6 space-y-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/cardapio" className="hover:text-foreground">Cardapio</Link>
          <span>/</span>
          <Link href={`/cardapio?categoria=${product.category.slug}`} className="hover:text-foreground">
            {product.category.name}
          </Link>
        </div>

        {/* Title and price */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-xl font-bold tracking-tight">{product.name}</h1>
            {product.isFeatured && (
              <span className="shrink-0 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-md uppercase tracking-wide">
                Destaque
              </span>
            )}
          </div>
          {product.description && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          )}
          {product.ingredients && (
            <p className="mt-1.5 text-xs text-muted-foreground/70 italic">
              Ingredientes: {product.ingredients}
            </p>
          )}
          <div className="mt-3 flex items-center gap-3">
            {hasPromo ? (
              <>
                <span className="text-xl font-bold text-primary">{formatPrice(Number(product.promoPrice))}</span>
                <span className="text-sm text-muted-foreground line-through">{formatPrice(Number(product.basePrice))}</span>
                <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-[10px] font-bold rounded">
                  -{Math.round((1 - Number(product.promoPrice) / Number(product.basePrice)) * 100)}%
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-primary">{formatPrice(Number(product.basePrice))}</span>
            )}
          </div>
        </div>

        {/* Option Groups — tipo do pao, retirar itens, ponto da carne */}
        {product.optionGroups.map((group) => (
          <div key={group.id}>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-sm font-semibold">{group.name}</h2>
              {group.required && (
                <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-[9px] font-bold rounded uppercase">
                  Obrigatorio
                </span>
              )}
              {group.maxChoices > 1 && (
                <span className="text-[10px] text-muted-foreground">
                  (max {group.maxChoices})
                </span>
              )}
            </div>
            <div className="space-y-1.5">
              {group.options.map((opt) => {
                const isSelected = selectedOptions[group.id]?.has(opt.id) ?? false;
                const modifier = Number(opt.priceModifier);

                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleOption(group.id, opt.id, group.maxChoices)}
                    className={`flex items-center justify-between w-full p-3 rounded-xl border text-sm transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-${group.maxChoices === 1 ? "full" : "md"} border-2 flex items-center justify-center ${
                        isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                      }`}>
                        {isSelected && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium">{opt.name}</span>
                    </div>
                    {modifier !== 0 && (
                      <span className="text-muted-foreground text-xs">
                        {modifier > 0 ? "+" : ""}{formatPrice(modifier)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Variants (adicionais) */}
        {product.variants.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold mb-2">Adicionais</h2>
            <div className="space-y-1.5">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => toggleVariant(variant.id)}
                  className={`flex items-center justify-between w-full p-3 rounded-xl border text-sm transition-colors ${
                    selectedVariants.has(variant.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                      selectedVariants.has(variant.id) ? "border-primary bg-primary" : "border-muted-foreground/30"
                    }`}>
                      {selectedVariants.has(variant.id) && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium">{variant.name}</span>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    + {formatPrice(Number(variant.priceModifier))}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="text-sm font-semibold block mb-2">
            Observacoes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: sem cebola, ponto da carne..."
            rows={2}
            maxLength={200}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors resize-none"
          />
        </div>

        {/* Quantity and CTA */}
        <div className="flex items-center gap-4 pb-20 md:pb-0">
          <div className="flex items-center border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              -
            </button>
            <span className="w-10 h-10 flex items-center justify-center text-sm font-semibold">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={missingRequired}
            className={`flex-1 h-12 rounded-xl font-semibold text-sm transition-all ${
              added
                ? "bg-green-600 text-white"
                : missingRequired
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          >
            {added ? "Adicionado!" : `Adicionar ${formatPrice(totalPrice)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
