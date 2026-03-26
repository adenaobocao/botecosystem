import { Metadata } from "next";
import { getSegmentCounts, getCampaigns, getCouponSuggestions } from "@/lib/queries/marketing";
import { SegmentBreakdown } from "@/components/dashboard/marketing/segment-breakdown";
import Link from "next/link";

export const metadata: Metadata = { title: "Marketing | Boteco da Estacao" };
export const dynamic = "force-dynamic";

export default async function MarketingPage() {
  const [segments, campaigns, suggestions] = await Promise.all([
    getSegmentCounts(),
    getCampaigns(5),
    getCouponSuggestions("PENDING"),
  ]);

  const statusLabels: Record<string, { label: string; color: string }> = {
    DRAFT: { label: "Rascunho", color: "bg-muted text-muted-foreground" },
    SCHEDULED: { label: "Agendada", color: "bg-blue-100 text-blue-700" },
    SENDING: { label: "Enviando", color: "bg-amber-100 text-amber-700" },
    SENT: { label: "Enviada", color: "bg-green-100 text-green-700" },
    CANCELLED: { label: "Cancelada", color: "bg-red-100 text-red-700" },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">Marketing</h1>
        <p className="text-sm text-muted-foreground">Campanhas, cupons e conteudo com IA</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Nova campanha", href: "/dashboard/marketing/campanhas/nova", icon: "M12 5v14M5 12h14" },
          { label: "Campanhas", href: "/dashboard/marketing/campanhas", icon: "M22 12h-4l-3 9L9 3l-3 9H2" },
          { label: "Cupons IA", href: "/dashboard/marketing/cupons", icon: "M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" },
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
            <p className="text-xs text-muted-foreground py-4 text-center">
              Nenhuma sugestao pendente
            </p>
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

      {/* Recent campaigns */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Campanhas recentes</h2>
          <Link href="/dashboard/marketing/campanhas" className="text-[10px] text-primary hover:underline">
            Ver todas
          </Link>
        </div>
        {campaigns.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">
            Nenhuma campanha criada ainda
          </p>
        ) : (
          <div className="space-y-2">
            {campaigns.map((c) => {
              const st = statusLabels[c.status] || { label: c.status, color: "bg-muted" };
              return (
                <div key={c.id} className="flex items-center justify-between p-2.5 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-xs font-medium">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Segmento: {c.target_segment} &middot; {c.total_targets} alvos
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
