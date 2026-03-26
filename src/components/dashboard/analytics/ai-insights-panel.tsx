"use client";

import { useState } from "react";

interface Insight {
  id: string;
  type: string;
  title: string;
  content: string;
  status: string;
  created_at: string;
}

interface Props {
  insights: Insight[];
}

const typeLabels: Record<string, { label: string; color: string }> = {
  DAILY_SUMMARY: { label: "Resumo", color: "bg-blue-100 text-blue-700" },
  ANOMALY: { label: "Anomalia", color: "bg-red-100 text-red-700" },
  FORECAST: { label: "Previsao", color: "bg-amber-100 text-amber-700" },
  PRODUCT_ANALYSIS: { label: "Produtos", color: "bg-green-100 text-green-700" },
  HEALTH_SCORE: { label: "Saude", color: "bg-violet-100 text-violet-700" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "agora";
  if (hours < 24) return `${hours}h atras`;
  const days = Math.floor(hours / 24);
  return `${days}d atras`;
}

export function AiInsightsPanel({ insights }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (insights.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        Nenhum insight gerado ainda. Os insights sao gerados automaticamente todo dia.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {insights.map((insight) => {
        const typeInfo = typeLabels[insight.type] || { label: insight.type, color: "bg-muted text-muted-foreground" };
        const isExpanded = expanded === insight.id;

        return (
          <button
            key={insight.id}
            onClick={() => setExpanded(isExpanded ? null : insight.id)}
            className="w-full text-left p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${typeInfo.color}`}>
                {typeInfo.label}
              </span>
              <span className="text-[10px] text-muted-foreground">{timeAgo(insight.created_at)}</span>
              {insight.status === "NEW" && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </div>
            <p className="text-sm font-medium">{insight.title}</p>
            {isExpanded && (
              <p className="text-xs text-muted-foreground mt-2 whitespace-pre-line leading-relaxed">
                {insight.content}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
