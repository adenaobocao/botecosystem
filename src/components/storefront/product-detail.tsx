"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

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
  image: string | null;
  basePrice: number | string;
  isFeatured: boolean;
  preparationTime: number | null;
  category: {
    name: string;
    slug: string;
  };
  variants: Variant[];
}

function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function ProductDetail({ product }: { product: Product }) {
  const [selectedVariants, setSelectedVariants] = useState<Set<string>>(
    new Set()
  );
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const basePrice = Number(product.basePrice);
  const variantExtra = product.variants
    .filter((v) => selectedVariants.has(v.id))
    .reduce((sum, v) => sum + Number(v.priceModifier), 0);
  const unitPrice = basePrice + variantExtra;
  const totalPrice = unitPrice * quantity;

  function toggleVariant(id: string) {
    setSelectedVariants((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleAdd() {
    const selectedVariantsList = product.variants.filter((v) =>
      selectedVariants.has(v.id)
    );
    const variantName = selectedVariantsList.map((v) => v.name).join(", ");

    addItem({
      productId: product.id,
      variantId: selectedVariantsList.length > 0
        ? selectedVariantsList.map((v) => v.id).join("+")
        : undefined,
      name: product.name,
      variantName: variantName || undefined,
      price: unitPrice,
      quantity,
      image: product.image,
      notes: notes || undefined,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

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
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/cardapio" className="hover:text-foreground">
            Cardapio
          </Link>
          <span>/</span>
          <Link
            href={`/cardapio?categoria=${product.category.slug}`}
            className="hover:text-foreground"
          >
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
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xl font-bold text-primary">
              {formatPrice(basePrice)}
            </span>
            {product.preparationTime && (
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                ~{product.preparationTime} min
              </span>
            )}
          </div>
        </div>

        {/* Variants */}
        {product.variants.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold mb-2">Adicionais</h2>
            <div className="space-y-2">
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
                  <span className="font-medium">{variant.name}</span>
                  <span className="text-muted-foreground">
                    + {formatPrice(Number(variant.priceModifier))}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className="text-sm font-semibold block mb-2"
          >
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
            className={`flex-1 h-12 rounded-xl font-semibold text-sm transition-all ${
              added
                ? "bg-green-600 text-white"
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
