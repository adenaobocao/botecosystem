import { getAllOrders } from "@/lib/queries/dashboard";
import { serialize } from "@/lib/utils";
import { OrdersList } from "@/components/dashboard/orders-list";

export const dynamic = "force-dynamic";

export const metadata = { title: "Pedidos | Boteco da Estacao" };

interface Props {
  searchParams: Promise<{ status?: string; origin?: string }>;
}

export default async function PedidosPage({ searchParams }: Props) {
  const params = await searchParams;
  const orders = serialize(await getAllOrders({
    status: params.status,
    origin: params.origin,
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pedidos</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Gerencie todos os pedidos do Boteco
        </p>
      </div>

      <OrdersList
        orders={orders}
        currentStatus={params.status || "ALL"}
        currentOrigin={params.origin || "ALL"}
      />
    </div>
  );
}
