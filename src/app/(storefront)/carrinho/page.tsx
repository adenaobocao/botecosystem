import { Metadata } from "next";
import { CartView } from "@/components/storefront/cart-view";

export const metadata: Metadata = { title: "Carrinho" };

export default function CarrinhoPage() {
  return <CartView />;
}
