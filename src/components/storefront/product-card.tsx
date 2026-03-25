"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  basePrice: number | string;
  promoPrice?: number | string | null;
  isFeatured?: boolean;
  preparationTime?: number | null;
  _count?: { optionGroups: number; variants: number };
}

function formatPrice(price: number | string): string {
  return Number(price).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getDiscountPercent(base: number, promo: number): number {
  return Math.round(((base - promo) / base) * 100);
}

export function ProductCard({
  id,
  name,
  slug,
  description,
  image,
  basePrice,
  promoPrice,
  isFeatured,
  _count,
}: ProductCardProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const hasPromo = promoPrice !== null && promoPrice !== undefined;
  const effectivePrice = hasPromo ? Number(promoPrice) : Number(basePrice);
  const hasOptions = (_count?.optionGroups ?? 0) > 0 || (_count?.variants ?? 0) > 0;
  const discount = hasPromo ? getDiscountPercent(Number(basePrice), Number(promoPrice)) : 0;

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    // Sempre vai pra pagina de detalhe pra escolher opcoes/notas
    router.push(`/cardapio/${slug}`);
  }

  return (
    <Link
      href={`/cardapio/${slug}`}
      className="group relative flex gap-3 p-3 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all"
    >
      {/* Image */}
      <div className="relative shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="96px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-2xl">
            🍽️
          </div>
        )}
        {hasPromo && discount > 0 && (
          <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-md">
            -{discount}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 pr-4">
        <div>
          <h3 className="font-semibold text-sm leading-tight truncate">
            {name}
          </h3>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="mt-2 flex items-center gap-2">
          {hasPromo ? (
            <>
              <span className="text-sm font-bold text-primary">{formatPrice(promoPrice!)}</span>
              <span className="text-xs text-muted-foreground line-through">{formatPrice(basePrice)}</span>
            </>
          ) : (
            <span className="text-sm font-bold text-primary">{formatPrice(basePrice)}</span>
          )}
        </div>
      </div>

      {/* Quick add button */}
      <button
        onClick={handleQuickAdd}
        className="absolute bottom-2.5 right-2.5 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-sm hover:scale-110 active:scale-90 transition-transform"
        aria-label={`Adicionar ${name} ao carrinho`}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </Link>
  );
}
