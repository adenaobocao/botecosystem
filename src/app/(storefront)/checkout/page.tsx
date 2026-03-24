import { Metadata } from "next";
import { CheckoutForm } from "@/components/storefront/checkout-form";
import { getQuickSuggestions } from "@/lib/queries/menu";
import { serialize } from "@/lib/utils";

export const metadata: Metadata = { title: "Checkout" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const suggestions = serialize(await getQuickSuggestions());

  return <CheckoutForm suggestions={suggestions} />;
}
