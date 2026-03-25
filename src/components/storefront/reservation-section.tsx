"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { createReservation } from "@/lib/actions/reservations";

interface ReservationSectionProps {
  tableStatus: {
    available: boolean;
    reservation: {
      status: string;
      userName: string;
      time: string;
    } | null;
  };
}

export function ReservationSection({ tableStatus }: ReservationSectionProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("20:00");
  const [partySize, setPartySize] = useState(2);
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user) {
      setError("Faca login para reservar");
      return;
    }
    setError("");
    startTransition(async () => {
      try {
        await createReservation({ date, time, partySize, notes: notes || undefined });
        setSuccess(true);
        setOpen(false);
        setDate("");
        setNotes("");
        setTimeout(() => setSuccess(false), 5000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao reservar");
      }
    });
  }

  // Minimo: amanha
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 10);
  const maxDate = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="p-4 rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 1.74.5 3.37 1.41 4.84.95 1.54 2.2 2.86 3.16 4.4.47.75.93 1.56 1.43 2.76.5-1.2.96-2.01 1.43-2.76.96-1.53 2.21-2.86 3.16-4.4C16.5 12.37 17 10.74 17 9c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold">Mesa Especial</p>
              <p className="text-[11px] text-muted-foreground">Sofa VIP - reserve seu lugar</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${
                tableStatus.available ? "bg-green-500" : "bg-amber-500"
              }`} />
              <span className="text-xs font-medium text-muted-foreground">
                {tableStatus.available ? "Disponivel hoje" : tableStatus.reservation?.status === "PENDING" ? "Reserva pendente" : "Reservado hoje"}
              </span>
            </div>

            <button
              onClick={() => setOpen(!open)}
              className="h-9 px-4 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-lg hover:bg-amber-500/20 transition-colors"
            >
              Reservar
            </button>
          </div>
        </div>

        {/* Success message */}
        {success && (
          <div className="mt-3 p-2.5 bg-green-50 dark:bg-green-950/20 border border-green-200/60 dark:border-green-800/30 rounded-lg">
            <p className="text-xs text-green-700 dark:text-green-400 font-medium text-center">
              Reserva enviada! Aguarde a confirmacao do Boteco.
            </p>
          </div>
        )}

        {/* Reservation form */}
        {open && (
          <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-border space-y-3">
            {!session?.user && (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                Faca login para reservar sua mesa
              </p>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Data</label>
                <input
                  type="date"
                  required
                  min={minDate}
                  max={maxDate}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 flex h-9 w-full rounded-lg border border-border bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Horario</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1 flex h-9 w-full rounded-lg border border-border bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary"
                >
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                  <option value="20:00">20:00</option>
                  <option value="21:00">21:00</option>
                  <option value="22:00">22:00</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Pessoas</label>
                <select
                  value={partySize}
                  onChange={(e) => setPartySize(Number(e.target.value))}
                  className="mt-1 flex h-9 w-full rounded-lg border border-border bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary"
                >
                  {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>{n} pessoas</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Observacao (opcional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Aniversario, evento especial..."
                className="mt-1 flex h-9 w-full rounded-lg border border-border bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isPending || !session?.user}
                className="h-9 px-5 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
              >
                {isPending ? "Enviando..." : "Solicitar reserva"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
