import Image from "next/image";
import Link from "next/link";
import { getUpcomingEvents, getTodayEvent } from "@/lib/queries/events";

const DIAS_CURTO = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

const FALLBACK_MESSAGES = [
  { title: "Cerveja gelada e petiscos", subtitle: "O point de Ponta Grossa te espera hoje", cta: "Ver cardapio", href: "/cardapio" },
  { title: "Bateu a fome?", subtitle: "Lanche artesanal + cerveja especial no precinho", cta: "Pedir agora", href: "/cardapio" },
  { title: "Happy hour no Boteco", subtitle: "Vem curtir com os amigos. Ambiente raiz, preco justo", cta: "Ver cardapio", href: "/cardapio" },
  { title: "Dia tranquilo no Boteco", subtitle: "Sem evento hoje, mas a cerveja ta gelada e o lanche ta saindo", cta: "Fazer pedido", href: "/cardapio" },
  { title: "Mesa livre, cerveja gelada", subtitle: "Chega mais! Ambiente descontraido e cardapio completo", cta: "Ver opcoes", href: "/cardapio" },
  { title: "Hoje tem Boteco!", subtitle: "Sem show, mas com muita cerveja, petisco e clima bom", cta: "Ver cardapio", href: "/cardapio" },
];

function formatDate(date: Date): string {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
}

function formatCover(isFree: boolean, charge: number): string {
  if (isFree || charge === 0) return "Cover Free";
  return `Cover R$ ${Number(charge).toFixed(2).replace(".", ",")}`;
}

export async function AgendaBanner() {
  const [todayEvent, upcoming] = await Promise.all([
    getTodayEvent(),
    getUpcomingEvents(10),
  ]);

  const futureEvents = upcoming.filter((e) => {
    const d = new Date(e.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d >= today;
  });

  // Sem eventos — mostra mensagem aleatoria pra atrair pro bar
  if (futureEvents.length === 0 && !todayEvent) {
    const dayIndex = new Date().getDate() % FALLBACK_MESSAGES.length;
    const msg = FALLBACK_MESSAGES[dayIndex];
    return (
      <section id="agenda" className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
              <circle cx="12" cy="18" r="4" /><path d="M16 18V2" /><path d="M16 2h-4" /><path d="m16 6-4 2" />
            </svg>
          </div>
          <h2 className="text-base font-bold tracking-tight">Agenda</h2>
        </div>
        <div className="p-5 rounded-2xl border bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/60 dark:border-amber-800/30">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-amber-900 dark:text-amber-200">{msg.title}</p>
              <p className="text-xs text-amber-700/70 dark:text-amber-400/60 mt-0.5">{msg.subtitle}</p>
            </div>
            <Link
              href={msg.href}
              className="shrink-0 h-9 px-4 inline-flex items-center justify-center bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 transition-colors"
            >
              {msg.cta}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="agenda" className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
            <circle cx="12" cy="18" r="4" /><path d="M16 18V2" /><path d="M16 2h-4" /><path d="m16 6-4 2" />
          </svg>
        </div>
        <h2 className="text-base font-bold tracking-tight">Agenda</h2>
      </div>

      {/* Evento de hoje — destaque */}
      {todayEvent && (
        <div className="mb-4 p-4 rounded-2xl border bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200/60 dark:border-purple-800/30">
          <div className="flex items-center gap-4">
            {/* Foto do artista */}
            {todayEvent.artistImage ? (
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <Image src={todayEvent.artistImage} alt={todayEvent.artistName || todayEvent.title} fill className="object-cover" sizes="64px" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl bg-purple-500/15 flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                  <circle cx="12" cy="18" r="4" /><path d="M16 18V2" /><path d="M16 2h-4" /><path d="m16 6-4 2" />
                </svg>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[10px] font-bold rounded-full uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                  Hoje
                </span>
                <span className="text-[11px] text-muted-foreground">{todayEvent.startTime}h</span>
              </div>
              <p className="text-sm font-bold text-purple-900 dark:text-purple-200 leading-tight">
                {todayEvent.title}
              </p>
              {todayEvent.artistName && (
                <p className="text-xs text-purple-700/70 dark:text-purple-400/60 mt-0.5">
                  {todayEvent.artistName}
                </p>
              )}
            </div>

            <div className="shrink-0 text-right">
              <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-lg ${
                todayEvent.isCoverFree
                  ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
              }`}>
                {formatCover(todayEvent.isCoverFree, Number(todayEvent.coverCharge))}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Proximos eventos */}
      {futureEvents.length > 0 && (
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
          {futureEvents.map((event) => {
            const eventDate = new Date(event.date);
            const isToday = new Date().toDateString() === eventDate.toDateString();
            if (isToday) return null; // Ja mostrou acima

            return (
              <div
                key={event.id}
                className="shrink-0 w-[180px] p-3 rounded-xl border border-border bg-card hover:border-purple-200/60 transition-colors"
              >
                {/* Foto ou icone */}
                {event.artistImage ? (
                  <div className="relative w-full h-24 rounded-lg overflow-hidden mb-2">
                    <Image src={event.artistImage} alt={event.artistName || event.title} fill className="object-cover" sizes="180px" />
                  </div>
                ) : (
                  <div className="w-full h-14 rounded-lg bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center mb-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                      <circle cx="12" cy="18" r="4" /><path d="M16 18V2" /><path d="M16 2h-4" /><path d="m16 6-4 2" />
                    </svg>
                  </div>
                )}

                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">
                    {DIAS_CURTO[eventDate.getDay()]} {formatDate(eventDate)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{event.startTime}h</span>
                </div>

                <p className="text-xs font-bold leading-tight truncate">{event.title}</p>
                {event.artistName && (
                  <p className="text-[11px] text-muted-foreground truncate">{event.artistName}</p>
                )}

                <span className={`inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold rounded ${
                  event.isCoverFree
                    ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                }`}>
                  {formatCover(event.isCoverFree, Number(event.coverCharge))}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
