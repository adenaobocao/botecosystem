import { Metadata } from "next";
import { getSegmentCounts, getCampaigns, getCouponSuggestions, getCampaignPerformance } from "@/lib/queries/marketing";
import { getTodayEvent } from "@/lib/queries/events";
import { SegmentBreakdown } from "@/components/dashboard/marketing/segment-breakdown";
import { serialize } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = { title: "Marketing | Boteco da Estacao" };
export const dynamic = "force-dynamic";

const statusLabels: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Rascunho", color: "bg-muted text-muted-foreground" },
  SCHEDULED: { label: "Agendada", color: "bg-blue-100 text-blue-700" },
  SENDING: { label: "Enviando", color: "bg-amber-100 text-amber-700" },
  SENT: { label: "Enviada", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelada", color: "bg-red-100 text-red-700" },
};

export default async function MarketingPage() {
  const [segments, campaigns, suggestions, performance, todayEvent] = await Promise.all([
    getSegmentCounts(),
    getCampaigns(5),
    getCouponSuggestions("PENDING"),
    getCampaignPerformance(),
    getTodayEvent(),
  ]);

  const inactiveCount = segments.find((s) => s.segment === "INACTIVE")?.count || 0;

  // Quick campaign links with pre-filled params
  const quickCampaigns = [
    {
      label: "Happy Hour Hoje",
      href: "/dashboard/marketing/campanhas/nova?name=Happy+Hour&occasion=Happy+hour+com+descontos+em+drinks+e+chopp&segment=ALL",
      icon: "M8 2v4M16 2v4M3 10h18",
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      label: "Reativar Inativos",
      href: `/dashboard/marketing/campanhas/nova?name=Volta+pro+Boteco&occasion=Trazer+clientes+inativos+de+volta&segment=INACTIVE`,
      icon: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
      color: "text-red-600 bg-red-50 border-red-200",
      badge: inactiveCount > 0 ? `${inactiveCount}` : undefined,
    },
    {
      label: "Promo Flash",
      href: "/dashboard/marketing/campanhas/nova?name=Promo+Flash&occasion=Promocao+relampago+por+tempo+limitado&segment=ALL",
      icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8",
      color: "text-violet-600 bg-violet-50 border-violet-200",
    },
    ...(todayEvent
      ? [
          {
            label: `Divulgar: ${serialize(todayEvent).title}`,
            href: `/dashboard/marketing/campanhas/nova?name=${encodeURIComponent(`Evento: ${serialize(todayEvent).title}`)}&occasion=${encodeURIComponent(`Show hoje: ${serialize(todayEvent).title}${serialize(todayEvent).artistName ? ` com ${serialize(todayEvent).artistName}` : ""}`)}&segment=ALL`,
            icon: "M9 18V5l12-2v13",
            color: "text-green-600 bg-green-50 border-green-200",
          },
        ]
      : []),
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Marketing</h1>
          <p className="text-sm text-muted-foreground">Campanhas, cupons e conteudo com IA</p>
        </div>
        <Link
          href="/dashboard/marketing/campanhas/nova"
          className="h-9 px-4 flex items-center text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Nova campanha
        </Link>
      </div>

      {/* Quick campaigns */}
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Campanhas rapidas</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {quickCampaigns.map((qc) => (
            <Link
              key={qc.label}
              href={qc.href}
              className={`relative flex items-center gap-2 p-3 rounded-xl border transition-colors hover:opacity-80 ${qc.color}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d={qc.icon} />
              </svg>
              <span className="text-xs font-medium truncate">{qc.label}</span>
              {qc.badge && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[9px] font-bold bg-red-500 text-white rounded-full">
                  {qc.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Nova campanha", href: "/dashboard/marketing/campanhas/nova", icon: "M12 5v14M5 12h14" },
          { label: "Campanhas", href: "/dashboard/marketing/campanhas", icon: "M22 12h-4l-3 9L9 3l-3 9H2" },
          { label: "Cupons IA", href: "/dashboard/marketing/cupons", icon: "M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" },
          { label: "Criativo", href: "/dashboard/marketing/criativo", icon: "M3 3h18v18H3zM9 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
          { label: "Conteudo", href: "/dashboard/marketing/conteudo", icon: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-2.5 p-3 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0">
              <path d={action.icon} />
            </svg>
            <span className="text-xs font-medium">{action.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Segments */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-3">Segmentos de clientes</h2>
          <SegmentBreakdown segments={segments} />
        </div>

        {/* Pending coupon suggestions */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Sugestoes de cupons</h2>
            {suggestions.length > 0 && (
              <Link href="/dashboard/marketing/cupons" className="text-[10px] text-primary hover:underline">
                Ver todas
              </Link>
            )}
          </div>
          {suggestions.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center">Nenhuma sugestao pendente</p>
          ) : (
            <div className="space-y-2">
              {suggestions.slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-xs font-medium">{s.user_name}</p>
                    <p className="text-[10px] text-muted-foreground">{s.reason}</p>
                  </div>
                  <span className="text-xs font-bold text-primary shrink-0">
                    {s.coupon_type === "PERCENTAGE" ? `${s.suggested_value}%` : `R$${s.suggested_value}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Campaign performance */}
      {performance.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-3">Performance das campanhas</h2>
          <div className="space-y-2">
            {performance.map((p) => {
              const conversionRate = p.total_delivered > 0 ? (p.orders_after / p.total_delivered * 100) : 0;
              return (
                <div key={p.campaign_id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-xs font-medium">{p.campaign_name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {p.total_delivered} entregues &middot; {p.orders_after} pedidos depois
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className={`text-sm font-bold ${conversionRate > 5 ? "text-green-600" : conversionRate > 0 ? "text-amber-600" : "text-muted-foreground"}`}>
                      {conversionRate.toFixed(1)}%
                    </p>
                    <p className="text-[9px] text-muted-foreground">conversao (7d)</p>
                    {p.revenue_after > 0 && (
                      <p className="text-[10px] text-green-600 font-medium">
                        R$ {p.revenue_after.toFixed(0)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent campaigns */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Campanhas recentes</h2>
          <Link href="/dashboard/marketing/campanhas" className="text-[10px] text-primary hover:underline">
            Ver todas
          </Link>
        </div>
        {campaigns.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">Nenhuma campanha criada ainda</p>
        ) : (
          <div className="space-y-2">
            {campaigns.map((c) => {
              const st = statusLabels[c.status] || { label: c.status, color: "bg-muted" };
              return (
                <div key={c.id} className="flex items-center justify-between p-2.5 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-xs font-medium">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {c.target_segment} &middot; {c.total_targets} alvos
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${st.color}`}>
                      {st.label}
                    </span>
                    {c.total_delivered > 0 && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {c.total_delivered}/{c.total_targets} entregues
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
