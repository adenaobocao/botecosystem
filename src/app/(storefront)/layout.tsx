import { StorefrontHeader } from "@/components/storefront/header";
import { BottomNav } from "@/components/storefront/bottom-nav";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-dvh">
      <StorefrontHeader />
      <main className="flex-1">{children}</main>
      <BottomNav />
    </div>
  );
}
