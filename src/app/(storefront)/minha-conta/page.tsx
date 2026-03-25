import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AccountDetails } from "@/components/storefront/account-details";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Minha Conta",
};
export const dynamic = "force-dynamic";

export default async function MinhaContaPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/minha-conta");
  }

  // Busca dados completos do usuario
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      loyaltyPoints: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-20 md:pb-8">
      <h1 className="text-xl font-bold tracking-tight">Minha conta</h1>
      <AccountDetails user={user} />
    </div>
  );
}
