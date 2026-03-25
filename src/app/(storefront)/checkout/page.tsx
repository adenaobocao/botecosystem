import { Metadata } from "next";
import { CheckoutForm } from "@/components/storefront/checkout-form";
import { getQuickSuggestions } from "@/lib/queries/menu";
import { getDeliveryZones } from "@/lib/queries/delivery";
import { serialize } from "@/lib/utils";

export const metadata: Metadata = { title: "Checkout" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const [suggestions, zones] = await Promise.all([
    getQuickSuggestions(),
    getDeliveryZones(),
  ]);

  return <CheckoutForm suggestions={serialize(suggestions)} deliveryZones={serialize(zones)} />;
}
