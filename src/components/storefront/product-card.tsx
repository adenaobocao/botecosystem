"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  basePrice: number | string;
  isFeatured?: boolean;
  preparationTime: number | null;
}

function formatPrice(price: number | string): string {
  return Number(price).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Badges criativas — distribuidas por slug pra variar
const badgeVariants = [
  { text: "Mais vendido", bg: "bg-amber-500", fg: "text-white" },
  { text: "Promo", bg: "bg-green-500", fg: "text-white" },
  { text: "-18%", bg: "bg-red-500", fg: "text-white" },
  { text: "Novidade", bg: "bg-violet-500", fg: "text-white" },
  { text: "Top 3", bg: "bg-blue-500", fg: "text-white" },
  { text: "Imperdivel", bg: "bg-pink-500", fg: "text-white" },
];

function getBadge(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash + slug.charCodeAt(i)) | 0;
  }
  return badgeVariants[Math.abs(hash) % badgeVariants.length];
}

export function ProductCard({
  id,
  name,
  slug,
  description,
  image,
  basePrice,
  isFeatured,
  preparationTime,
}: ProductCardProps) {
  const { addItem } = useCart();
  const badge = isFeatured ? getBadge(slug) : null;

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: id,
      name,
      price: Number(basePrice),
      image,
    });
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
        {badge && (
          <span className={`absolute top-1 left-1 px-1.5 py-0.5 ${badge.bg} ${badge.fg} text-[10px] font-bold rounded-md uppercase tracking-wide`}>
            {badge.text}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 pr-8">
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

        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-primary">
            {formatPrice(basePrice)}
          </span>
          {preparationTime && (
            <span className="text-[11px] text-muted-foreground">
              ~{preparationTime} min
            </span>
          )}
        </div>
      </div>

      {/* Quick add button */}
      <button
        onClick={handleQuickAdd}
        className="absolute bottom-3 right-3 w-9 h-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-90 transition-transform"
        aria-label={`Adicionar ${name} ao carrinho`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </Link>
  );
}
