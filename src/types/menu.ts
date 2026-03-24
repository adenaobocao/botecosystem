export interface MenuProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  basePrice: number | string;
  isFeatured: boolean;
  preparationTime: number | null;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  products: MenuProduct[];
}

export interface ProductDetail extends MenuProduct {
  category: {
    name: string;
    slug: string;
  };
  variants: {
    id: string;
    name: string;
    priceModifier: number | string;
  }[];
}
