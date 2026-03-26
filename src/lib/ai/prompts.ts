// Templates de prompts PT-BR para o Gemini

export function buildInsightPrompt(metrics: {
  revenue: number;
  orders: number;
  avgTicket: number;
  cancellations: number;
  topProducts: { name: string; qty: number; revenue: number }[];
  originBreakdown: Record<string, number>;
  previousRevenue?: number;
  previousOrders?: number;
}) {
  return `Analise as metricas do dia do Boteco da Estacao e gere um resumo executivo curto (max 3 paragrafos):

METRICAS DE HOJE:
- Faturamento: R$ ${metrics.revenue.toFixed(2)}${metrics.previousRevenue != null ? ` (ontem: R$ ${metrics.previousRevenue.toFixed(2)})` : ""}
- Pedidos: ${metrics.orders}${metrics.previousOrders != null ? ` (ontem: ${metrics.previousOrders})` : ""}
- Ticket medio: R$ ${metrics.avgTicket.toFixed(2)}
- Cancelamentos: ${metrics.cancellations}

TOP PRODUTOS (por quantidade):
${metrics.topProducts.map((p, i) => `${i + 1}. ${p.name}: ${p.qty}x (R$ ${p.revenue.toFixed(2)})`).join("\n")}

ORIGEM DOS PEDIDOS:
${Object.entries(metrics.originBreakdown).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

Destaque: o que foi bom, o que precisa de atencao, e uma sugestao acionavel pro proximo dia.`;
}

export function buildAnomalyPrompt(current: {
  metric: string;
  value: number;
  average: number;
  deviation: number;
}) {
  const direction = current.value > current.average ? "acima" : "abaixo";
  return `Detectei uma anomalia no Boteco da Estacao:

A metrica "${current.metric}" esta ${Math.abs(current.deviation).toFixed(0)}% ${direction} da media.
- Valor atual: ${current.value.toFixed(2)}
- Media (7 dias): ${current.average.toFixed(2)}

Explique em 2-3 frases curtas o que isso pode significar e o que o dono deveria fazer.`;
}

export function buildForecastPrompt(history: {
  dayOfWeek: string;
  avgRevenue: number;
  avgOrders: number;
  topProduct: string;
}[]) {
  return `Com base no historico do Boteco da Estacao por dia da semana, gere uma previsao curta pra amanha:

HISTORICO POR DIA DA SEMANA (media):
${history.map((d) => `- ${d.dayOfWeek}: R$ ${d.avgRevenue.toFixed(2)}, ${d.avgOrders.toFixed(0)} pedidos, mais vendido: ${d.topProduct}`).join("\n")}

Em 2-3 frases: o que esperar amanha, quanto preparar, e se vale fazer alguma promo especifica.`;
}

export function buildHealthScorePrompt(data: {
  revenueTrend: number; // % change week over week
  customerRetention: number; // % recurring customers
  cancellationRate: number; // %
  avgTicket: number;
  avgTicketPrev: number;
  totalCustomers: number;
  orderDiversity: number; // num different products ordered
}) {
  return `Calcule um "Score de Saude" de 0 a 100 pro Boteco da Estacao e explique:

DADOS:
- Tendencia de faturamento: ${data.revenueTrend > 0 ? "+" : ""}${data.revenueTrend.toFixed(1)}% vs semana passada
- Retencao de clientes: ${data.customerRetention.toFixed(1)}% recorrentes
- Taxa de cancelamento: ${data.cancellationRate.toFixed(1)}%
- Ticket medio: R$ ${data.avgTicket.toFixed(2)} (anterior: R$ ${data.avgTicketPrev.toFixed(2)})
- Total de clientes unicos: ${data.totalCustomers}
- Diversidade de produtos vendidos: ${data.orderDiversity}

Responda EXATAMENTE nesse formato:
SCORE: [numero]
NIVEL: [Critico/Preocupante/Estavel/Bom/Excelente]
RESUMO: [2-3 frases explicando o score e o que priorizar]`;
}

export function buildCampaignPrompt(params: {
  segment: string;
  segmentDescription: string;
  products?: { name: string; price: number }[];
  occasion?: string;
  tone?: string;
}) {
  return `Crie uma mensagem de WhatsApp marketing pro Boteco da Estacao.

PUBLICO: ${params.segment} (${params.segmentDescription})
${params.occasion ? `OCASIAO: ${params.occasion}` : ""}
TOM: ${params.tone || "casual e convidativo"}
${params.products ? `PRODUTOS EM DESTAQUE:\n${params.products.map((p) => `- ${p.name}: R$ ${p.price.toFixed(2)}`).join("\n")}` : ""}

Regras:
- Max 300 caracteres (WhatsApp fica cortado se muito longo)
- Inclua um CTA claro (ex: "Peca ja pelo site!" ou "Responda essa mensagem pra pedir")
- Nao use emojis
- Faca soar natural, como se fosse do dono do bar falando
- Se possivel, inclua um senso de urgencia ou exclusividade`;
}

export function buildContentPrompt(params: {
  type: "SOCIAL_POST" | "WHATSAPP_BROADCAST" | "PROMO_DESCRIPTION" | "EVENT_PROMO";
  context?: string;
  products?: { name: string; price: number }[];
  event?: { title: string; artist?: string; date: string; coverCharge?: number };
  tone?: string;
}) {
  const typeLabels: Record<string, string> = {
    SOCIAL_POST: "Post para Instagram/Facebook",
    WHATSAPP_BROADCAST: "Mensagem broadcast WhatsApp",
    PROMO_DESCRIPTION: "Descricao de promocao pro site",
    EVENT_PROMO: "Divulgacao de evento/show",
  };

  return `Crie um "${typeLabels[params.type]}" pro Boteco da Estacao.

${params.context ? `CONTEXTO: ${params.context}` : ""}
${params.products ? `PRODUTOS:\n${params.products.map((p) => `- ${p.name}: R$ ${p.price.toFixed(2)}`).join("\n")}` : ""}
${params.event ? `EVENTO: ${params.event.title}${params.event.artist ? ` com ${params.event.artist}` : ""} em ${params.event.date}${params.event.coverCharge ? ` (entrada R$ ${params.event.coverCharge.toFixed(2)})` : " (entrada franca)"}` : ""}
TOM: ${params.tone || "casual"}

Regras:
- Nao use emojis
- ${params.type === "SOCIAL_POST" ? "Inclua sugestoes de hashtags no final, separadas" : ""}
- ${params.type === "WHATSAPP_BROADCAST" ? "Max 300 caracteres" : ""}
- Faca soar natural e autentico, como comunicacao real de um bar
- Destaque o que torna o Boteco da Estacao unico`;
}

export function buildCouponPrompt(data: {
  customerName: string;
  totalOrders: number;
  totalSpent: number;
  daysSinceLastOrder: number;
  avgTicket: number;
  favoriteProducts: string[];
}) {
  return `Sugira um cupom personalizado pro cliente do Boteco da Estacao:

CLIENTE: ${data.customerName}
- ${data.totalOrders} pedidos no total
- R$ ${data.totalSpent.toFixed(2)} gasto total
- ${data.daysSinceLastOrder} dias sem pedir
- Ticket medio: R$ ${data.avgTicket.toFixed(2)}
- Produtos favoritos: ${data.favoriteProducts.join(", ")}

Responda EXATAMENTE nesse formato:
TIPO: [PERCENTAGE ou FIXED]
VALOR: [numero — ex: 10 pra 10% ou 5 pra R$5]
MOTIVO: [1 frase curta explicando porque esse cupom faz sentido pro negocio]`;
}
