"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { createEvent, updateEvent, toggleEventActive, deleteEvent } from "@/lib/actions/events";

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  artistName: string | null;
  artistImage: string | null;
  date: string;
  startTime: string;
  endTime: string | null;
  coverCharge: number;
  isCoverFree: boolean;
  isActive: boolean;
}

const emptyForm = {
  title: "",
  description: "",
  artistName: "",
  artistImage: "",
  date: "",
  startTime: "20:00",
  endTime: "",
  coverCharge: 0,
  isCoverFree: true,
};

export function AgendaManager({ events }: { events: EventRow[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isPending, startTransition] = useTransition();

  function openNew() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(event: EventRow) {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description || "",
      artistName: event.artistName || "",
      artistImage: event.artistImage || "",
      date: typeof event.date === "string" ? event.date.slice(0, 10) : new Date(event.date).toISOString().slice(0, 10),
      startTime: event.startTime,
      endTime: event.endTime || "",
      coverCharge: Number(event.coverCharge),
      isCoverFree: event.isCoverFree,
    });
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const data = {
        title: form.title,
        description: form.description || undefined,
        artistName: form.artistName || undefined,
        artistImage: form.artistImage || undefined,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime || undefined,
        coverCharge: form.isCoverFree ? 0 : form.coverCharge,
        isCoverFree: form.isCoverFree,
      };

      if (editingId) {
        await updateEvent(editingId, data);
      } else {
        await createEvent(data);
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    });
  }

  function handleToggle(id: string, isActive: boolean) {
    startTransition(async () => {
      await toggleEventActive(id, !isActive);
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;
    startTransition(async () => {
      await deleteEvent(id);
    });
  }

  function formatDate(d: string) {
    const date = new Date(d);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  const upcoming = events.filter((e) => new Date(e.date) >= new Date(new Date().toDateString()));
  const past = events.filter((e) => new Date(e.date) < new Date(new Date().toDateString()));

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {upcoming.length} evento{upcoming.length !== 1 ? "s" : ""} programado{upcoming.length !== 1 ? "s" : ""}
          </span>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 h-10 px-4 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" />
          </svg>
          Novo evento
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg bg-card border border-border rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-lg font-bold">
              {editingId ? "Editar evento" : "Novo evento"}
            </h2>

            <div>
              <label className="text-sm font-medium">Titulo *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Roda de Samba, Sexta Acustica..."
                className="mt-1 flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Descricao</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Descricao opcional do evento..."
                rows={2}
                className="mt-1 flex w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Artista / Banda</label>
                <input
                  type="text"
                  value={form.artistName}
                  onChange={(e) => setForm({ ...form, artistName: e.target.value })}
                  placeholder="Nome da banda"
                  className="mt-1 flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Foto do artista</label>
                <input
                  type="url"
                  value={form.artistImage}
                  onChange={(e) => setForm({ ...form, artistImage: e.target.value })}
                  placeholder="https://..."
                  className="mt-1 flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium">Data *</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="mt-1 flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Inicio *</label>
                <input
                  type="time"
                  required
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="mt-1 flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Fim</label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className="mt-1 flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isCoverFree}
                  onChange={(e) => setForm({ ...form, isCoverFree: e.target.checked, coverCharge: e.target.checked ? 0 : form.coverCharge })}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm font-medium">Cover Free (entrada gratuita)</span>
              </label>

              {!form.isCoverFree && (
                <div>
                  <label className="text-sm font-medium">Valor do cover (R$)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.coverCharge}
                    onChange={(e) => setForm({ ...form, coverCharge: parseFloat(e.target.value) || 0 })}
                    className="mt-1 flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 h-10 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {isPending ? "Salvando..." : editingId ? "Atualizar" : "Criar evento"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="h-10 px-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Upcoming events */}
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Proximos eventos</h3>
          <div className="space-y-2">
            {upcoming.map((event) => (
              <div key={event.id} className={`p-4 rounded-xl border transition-colors ${event.isActive ? "bg-card border-border" : "bg-muted/50 border-border/50 opacity-60"}`}>
                <div className="flex items-center gap-4">
                  {event.artistImage ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                      <Image src={event.artistImage} alt={event.artistName || event.title} fill className="object-cover" sizes="48px" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                        <circle cx="12" cy="18" r="4" /><path d="M16 18V2" /><path d="M16 2h-4" /><path d="m16 6-4 2" />
                      </svg>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold truncate">{event.title}</p>
                      {!event.isActive && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400 rounded">Inativo</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{formatDate(event.date)}</span>
                      <span>{event.startTime}h{event.endTime ? ` - ${event.endTime}h` : ""}</span>
                      {event.artistName && <span>- {event.artistName}</span>}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      event.isCoverFree
                        ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                    }`}>
                      {event.isCoverFree ? "Free" : `R$ ${Number(event.coverCharge).toFixed(2).replace(".", ",")}`}
                    </span>
                  </div>

                  <div className="shrink-0 flex items-center gap-1">
                    <button
                      onClick={() => openEdit(event)}
                      className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                      title="Editar"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleToggle(event.id, event.isActive)}
                      className={`p-2 rounded-lg hover:bg-muted transition-colors ${event.isActive ? "text-green-600" : "text-muted-foreground"}`}
                      title={event.isActive ? "Desativar" : "Ativar"}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {event.isActive ? (
                          <><path d="M18 6 7 17l-5-5" /></>
                        ) : (
                          <><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></>
                        )}
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-muted transition-colors"
                      title="Excluir"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past events */}
      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Eventos passados</h3>
          <div className="space-y-2">
            {past.map((event) => (
              <div key={event.id} className="p-4 rounded-xl border border-border/50 bg-muted/30 opacity-60">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                      <circle cx="12" cy="18" r="4" /><path d="M16 18V2" /><path d="M16 2h-4" /><path d="m16 6-4 2" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(event.date)} - {event.artistName || "Sem artista"}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-muted transition-colors"
                    title="Excluir"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {events.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </div>
          <p className="text-muted-foreground text-sm">Nenhum evento cadastrado</p>
          <button
            onClick={openNew}
            className="mt-3 text-sm font-semibold text-primary hover:underline"
          >
            Criar primeiro evento
          </button>
        </div>
      )}
    </div>
  );
}
