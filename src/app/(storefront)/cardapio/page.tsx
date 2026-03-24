import { Metadata } from "next";
export const dynamic = "force-dynamic";
import { getCategoriesWithProducts } from "@/lib/queries/menu";
import { MenuView } from "@/components/storefront/menu-view";
import { serialize } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cardapio",
  description:
    "Confira o cardapio completo do Boteco da Estacao. Hamburgueres artesanais, porcoes, cervejas e muito mais.",
};

export default async function CardapioPage() {
  const categories = await getCategoriesWithProducts();

  return (
    <div className="pb-20 md:pb-8">
      <MenuView categories={serialize(categories)} />
    </div>
  );
}
