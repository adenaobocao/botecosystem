"use client";

import { useState } from "react";
import { CompetitorHeatmap } from "./competitor-heatmap";
import { CompetitorRanking } from "./competitor-ranking";
import { CompetitorDetail } from "./competitor-detail";
import { CompetitiveScore } from "./competitive-score";
import { NegativeReviews } from "./negative-reviews";
import { MarketInsights } from "./market-insights";

interface Competitor {
  placeId: string;
  name: string;
  rating: number;
  totalReviews: number;
  distance: number;
  isOpen: boolean | null;
  address: string;
}

interface ZoneData {
  zone: string;
  count: number;
  avgRating: number;
  topCompetitor: string;
  competitors: Competitor[];
}

interface Analysis {
  totalCompetitors: number;
  avgRating: number;
  avgReviews: number;
  botecoRating: number;
  aboveUs: number;
  belowUs: number;
  rankPosition: number;
  percentile: number;
}

interface NegReview {
  competitorName: string;
  author: string;
  rating: number;
  text: string;
  timeAgo: string;
}

interface Props {
  competitors: Competitor[];
  zones: ZoneData[];
  analysis: Analysis;
  negativeReviews: NegReview[];
}

export function MonitoramentoClient({ competitors, zones, analysis, negativeReviews }: Props) {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [detail, setDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  async function handleSelect(placeId: string) {
    if (selectedPlaceId === placeId) {
      setSelectedPlaceId(null);
      setDetail(null);
      return;
    }
    setSelectedPlaceId(placeId);
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/ai/competitor-analysis?placeId=${placeId}`);
      const data = await res.json();
      setDetail(data);
    } catch {
      setDetail(null);
    }
    setDetailLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 bg-card border border-border rounded-xl">
          <p className="text-xl font-bold">{analysis.totalCompetitors}</p>
          <p className="text-xs text-muted-foreground">Concorrentes mapeados</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-xl">
          <p className="text-xl font-bold text-primary">#{analysis.rankPosition}</p>
          <p className="text-xs text-muted-foreground">Posicao no ranking</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-xl">
          <p className="text-xl font-bold">{analysis.botecoRating}</p>
          <p className="text-xs text-muted-foreground">Nosso rating</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-xl">
          <p className="text-xl font-bold">{analysis.avgRating}</p>
          <p className="text-xs text-muted-foreground">Media do mercado</p>
        </div>
      </div>

      {/* Heatmap + Score */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-3">Mapa de calor -- Concorrencia por regiao</h2>
          <CompetitorHeatmap zones={zones} />
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-3">Score competitivo</h2>
          <CompetitiveScore analysis={analysis} />
        </div>
      </div>

      {/* Ranking + Detail panel */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-3">Ranking de concorrentes</h2>
          <div className="max-h-[500px] overflow-y-auto">
            <CompetitorRanking
              competitors={competitors}
              botecoRating={analysis.botecoRating}
              onSelect={handleSelect}
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          {selectedPlaceId ? (
            <>
              <h2 className="text-sm font-semibold mb-3">Detalhes e avaliacoes</h2>
              <CompetitorDetail
                detail={detail}
                loading={detailLoading}
                onClose={() => { setSelectedPlaceId(null); setDetail(null); }}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/30 mb-3">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <p className="text-xs text-muted-foreground">Clique em um concorrente pra ver detalhes e avaliacoes</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-br from-violet-50/50 to-indigo-50/50 dark:from-violet-950/10 dark:to-indigo-950/10 border border-violet-200/40 dark:border-violet-800/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-600">
            <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93" />
            <path d="M8.24 9.93A4 4 0 0 1 8 6a4 4 0 0 1 4-4" />
            <path d="M10.5 13.5A8 8 0 0 0 4 21h16a8 8 0 0 0-6.5-7.5" />
            <path d="M15 21v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
          </svg>
          <h2 className="text-sm font-semibold">Insights da IA -- Plano de acao</h2>
        </div>
        <MarketInsights
          analysisData={analysis}
          negativeReviews={negativeReviews}
          topCompetitors={competitors.sort((a, b) => b.totalReviews - a.totalReviews).slice(0, 5)}
        />
      </div>

      {/* Negative reviews */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h2 className="text-sm font-semibold mb-3">Avaliacoes negativas dos concorrentes</h2>
        <NegativeReviews reviews={negativeReviews} />
      </div>
    </div>
  );
}
