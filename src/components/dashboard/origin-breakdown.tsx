const originLabels: Record<string, { label: string; color: string }> = {
  SITE: { label: "Site", color: "bg-primary" },
  IFOOD: { label: "iFood", color: "bg-red-500" },
  WHATSAPP: { label: "WhatsApp", color: "bg-green-500" },
  TABLE: { label: "Mesa", color: "bg-amber-500" },
};

interface OriginBreakdownProps {
  data: Record<string, number>;
  total: number;
}

export function OriginBreakdown({ data, total }: OriginBreakdownProps) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-5 rounded-xl border border-border bg-card h-full">
      <h3 className="text-sm font-semibold mb-1">Origem dos pedidos</h3>
      <p className="text-xs text-muted-foreground mb-5">Hoje</p>

      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum pedido ainda</p>
      ) : (
        <div className="space-y-4">
          {entries.map(([origin, count]) => {
            const info = originLabels[origin] || { label: origin, color: "bg-muted-foreground" };
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;

            return (
              <div key={origin}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${info.color}`} />
                    <span className="text-sm font-medium">{info.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {count} ({pct}%)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${info.color} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
