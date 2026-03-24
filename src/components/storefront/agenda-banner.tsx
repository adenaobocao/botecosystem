"use client";

import { useState } from "react";

const DIAS_SEMANA = ["Domingo", "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado"];

const agenda: Record<string, { atracao: string; destaque: boolean }> = {
  Segunda: { atracao: "Roda de Samba", destaque: true },
  Terca: { atracao: "Em breve", destaque: false },
  Quarta: { atracao: "Em breve", destaque: false },
  Quinta: { atracao: "Em breve", destaque: false },
  Sexta: { atracao: "Em breve", destaque: false },
  Sabado: { atracao: "Em breve", destaque: false },
  Domingo: { atracao: "Em breve", destaque: false },
};

function getHoje(): string {
  return DIAS_SEMANA[new Date().getDay()];
}

export function AgendaBanner() {
  const [expanded, setExpanded] = useState(false);
  const hoje = getHoje();
  const eventoHoje = agenda[hoje];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Pill compacta — evento de hoje */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full group"
      >
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all">
          {/* Indicador ao vivo */}
          {eventoHoje?.destaque && (
            <span className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Hoje
            </span>
          )}
          {!eventoHoje?.destaque && (
            <span className="shrink-0 px-2.5 py-1 bg-muted text-muted-foreground text-[11px] font-bold uppercase tracking-wider rounded-full">
              Hoje
            </span>
          )}

          <div className="flex-1 text-left">
            <span className="text-sm font-semibold">{hoje}</span>
            <span className="mx-2 text-muted-foreground">—</span>
            <span className={`text-sm ${eventoHoje?.destaque ? "font-semibold text-primary" : "text-muted-foreground"}`}>
              {eventoHoje?.atracao ?? "Sem programacao"}
            </span>
          </div>

          {/* Chevron */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`shrink-0 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Expandido — semana inteira */}
      <div
        className={`grid transition-all duration-300 ease-out ${
          expanded ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {DIAS_SEMANA.map((dia) => {
              const item = agenda[dia];
              const isHoje = dia === hoje;

              return (
                <div
                  key={dia}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isHoje && item?.destaque
                      ? "bg-primary/5 border-primary/30 ring-1 ring-primary/10"
                      : isHoje
                      ? "bg-card border-primary/20"
                      : "bg-card border-border"
                  }`}
                >
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      isHoje ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {dia}
                  </span>
                  <p
                    className={`mt-1.5 text-xs font-medium leading-tight ${
                      item?.destaque ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {item?.atracao ?? "—"}
                  </p>
                  {item?.destaque && (
                    <span className="inline-block mt-1.5 px-1.5 py-0.5 bg-primary text-primary-foreground text-[9px] font-bold rounded uppercase">
                      Ao vivo
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
