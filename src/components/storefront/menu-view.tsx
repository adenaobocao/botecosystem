"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CategoryPills } from "./category-pills";
import { SearchBar } from "./search-bar";
import { ProductCard } from "./product-card";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  basePrice: number | string;
  isFeatured: boolean;
  preparationTime: number | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  products: Product[];
}

interface MenuViewProps {
  categories: Category[];
}

function MenuViewInner({ categories }: MenuViewProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("categoria");

  const [activeCategory, setActiveCategory] = useState<string | null>(
    initialCategory
  );
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    const query = search.toLowerCase().trim();

    return categories
      .filter((cat) => !activeCategory || cat.slug === activeCategory)
      .map((cat) => ({
        ...cat,
        products: cat.products.filter((p) => {
          if (!query) return true;
          return (
            p.name.toLowerCase().includes(query) ||
            (p.description?.toLowerCase().includes(query) ?? false)
          );
        }),
      }))
      .filter((cat) => cat.products.length > 0);
  }, [categories, activeCategory, search]);

  const totalProducts = filteredCategories.reduce(
    (acc, cat) => acc + cat.products.length,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="sticky top-14 z-40 bg-background/80 backdrop-blur-lg -mx-4 px-4 pt-4 pb-3 space-y-3">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryPills
          categories={categories}
          activeSlug={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

      {/* Products */}
      {totalProducts === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium">Nenhum item encontrado</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tente buscar por outro termo ou selecione outra categoria
          </p>
          <button
            onClick={() => {
              setSearch("");
              setActiveCategory(null);
            }}
            className="mt-4 text-sm font-medium text-primary hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="space-y-8 pt-4">
          {filteredCategories.map((category) => (
            <section key={category.id}>
              <h2 className="text-base font-bold tracking-tight mb-3">
                {category.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

export function MenuView({ categories }: MenuViewProps) {
  return (
    <Suspense>
      <MenuViewInner categories={categories} />
    </Suspense>
  );
}
