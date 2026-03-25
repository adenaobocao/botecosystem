import { StorefrontHeader } from "@/components/storefront/header";
import { BottomNav } from "@/components/storefront/bottom-nav";
import { CartToast } from "@/components/storefront/cart-toast";
import { Botequinho } from "@/components/storefront/botequinho";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-dvh">
      <StorefrontHeader />
      <main className="flex-1">{children}</main>
      <CartToast />
      <Botequinho />
      <BottomNav />
    </div>
  );
}
