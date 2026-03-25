import { getAllReservations } from "@/lib/queries/reservations";
import { serialize } from "@/lib/utils";
import { ReservationsManager } from "@/components/dashboard/reservations-manager";

export const dynamic = "force-dynamic";

export const metadata = { title: "Reservas | Boteco da Estacao" };

export default async function ReservasPage() {
  const reservations = serialize(await getAllReservations());

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reservas</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Gerencie reservas de mesa especial
        </p>
      </div>

      <ReservationsManager reservations={reservations} />
    </div>
  );
}
