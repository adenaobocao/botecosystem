import { Metadata } from "next";
import { getAlertRules, getRecentAlerts } from "@/lib/queries/alerts";
import { AlertRulesForm } from "@/components/dashboard/analytics/alert-rules-form";
import { AiChatBox } from "@/components/dashboard/analytics/ai-chat-box";
import Link from "next/link";

export const metadata: Metadata = { title: "Alertas | Inteligencia" };
export const dynamic = "force-dynamic";

export default async function AlertasPage() {
  const [rules, alerts] = await Promise.all([
    getAlertRules(),
    getRecentAlerts(30),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/inteligencia"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Alertas</h1>
          <p className="text-sm text-muted-foreground">Configure regras e veja alertas disparados</p>
        </div>
      </div>

      <AlertRulesForm rules={rules} alerts={alerts} />

      <AiChatBox />
    </div>
  );
}
