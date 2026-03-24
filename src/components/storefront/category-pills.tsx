"use client";

import { cn } from "@/lib/utils";

interface CategoryPillsProps {
  categories: { id: string; name: string; slug: string }[];
  activeSlug: string | null;
  onSelect: (slug: string | null) => void;
}

export function CategoryPills({
  categories,
  activeSlug,
  onSelect,
}: CategoryPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 -mx-4 px-4">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors",
          activeSlug === null
            ? "bg-foreground text-background"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        )}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.slug)}
          className={cn(
            "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors",
            activeSlug === cat.slug
              ? "bg-foreground text-background"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
