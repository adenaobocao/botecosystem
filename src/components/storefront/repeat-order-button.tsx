"use client";

import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";

interface OrderItemData {
  productId: string;
  quantity: number;
  totalPrice: number | string;
  product: {
    name: string;
    image: string | null;
  };
}

export function RepeatOrderButton({ items }: { items: OrderItemData[] }) {
  const { addItem } = useCart();
  const router = useRouter();

  function handleRepeat() {
    items.forEach((item) => {
      addItem({
        productId: item.productId,
        name: item.product.name,
        price: Number(item.totalPrice) / item.quantity,
        quantity: item.quantity,
        image: item.product.image,
      });
    });
    router.push("/carrinho");
  }

  return (
    <button
      onClick={handleRepeat}
      className="flex items-center justify-center gap-2 w-full h-12 bg-secondary text-secondary-foreground font-bold text-sm rounded-xl hover:bg-secondary/80 transition-colors"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
        <path d="M16 16h5v5" />
      </svg>
      Pedir de novo
    </button>
  );
}
