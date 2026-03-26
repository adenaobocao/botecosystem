import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Roadmap | Central de Inteligencia" };

const phases = [
  {
    phase: "Fase 1",
    status: "done",
    title: "Analytics e Insights IA",
    description:
      "Dashboard analytics completo com graficos de faturamento, top produtos, heatmap de horarios, origens. Insights gerados automaticamente pela IA com resumo diario, deteccao de anomalias, previsao de demanda e score de saude do negocio.",
    features: [
      "Graficos de faturamento (7d, 30d, 90d)",
      "Top produtos por quantidade e receita",
      "Heatmap de horarios de pico",
      "Health score do negocio",
      "Insights automaticos com Gemini AI",
      "Sistema de alertas configuraveis",
      "Chat IA on-demand",
    ],
  },
  {
    phase: "Fase 2",
    status: "done",
    title: "Marketing e Campanhas",
    description:
      "Segmentacao automatica de clientes, campanhas via WhatsApp com texto gerado por IA, cupons inteligentes personalizados e gerador de conteudo para redes sociais.",
    features: [
      "Segmentacao: Novos, Recorrentes, VIP, Inativos",
      "Campanhas WhatsApp com wizard 3 steps",
      "IA gera texto de campanha (editavel)",
      "Cupons inteligentes (IA sugere, admin aprova)",
      "Envio de cupom via WhatsApp",
      "Gerador de conteudo multi-tipo e tom",
    ],
  },
  {
    phase: "Fase 3",
    status: "soon",
    title: "Monitoramento de Mercado",
    description:
      "A IA rastreia automaticamente os concorrentes da regiao — precos, cardapios, promocoes, horarios e avaliacoes. Tudo consolidado em um painel unico.",
    features: [
      "Rastreamento de precos de concorrentes",
      "Alertas quando concorrente muda precos",
      "Comparativo: seu preco vs media do mercado",
      "Score de competitividade por categoria",
      "Analise de sentimento das avaliacoes (Google, iFood)",
      "Mapa de calor de concorrentes por bairro",
    ],
  },
  {
    phase: "Fase 4",
    status: "soon",
    title: "Piloto Automatico",
    description:
      "O sistema toma decisoes operacionais sozinho — com sua aprovacao. Ele ajusta precos, ativa promos, publica conteudo e otimiza o cardapio continuamente.",
    features: [
      "Precificacao dinamica automatica",
      "Ativacao automatica de promo em queda de movimento",
      "Rotacao inteligente de destaques no cardapio",
      "Publicacao automatica em redes sociais",
      "Dashboard preditivo: faturamento estimado",
      "Relatorios semanais automaticos com plano de acao",
    ],
  },
];

export default function RoadmapPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Link href="/dashboard/inteligencia" className="text-muted-foreground hover:text-foreground">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
            </svg>
          </Link>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93" />
              <path d="M8.24 9.93A4 4 0 0 1 8 6a4 4 0 0 1 4-4" />
              <path d="M10.5 13.5A8 8 0 0 0 4 21h16a8 8 0 0 0-6.5-7.5" />
              <path d="M15 21v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Central de Inteligencia</h1>
            <p className="text-sm text-muted-foreground">
              IA trabalhando 24h pro seu negocio crescer
            </p>
          </div>
        </div>

        <div className="p-5 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 border border-violet-200/60 dark:border-violet-800/30 rounded-2xl">
          <p className="text-sm leading-relaxed text-foreground/80">
            <strong>O que e isso?</strong> Um sistema de inteligencia artificial
            exclusivo pro Boteco da Estacao. Ele monitora metricas, analisa tendencias,
            sugere promocoes, cria campanhas e otimiza seu negocio — tudo automaticamente.
            Pense nele como um <strong>diretor de marketing e estrategia que nunca dorme</strong>.
          </p>
        </div>
      </div>

      {/* Roadmap */}
      <h2 className="text-lg font-bold mb-6">Roadmap de Evolucao</h2>
      <div className="space-y-6">
        {phases.map((phase, idx) => (
          <div
            key={phase.phase}
            className={`relative p-6 rounded-2xl border transition-all ${
              phase.status === "done"
                ? "bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10 border-green-300/50 dark:border-green-700/30"
                : "bg-card border-border opacity-80"
            }`}
          >
            {/* Phase badge */}
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-lg tracking-wide ${
                phase.status === "done"
                  ? "bg-green-500 text-white"
                  : "bg-violet-500 text-white"
              }`}>
                {phase.phase}
              </span>
              {phase.status === "done" && (
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                    <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
                  </svg>
                  <span className="text-[11px] font-medium text-green-600 dark:text-green-400">Implementado</span>
                </span>
              )}
              {phase.status === "soon" && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 rounded-md">
                  SOON
                </span>
              )}
            </div>

            <h3 className="text-base font-bold mb-2">{phase.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {phase.description}
            </p>

            {/* Feature list */}
            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
              {phase.features.map((feature) => (
                <div key={feature} className="flex items-start gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mt-0.5 shrink-0 ${
                    phase.status === "done" ? "text-green-500" : "text-amber-500"
                  }`}>
                    {phase.status === "done" ? (
                      <><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>
                    ) : (
                      <><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></>
                    )}
                  </svg>
                  <span className="text-xs leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>

            {/* Connector line */}
            {idx < phases.length - 1 && (
              <div className="absolute -bottom-3 left-8 w-0.5 h-6 bg-border" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
