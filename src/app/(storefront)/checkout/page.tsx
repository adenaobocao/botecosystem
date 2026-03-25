import { Metadata } from "next";
import { redirect } from "next/navigation";
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

  // Exige login pra fazer checkout
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/checkout");
  }

  const [suggestions, zones, addresses] = await Promise.all([
    getQuickSuggestions(),
    getDeliveryZones(),
    getUserAddresses(session.user.id),
  ]);

  return (
    <CheckoutForm
      suggestions={serialize(suggestions)}
      deliveryZones={serialize(zones)}
      addresses={serialize(addresses)}
      isLoggedIn={true}
    />
  );
}
