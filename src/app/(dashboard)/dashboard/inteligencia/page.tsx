import { Metadata } from "next";

export const metadata: Metadata = { title: "Central de Inteligencia" };

const phases = [
  {
    phase: "Fase 1",
    status: "active",
    title: "Monitoramento de Mercado",
    description:
      "A IA rastreia automaticamente os concorrentes da regiao — precos, cardapios, promocoes, horarios e avaliacoes. Tudo consolidado em um painel unico, sem voce precisar abrir 10 abas.",
    features: [
      "Rastreamento de precos de concorrentes em tempo real",
      "Alertas quando um concorrente muda precos ou lanca produto novo",
      "Comparativo automatico: seu preco vs media do mercado",
      "Score de competitividade por categoria (hamburgueres, drinks, etc)",
      "Mapa de calor de concorrentes por bairro",
    ],
  },
  {
    phase: "Fase 2",
    status: "upcoming",
    title: "Motor de Insights e Sugestoes",
    description:
      "Com os dados coletados, a IA comeca a gerar insights acionaveis. Ela analisa padroes de vendas, sazonalidades, tendencias de mercado e comportamento dos clientes pra sugerir acoes concretas.",
    features: [
      "Sugestoes de promocoes baseadas em dias fracos e estoque",
      "Previsao de demanda por dia da semana e horario",
      "Ideias de combos que maximizam ticket medio",
      "Deteccao de produtos com margem baixa vs alta rotatividade",
      "Alertas de oportunidade: 'concorrente X subiu preco do hamburguer em 15%'",
      "Recomendacoes de precificacao dinamica",
    ],
  },
  {
    phase: "Fase 3",
    status: "upcoming",
    title: "Criativo e Campanhas",
    description:
      "A IA gera conteudo criativo pro seu marketing. Analisa memes em alta, sazonalidades (Dia dos Namorados, jogos do Brasil, inverno), e cria sugestoes de campanhas completas — do copy ao timing de publicacao.",
    features: [
      "Gerador de posts e stories baseados em trends do momento",
      "Calendario de campanhas sazonais automatizado",
      "Sugestoes de temas pro dia (memes, datas comemorativas, eventos locais)",
      "A/B testing de nomes e descricoes de produtos",
      "Integracao com redes sociais pra agendar publicacoes",
      "Analise de sentimento das avaliacoes no Google e iFood",
    ],
  },
  {
    phase: "Fase 4",
    status: "upcoming",
    title: "Piloto Automatico",
    description:
      "O sistema toma decisoes operacionais sozinho — com sua aprovacao. Ele ajusta precos, ativa promos, publica conteudo e otimiza o cardapio continuamente, aprendendo com cada ciclo.",
    features: [
      "Precificacao dinamica automatica (com limites definidos por voce)",
      "Ativacao automatica de promo quando detecta queda de movimento",
      "Rotacao inteligente de destaques no cardapio digital",
      "Publicacao automatica em redes sociais",
      "Dashboard preditivo: faturamento estimado da semana",
      "Relatorios semanais automaticos com plano de acao",
    ],
  },
];

const kpis = [
  { label: "Concorrentes rastreados", value: "--", sublabel: "Em breve" },
  { label: "Insights gerados", value: "--", sublabel: "Em breve" },
  { label: "Economia estimada", value: "--", sublabel: "Em breve" },
  { label: "Campanhas sugeridas", value: "--", sublabel: "Em breve" },
];

export default function InteligenciaPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
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
            <strong>O que e isso?</strong> Estamos construindo um sistema de inteligencia artificial
            exclusivo pro Boteco da Estacao. Ele vai monitorar concorrentes, analisar tendencias,
            sugerir promocoes, criar campanhas e otimizar seu cardapio — tudo automaticamente.
            Pense nele como um <strong>diretor de marketing e estrategia que nunca dorme</strong>.
          </p>
        </div>
      </div>

      {/* KPI preview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="p-4 bg-card border border-border rounded-xl text-center">
            <p className="text-2xl font-bold text-muted-foreground/30">{kpi.value}</p>
            <p className="text-xs font-medium mt-1">{kpi.label}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{kpi.sublabel}</p>
          </div>
        ))}
      </div>

      {/* Roadmap */}
      <h2 className="text-lg font-bold mb-6">Roadmap de Evolucao</h2>
      <div className="space-y-6">
        {phases.map((phase, idx) => (
          <div
            key={phase.phase}
            className={`relative p-6 rounded-2xl border transition-all ${
              phase.status === "active"
                ? "bg-gradient-to-br from-violet-50/50 to-indigo-50/50 dark:from-violet-950/10 dark:to-indigo-950/10 border-violet-300/50 dark:border-violet-700/30 shadow-sm"
                : "bg-card border-border opacity-70"
            }`}
          >
            {/* Phase badge */}
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-lg tracking-wide ${
                phase.status === "active"
                  ? "bg-violet-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}>
                {phase.phase}
              </span>
              {phase.status === "active" && (
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                  <span className="text-[11px] font-medium text-violet-600 dark:text-violet-400">Em desenvolvimento</span>
                </span>
              )}
              {phase.status === "upcoming" && (
                <span className="text-[11px] text-muted-foreground">Em breve</span>
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
                    phase.status === "active" ? "text-violet-500" : "text-muted-foreground/40"
                  }`}>
                    {phase.status === "active" ? (
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

      {/* Bottom CTA */}
      <div className="mt-10 p-6 bg-card border border-border rounded-2xl text-center">
        <h3 className="text-base font-bold">Quer ativar a Central de Inteligencia?</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto leading-relaxed">
          A Fase 1 esta em desenvolvimento. Quando estiver pronta, voce vai receber os primeiros
          insights direto aqui no painel — sem precisar fazer nada.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <div className="inline-flex items-center justify-center h-11 px-6 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-semibold text-sm rounded-xl border border-violet-200/40 dark:border-violet-800/30">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Voce sera notificado quando ativar
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-[11px] text-muted-foreground leading-relaxed max-w-lg mx-auto">
            A Central de Inteligencia e um modulo premium que usa IA generativa (Claude AI)
            para analisar dados do mercado e do seu negocio em tempo real. O custo operacional
            da IA sera incluido em um plano mensal acessivel, desenhado pra gerar ROI desde o primeiro mes.
          </p>
        </div>
      </div>
    </div>
  );
}
