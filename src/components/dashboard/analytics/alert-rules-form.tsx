"use client";

import { useState } from "react";
import { createAlertRule, deleteAlertRule, toggleAlertRule, markAllAlertsRead } from "@/lib/actions/alerts";

interface AlertRule {
  id: string;
  metric: string;
  operator: string;
  threshold: number;
  isActive: boolean;
}

interface Alert {
  id: string;
  metric: string;
  message: string;
  current_value: number;
  is_read: boolean;
  created_at: string;
}

interface Props {
  rules: AlertRule[];
  alerts: Alert[];
}

const metricOptions = [
  { value: "DAILY_REVENUE", label: "Faturamento diario (R$)" },
  { value: "ORDER_COUNT", label: "Qtd pedidos" },
  { value: "AVG_TICKET", label: "Ticket medio (R$)" },
  { value: "CANCELLATION_RATE", label: "Taxa cancelamento (%)" },
];

const operatorOptions = [
  { value: "LT", label: "Menor que" },
  { value: "GT", label: "Maior que" },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "agora";
  if (hours < 24) return `${hours}h atras`;
  return `${Math.floor(hours / 24)}d atras`;
}

export function AlertRulesForm({ rules, alerts }: Props) {
  const [metric, setMetric] = useState("DAILY_REVENUE");
  const [operator, setOperator] = useState("LT");
  const [threshold, setThreshold] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!threshold) return;
    setLoading(true);
    await createAlertRule({ metric, operator, threshold: Number(threshold) });
    setThreshold("");
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* Create rule form */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h2 className="text-sm font-semibold mb-3">Nova regra de alerta</h2>
        <form onSubmit={handleCreate} className="flex flex-wrap gap-2 items-end">
          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground">Metrica</label>
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              className="h-9 px-2 text-xs bg-background border border-border rounded-lg"
            >
              {metricOptions.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground">Condicao</label>
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="h-9 px-2 text-xs bg-background border border-border rounded-lg"
            >
              {operatorOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground">Valor</label>
            <input
              type="number"
              step="0.01"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="Ex: 500"
              className="h-9 w-24 px-2 text-xs bg-background border border-border rounded-lg"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !threshold}
            className="h-9 px-4 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            Criar
          </button>
        </form>
      </div>

      {/* Existing rules */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h2 className="text-sm font-semibold mb-3">Regras ativas</h2>
        {rules.length === 0 ? (
          <p className="text-xs text-muted-foreground">Nenhuma regra criada</p>
        ) : (
          <div className="space-y-2">
            {rules.map((rule) => {
              const metricLabel = metricOptions.find((m) => m.value === rule.metric)?.label || rule.metric;
              const opLabel = rule.operator === "LT" ? "<" : ">";
              return (
                <div key={rule.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${rule.isActive ? "bg-green-500" : "bg-muted-foreground"}`} />
                    <span className="text-xs">
                      {metricLabel} {opLabel} {rule.threshold}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleAlertRule(rule.id, !rule.isActive)}
                      className="px-2 py-1 text-[10px] rounded border border-border hover:bg-muted"
                    >
                      {rule.isActive ? "Pausar" : "Ativar"}
                    </button>
                    <button
                      onClick={() => deleteAlertRule(rule.id)}
                      className="px-2 py-1 text-[10px] rounded border border-border hover:bg-red-50 text-red-600"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent alerts */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Alertas recentes</h2>
          {alerts.some((a) => !a.is_read) && (
            <button
              onClick={() => markAllAlertsRead()}
              className="text-[10px] text-primary hover:underline"
            >
              Marcar todos como lidos
            </button>
          )}
        </div>
        {alerts.length === 0 ? (
          <p className="text-xs text-muted-foreground">Nenhum alerta disparado</p>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-2.5 rounded-lg border text-xs ${
                  alert.is_read
                    ? "bg-muted/30 border-border"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className={alert.is_read ? "text-muted-foreground" : "text-red-700 font-medium"}>
                    {alert.message}
                  </p>
                  <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                    {timeAgo(alert.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
