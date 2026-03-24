import { getOrdersByStatus } from "@/lib/queries/dashboard";
import { serialize } from "@/lib/utils";
import { KitchenBoard } from "@/components/dashboard/kitchen-board";

export const dynamic = "force-dynamic";

export const metadata = { title: "Cozinha | Boteco da Estacao" };

export default async function CozinhaPage() {
  const orders = serialize(
    await getOrdersByStatus(["CONFIRMED", "PREPARING", "READY"])
  );

  return <KitchenBoard orders={orders} />;
}
