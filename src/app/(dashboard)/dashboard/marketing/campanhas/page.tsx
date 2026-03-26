import { Metadata } from "next";
import { getCampaigns } from "@/lib/queries/marketing";
import Link from "next/link";

export const metadata: Metadata = { title: "Campanhas | Marketing" };
export const dynamic = "force-dynamic";

const statusLabels: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Rascunho", color: "bg-muted text-muted-foreground" },
  SCHEDULED: { label: "Agendada", color: "bg-blue-100 text-blue-700" },
  SENDING: { label: "Enviando", color: "bg-amber-100 text-amber-700" },
  SENT: { label: "Enviada", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelada", color: "bg-red-100 text-red-700" },
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit",
  });
}

export default async function CampanhasPage() {
  const campaigns = await getCampaigns(50);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/marketing" className="text-muted-foreground hover:text-foreground">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Campanhas</h1>
            <p className="text-sm text-muted-foreground">Todas as campanhas WhatsApp</p>
          </div>
        </div>
        <Link
          href="/dashboard/marketing/campanhas/nova"
          className="h-9 px-4 flex items-center text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Nova campanha
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">Nenhuma campanha criada</p>
          <Link
            href="/dashboard/marketing/campanhas/nova"
            className="inline-block mt-3 text-xs text-primary hover:underline"
          >
            Criar primeira campanha
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {campaigns.map((c) => {
            const st = statusLabels[c.status] || { label: c.status, color: "bg-muted" };
            return (
              <div
                key={c.id}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-xl"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {c.target_segment} &middot; {c.total_targets} alvos &middot; Criada {formatDate(c.created_at)}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-sm">
                    {c.message_template.substring(0, 80)}...
                  </p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className={`px-2.5 py-1 text-[10px] font-medium rounded-full ${st.color}`}>
                    {st.label}
                  </span>
                  {c.status === "SENT" && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {c.total_delivered}/{c.total_targets} entregues
                    </p>
                  )}
                  {c.scheduled_at && c.status === "SCHEDULED" && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Agendada: {formatDate(c.scheduled_at)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
