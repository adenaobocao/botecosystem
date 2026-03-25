import { Metadata } from "next";
import { CheckoutForm } from "@/components/storefront/checkout-form";
import { getQuickSuggestions } from "@/lib/queries/menu";
import { getDeliveryZones } from "@/lib/queries/delivery";
import { getUserAddresses } from "@/lib/queries/address";
import { auth } from "@/lib/auth";
import { serialize } from "@/lib/utils";

export const metadata: Metadata = { title: "Checkout" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await auth();

  const [suggestions, zones, addresses] = await Promise.all([
    getQuickSuggestions(),
    getDeliveryZones(),
    session?.user?.id ? getUserAddresses(session.user.id) : Promise.resolve([]),
  ]);

  return (
    <CheckoutForm
      suggestions={serialize(suggestions)}
      deliveryZones={serialize(zones)}
      addresses={serialize(addresses)}
      isLoggedIn={!!session?.user?.id}
    />
  );
}
