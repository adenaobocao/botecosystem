import { NextResponse } from "next/server";
import { askGemini } from "@/lib/ai/gemini";

export async function POST(req: Request) {
  try {
    const { analysis, negativeReviews, topCompetitors } = await req.json();

    const prompt = `Voce e o consultor estrategico do Boteco da Estacao (bar/restaurante em Ponta Grossa-PR).

DADOS COMPETITIVOS ATUAIS:
- Nosso rating no Google Maps: ${analysis.botecoRating}
- Media do mercado: ${analysis.avgRating}
- Posicao no ranking: #${analysis.rankPosition} de ${analysis.totalCompetitors}
- Percentil: ${analysis.percentile}% (${analysis.aboveUs} acima, ${analysis.belowUs} abaixo)
- Media de avaliacoes dos concorrentes: ${analysis.avgReviews}

TOP 5 CONCORRENTES:
${topCompetitors.map((c: any) => `- ${c.name}: ${c.rating} (${c.totalReviews} avaliacoes, ${c.distance.toFixed(1)}km)`).join("\n")}

PONTOS FRACOS DOS CONCORRENTES (avaliacoes negativas recentes):
${negativeReviews.slice(0, 8).map((r: any) => `- ${r.competitorName} (${r.rating}*): "${r.text.slice(0, 120)}"`).join("\n")}

Com base nesses dados, gere EXATAMENTE 6 insights no formato abaixo. Cada insight deve ser acionavel e especifico:

INSIGHT_1_TIPO: [SUBIR_RANKING | PEDIR_AVALIACAO | PROMOCAO | DIFERENCIAL | OPORTUNIDADE | DEFESA]
INSIGHT_1_TITULO: [titulo curto, max 50 chars]
INSIGHT_1_TEXTO: [explicacao acionavel em 2-3 frases]
INSIGHT_1_PRIORIDADE: [ALTA | MEDIA | BAIXA]
INSIGHT_1_ACAO: [acao concreta em 1 frase - o que o dono deve fazer AGORA]

INSIGHT_2_TIPO: ...
(repita para todos os 6)

Regras:
- Pelo menos 1 insight sobre como pedir mais avaliacoes no Google
- Pelo menos 1 insight explorando ponto fraco de concorrente
- Pelo menos 1 insight sobre promocao/diferencial pra subir no ranking
- Seja especifico com nomes de concorrentes quando relevante
- Acoes devem ser executaveis essa semana
- Nao use emojis`;

    const text = await askGemini(prompt, { maxTokens: 1500, temperature: 0.8 });

    // Parse insights
    const insights: any[] = [];
    for (let i = 1; i <= 6; i++) {
      const tipoMatch = text.match(new RegExp(`INSIGHT_${i}_TIPO:\\s*(.+)`));
      const tituloMatch = text.match(new RegExp(`INSIGHT_${i}_TITULO:\\s*(.+)`));
      const textoMatch = text.match(new RegExp(`INSIGHT_${i}_TEXTO:\\s*(.+)`));
      const prioridadeMatch = text.match(new RegExp(`INSIGHT_${i}_PRIORIDADE:\\s*(.+)`));
      const acaoMatch = text.match(new RegExp(`INSIGHT_${i}_ACAO:\\s*(.+)`));

      if (tituloMatch && textoMatch) {
        insights.push({
          type: tipoMatch?.[1]?.trim() || "OPORTUNIDADE",
          title: tituloMatch[1].trim(),
          text: textoMatch[1].trim(),
          priority: prioridadeMatch?.[1]?.trim() || "MEDIA",
          action: acaoMatch?.[1]?.trim() || "",
        });
      }
    }

    return NextResponse.json({ insights, raw: text });
  } catch (error) {
    console.error("[ai/market-insights] Error:", error);
    return NextResponse.json({ error: "Failed", insights: [] }, { status: 500 });
  }
}
