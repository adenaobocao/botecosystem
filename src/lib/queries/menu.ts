import { db } from "@/lib/db";

export async function getCategories() {
  return db.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image: true,
    },
  });
}

export async function getCategoriesWithProducts() {
  return db.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      products: {
        where: {
          isAvailable: true,
          deletedAt: null,
        },
        orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          image: true,
          basePrice: true,
          isFeatured: true,
          preparationTime: true,
        },
      },
    },
  });
}

export async function getProduct(slug: string) {
  return db.product.findUnique({
    where: { slug, deletedAt: null, isAvailable: true },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image: true,
      basePrice: true,
      isFeatured: true,
      preparationTime: true,
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      variants: {
        where: { isAvailable: true },
        select: {
          id: true,
          name: true,
          priceModifier: true,
        },
      },
    },
  });
}

export async function getFeaturedProducts() {
  return db.product.findMany({
    where: {
      isFeatured: true,
      isAvailable: true,
      deletedAt: null,
    },
    take: 6,
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image: true,
      basePrice: true,
      preparationTime: true,
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });
}
