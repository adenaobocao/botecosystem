import { Metadata } from "next";
import { db } from "@/lib/db";
import { serialize } from "@/lib/utils";
import { CriativoClient } from "@/components/dashboard/marketing/criativo-client";

export const metadata: Metadata = { title: "Criativo | Marketing" };
export const dynamic = "force-dynamic";

async function getProductsForCreative() {
  const products = await db.product.findMany({
    where: { isAvailable: true, deletedAt: null },
    select: { id: true, name: true, image: true, basePrice: true, promoPrice: true },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
  });
  return serialize(products).map((p: any) => ({
    id: p.id,
    name: p.name,
    image: p.image,
    price: Number(p.promoPrice ?? p.basePrice),
  }));
}

export default async function CriativoPage() {
  const products = await getProductsForCreative();

  return <CriativoClient products={products} />;
}
