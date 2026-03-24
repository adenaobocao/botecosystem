import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/queries/menu";
import { ProductDetail } from "@/components/storefront/product-detail";
import { serialize } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Produto nao encontrado" };
  }

  return {
    title: product.name,
    description:
      product.description ?? `${product.name} no Boteco da Estacao`,
    openGraph: {
      title: product.name,
      description:
        product.description ?? `${product.name} no Boteco da Estacao`,
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="pb-20 md:pb-8">
      <ProductDetail product={serialize(product)} />
    </div>
  );
}
