import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  basePrice: number | string;
  isFeatured: boolean;
  preparationTime: number | null;
}

function formatPrice(price: number | string): string {
  return Number(price).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function ProductCard({
  name,
  slug,
  description,
  image,
  basePrice,
  isFeatured,
  preparationTime,
}: ProductCardProps) {
  return (
    <Link
      href={`/cardapio/${slug}`}
      className="group flex gap-3 p-3 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all"
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
        {isFeatured && (
          <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-md uppercase tracking-wide">
            Destaque
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
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
    </Link>
  );
}
