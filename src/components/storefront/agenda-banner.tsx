"use client";

import { useState } from "react";

const DIAS_SEMANA = ["Domingo", "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado"];
const DIAS_CURTO = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

const agenda: Record<string, { atracao: string; destaque: boolean; emoji: string }> = {
  Segunda: { atracao: "Roda de Samba", destaque: true, emoji: "🥁" },
  Terca: { atracao: "Em breve", destaque: false, emoji: "🎵" },
  Quarta: { atracao: "Em breve", destaque: false, emoji: "🎵" },
  Quinta: { atracao: "Em breve", destaque: false, emoji: "🎵" },
  Sexta: { atracao: "Em breve", destaque: false, emoji: "🎵" },
  Sabado: { atracao: "Em breve", destaque: false, emoji: "🎵" },
  Domingo: { atracao: "Em breve", destaque: false, emoji: "🎵" },
};

function getHoje(): string {
  return DIAS_SEMANA[new Date().getDay()];
}

export function AgendaBanner() {
  const [expanded, setExpanded] = useState(false);
  const hoje = getHoje();
  const eventoHoje = agenda[hoje];

  return (
    <section id="agenda" className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
              <circle cx="12" cy="18" r="4" /><path d="M16 18V2" /><path d="M16 2h-4" /><path d="m16 6-4 2" />
            </svg>
          </div>
          <h2 className="text-base font-bold tracking-tight">Agenda da semana</h2>
        </div>
      </div>

      {/* Card principal — hoje */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full group"
      >
        <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
          eventoHoje?.destaque
            ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200/60 dark:border-purple-800/30"
            : "bg-card border-border hover:border-primary/20"
        }`}>
          {/* Day circle */}
          <div className={`shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center ${
            eventoHoje?.destaque
              ? "bg-purple-500 text-white"
              : "bg-muted text-muted-foreground"
          }`}>
            <span className="text-[10px] font-bold uppercase leading-none">
              {DIAS_CURTO[new Date().getDay()]}
            </span>
            <span className="text-lg font-black leading-none mt-0.5">
              {new Date().getDate()}
            </span>
          </div>

          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              {eventoHoje?.destaque && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[10px] font-bold rounded-full uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                  Hoje
                </span>
              )}
            </div>
            <p className={`text-sm font-bold mt-1 ${eventoHoje?.destaque ? "text-purple-900 dark:text-purple-200" : ""}`}>
              {eventoHoje?.atracao ?? "Sem programacao"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Toque pra ver a semana toda
            </p>
          </div>

          {/* Emoji + chevron */}
          <span className="text-2xl shrink-0">{eventoHoje?.emoji}</span>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`shrink-0 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Expandido */}
      <div className={`grid transition-all duration-300 ease-out ${
        expanded ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
      }`}>
        <div className="overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {DIAS_SEMANA.map((dia, i) => {
              const item = agenda[dia];
              const isHoje = dia === hoje;

              return (
                <div
                  key={dia}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isHoje && item?.destaque
                      ? "bg-purple-50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800/40 ring-1 ring-purple-200/50"
                      : isHoje
                      ? "bg-card border-primary/20"
                      : "bg-card border-border"
                  }`}
                >
                  <span className="text-lg">{item?.emoji}</span>
                  <span className={`block text-[11px] font-bold uppercase tracking-wider mt-1 ${
                    isHoje ? "text-purple-600 dark:text-purple-400" : "text-muted-foreground"
                  }`}>
                    {DIAS_CURTO[i]}
                  </span>
                  <p className={`mt-1 text-xs font-medium leading-tight ${
                    item?.destaque ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {item?.atracao ?? "—"}
                  </p>
                  {isHoje && (
                    <span className="inline-block mt-1.5 px-1.5 py-0.5 bg-purple-500 text-white text-[8px] font-bold rounded uppercase">
                      Hoje
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
