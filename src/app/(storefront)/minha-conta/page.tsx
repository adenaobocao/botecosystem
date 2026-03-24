import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AccountDetails } from "@/components/storefront/account-details";

export const metadata: Metadata = {
  title: "Minha Conta",
};

export default async function MinhaContaPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/minha-conta");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-20 md:pb-8">
      <h1 className="text-xl font-bold tracking-tight">Minha conta</h1>
      <AccountDetails user={session.user} />
    </div>
  );
}
