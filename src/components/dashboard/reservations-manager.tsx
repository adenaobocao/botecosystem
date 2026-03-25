"use client";

import { useState, useTransition } from "react";
import { updateReservationStatus, deleteReservation } from "@/lib/actions/reservations";

interface ReservationRow {
  id: string;
  userName: string;
  userPhone: string;
  date: string;
  time: string;
  partySize: number;
  tableId: string;
  status: string;
  notes: string | null;
  adminNotes: string | null;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  PENDING: { label: "Pendente", bg: "bg-amber-100 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400" },
  APPROVED: { label: "Aprovada", bg: "bg-green-100 dark:bg-green-950/30", text: "text-green-700 dark:text-green-400" },
  REJECTED: { label: "Rejeitada", bg: "bg-red-100 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400" },
  CANCELLED: { label: "Cancelada", bg: "bg-gray-100 dark:bg-gray-800/30", text: "text-gray-600 dark:text-gray-400" },
};

export function ReservationsManager({ reservations }: { reservations: ReservationRow[] }) {
  const [filter, setFilter] = useState<string>("ALL");
  const [isPending, startTransition] = useTransition();
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  const filtered = filter === "ALL" ? reservations : reservations.filter((r) => r.status === filter);
  const pending = reservations.filter((r) => r.status === "PENDING");
  const today = reservations.filter((r) => {
    const d = new Date(r.date).toDateString();
    return d === new Date().toDateString() && r.status === "APPROVED";
  });

  function handleStatus(id: string, status: "APPROVED" | "REJECTED" | "CANCELLED") {
    startTransition(async () => {
      await updateReservationStatus(id, status, adminNotes[id] || undefined);
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Excluir esta reserva permanentemente?")) return;
    startTransition(async () => {
      await deleteReservation(id);
    });
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function formatPhone(phone: string) {
    const d = phone.replace(/\D/g, "").replace(/^55/, "");
    if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    return phone;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30 rounded-xl">
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{pending.length}</p>
          <p className="text-xs text-amber-600/70 dark:text-amber-400/60 font-medium">Aguardando</p>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200/60 dark:border-green-800/30 rounded-xl">
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">{today.length}</p>
          <p className="text-xs text-green-600/70 dark:text-green-400/60 font-medium">Hoje</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-xl">
          <p className="text-2xl font-bold">{reservations.filter((r) => r.status === "APPROVED").length}</p>
          <p className="text-xs text-muted-foreground font-medium">Aprovadas</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-xl">
          <p className="text-2xl font-bold">{reservations.length}</p>
          <p className="text-xs text-muted-foreground font-medium">Total</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {[
          { value: "ALL", label: "Todas" },
          { value: "PENDING", label: "Pendentes" },
          { value: "APPROVED", label: "Aprovadas" },
          { value: "REJECTED", label: "Rejeitadas" },
          { value: "CANCELLED", label: "Canceladas" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              filter === f.value
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Reservations list */}
      <div className="space-y-2">
        {filtered.map((res) => {
          const cfg = statusConfig[res.status] || statusConfig.PENDING;
          return (
            <div key={res.id} className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center shrink-0 text-sm font-bold text-amber-700 dark:text-amber-400">
                  {(res.userName || "?").charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold">{res.userName}</p>
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${cfg.bg} ${cfg.text}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span>{formatDate(res.date)} as {res.time}h</span>
                    <span>{res.partySize} pessoas</span>
                    {res.userPhone && <span>{formatPhone(res.userPhone)}</span>}
                  </div>
                  {res.notes && (
                    <p className="text-xs text-muted-foreground mt-1 italic">&quot;{res.notes}&quot;</p>
                  )}
                  {res.adminNotes && (
                    <p className="text-xs text-primary mt-1">Admin: {res.adminNotes}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="shrink-0 flex items-center gap-1">
                  {res.status === "PENDING" && (
                    <>
                      <input
                        type="text"
                        placeholder="Nota..."
                        value={adminNotes[res.id] || ""}
                        onChange={(e) => setAdminNotes({ ...adminNotes, [res.id]: e.target.value })}
                        className="w-24 h-8 px-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-ring/20"
                      />
                      <button
                        onClick={() => handleStatus(res.id, "APPROVED")}
                        disabled={isPending}
                        className="h-8 px-3 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleStatus(res.id, "REJECTED")}
                        disabled={isPending}
                        className="h-8 px-3 bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400 text-xs font-bold rounded-lg hover:bg-red-200 disabled:opacity-50 transition-colors"
                      >
                        Rejeitar
                      </button>
                    </>
                  )}
                  {res.status === "APPROVED" && (
                    <button
                      onClick={() => handleStatus(res.id, "CANCELLED")}
                      disabled={isPending}
                      className="h-8 px-3 text-xs font-medium text-muted-foreground hover:text-red-600 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(res.id)}
                    disabled={isPending}
                    className="p-2 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-muted transition-colors"
                    title="Excluir"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* WhatsApp link */}
              {res.userPhone && (
                <div className="mt-2 pt-2 border-t border-border/50">
                  <a
                    href={`https://wa.me/55${res.userPhone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-green-600 dark:text-green-400 font-medium hover:underline"
                  >
                    Falar pelo WhatsApp
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 1.74.5 3.37 1.41 4.84.95 1.54 2.2 2.86 3.16 4.4.47.75.93 1.56 1.43 2.76.5-1.2.96-2.01 1.43-2.76.96-1.53 2.21-2.86 3.16-4.4C16.5 12.37 17 10.74 17 9c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
          </div>
          <p className="text-muted-foreground text-sm">
            {filter === "ALL" ? "Nenhuma reserva ainda" : "Nenhuma reserva com este filtro"}
          </p>
        </div>
      )}
    </div>
  );
}
