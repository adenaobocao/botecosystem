import { Metadata } from "next";
import {
  searchCompetitors,
  getCompetitorDetail,
  buildHeatmapData,
  buildCompetitiveAnalysis,
} from "@/lib/services/competitors";
import { MonitoramentoClient } from "@/components/dashboard/monitoramento/monitoramento-client";

export const metadata: Metadata = { title: "Monitoramento | Boteco da Estacao" };
export const dynamic = "force-dynamic";

export default async function MonitoramentoPage() {
  // Busca concorrentes (bares + restaurantes PG)
  const [bares, restaurantes] = await Promise.all([
    searchCompetitors("bares ponta grossa pr"),
    searchCompetitors("restaurantes hamburgueria ponta grossa pr"),
  ]);

  // Deduplica por placeId
  const allMap = new Map<string, (typeof bares)[0]>();
  [...bares, ...restaurantes].forEach((c) => allMap.set(c.placeId, c));
  const competitors = Array.from(allMap.values());

  // Build heatmap e analise
  const zones = buildHeatmapData(competitors);
  const analysis = buildCompetitiveAnalysis(competitors);

  // Busca reviews negativos dos top 5 concorrentes (mais avaliados)
  const topByReviews = [...competitors]
    .sort((a, b) => b.totalReviews - a.totalReviews)
    .slice(0, 5);

  const negativeReviews: {
    competitorName: string;
    author: string;
    rating: number;
    text: string;
    timeAgo: string;
  }[] = [];

  for (const comp of topByReviews) {
    const detail = await getCompetitorDetail(comp.placeId);
    if (detail?.reviews) {
      const negative = detail.reviews
        .filter((r) => r.rating <= 3 && r.text.length > 20)
        .map((r) => ({
          competitorName: comp.name,
          author: r.author,
          rating: r.rating,
          text: r.text,
          timeAgo: r.timeAgo,
        }));
      negativeReviews.push(...negative);
    }
  }

  // Sort by rating asc (worst first)
  negativeReviews.sort((a, b) => a.rating - b.rating);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Monitoramento de Mercado</h1>
        <p className="text-sm text-muted-foreground">
          Concorrentes, avaliacoes e posicionamento na regiao de Ponta Grossa
        </p>
      </div>

      <MonitoramentoClient
        competitors={competitors}
        zones={zones}
        analysis={analysis}
        negativeReviews={negativeReviews.slice(0, 15)}
      />
    </div>
  );
}
