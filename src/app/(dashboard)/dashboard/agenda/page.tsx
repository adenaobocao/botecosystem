import { getAllEvents } from "@/lib/queries/events";
import { serialize } from "@/lib/utils";
import { AgendaManager } from "@/components/dashboard/agenda-manager";

export const dynamic = "force-dynamic";

export const metadata = { title: "Agenda | Boteco da Estacao" };

export default async function AgendaPage() {
  const events = serialize(await getAllEvents());

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Agenda</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Gerencie eventos, shows e programacao do Boteco
        </p>
      </div>

      <AgendaManager events={events} />
    </div>
  );
}
