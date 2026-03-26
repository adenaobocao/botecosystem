"use client";

import { useState } from "react";

interface Insight {
  type: string;
  title: string;
  text: string;
  priority: string;
  action: string;
}

interface Props {
  analysisData: any;
  negativeReviews: any[];
  topCompetitors: any[];
}

const typeConfig: Record<string, { label: string; color: string; icon: string }> = {
  SUBIR_RANKING: { label: "Subir ranking", color: "bg-blue-100 text-blue-700 border-blue-200", icon: "M12 19V5M5 12l7-7 7 7" },
  PEDIR_AVALIACAO: { label: "Avaliacoes", color: "bg-amber-100 text-amber-700 border-amber-200", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
  PROMOCAO: { label: "Promocao", color: "bg-green-100 text-green-700 border-green-200", icon: "M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" },
  DIFERENCIAL: { label: "Diferencial", color: "bg-violet-100 text-violet-700 border-violet-200", icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8" },
  OPORTUNIDADE: { label: "Oportunidade", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: "M9 18V5l12-2v13" },
  DEFESA: { label: "Defesa", color: "bg-red-100 text-red-700 border-red-200", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
};

const priorityConfig: Record<string, { label: string; dot: string }> = {
  ALTA: { label: "Alta", dot: "bg-red-500" },
  MEDIA: { label: "Media", dot: "bg-amber-500" },
  BAIXA: { label: "Baixa", dot: "bg-green-500" },
};

export function MarketInsights({ analysisData, negativeReviews, topCompetitors }: Props) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/market-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysis: analysisData,
          negativeReviews,
          topCompetitors,
        }),
      });
      const data = await res.json();
      if (data.insights?.length > 0) {
        setInsights(data.insights);
        setGenerated(true);
      }
    } catch {
      // silently fail
    }
    setLoading(false);
  }

  if (!generated) {
    return (
      <div className="text-center py-6">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-primary/40 mb-3">
          <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93" />
          <path d="M8.24 9.93A4 4 0 0 1 8 6a4 4 0 0 1 4-4" />
          <path d="M10.5 13.5A8 8 0 0 0 4 21h16a8 8 0 0 0-6.5-7.5" />
          <path d="M15 21v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
        </svg>
        <p className="text-xs text-muted-foreground mb-3">
          A IA analisa seus concorrentes e gera insights acionaveis pra subir no ranking
        </p>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="h-10 px-6 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Analisando concorrencia..." : "Gerar insights com IA"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">
          {insights.length} insights gerados -- ordenados por prioridade
        </p>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="text-[10px] text-primary hover:underline disabled:opacity-50"
        >
          {loading ? "Gerando..." : "Regenerar"}
        </button>
      </div>

      {insights
        .sort((a, b) => {
          const order: Record<string, number> = { ALTA: 0, MEDIA: 1, BAIXA: 2 };
          return (order[a.priority] ?? 1) - (order[b.priority] ?? 1);
        })
        .map((insight, i) => {
          const type = typeConfig[insight.type] || typeConfig.OPORTUNIDADE;
          const prio = priorityConfig[insight.priority] || priorityConfig.MEDIA;

          return (
            <div key={i} className="p-4 bg-card border border-border rounded-xl space-y-2">
              {/* Header */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${type.color}`}>
                  {type.label}
                </span>
                <span className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${prio.dot}`} />
                  <span className="text-[10px] text-muted-foreground">Prioridade {prio.label}</span>
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold">{insight.title}</h3>

              {/* Text */}
              <p className="text-xs text-muted-foreground leading-relaxed">{insight.text}</p>

              {/* Action */}
              {insight.action && (
                <div className="flex items-start gap-2 p-2.5 bg-primary/5 border border-primary/10 rounded-lg">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0 mt-0.5">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8" />
                  </svg>
                  <p className="text-xs font-medium text-primary">{insight.action}</p>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
