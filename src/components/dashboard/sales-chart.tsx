interface SalesChartProps {
  data: { date: string; label: string; total: number }[];
}

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function SalesChart({ data }: SalesChartProps) {
  const max = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="p-5 rounded-xl border border-border bg-card">
      <h3 className="text-sm font-semibold mb-1">Vendas — ultimos 7 dias</h3>
      <p className="text-xs text-muted-foreground mb-5">
        Total: {formatBRL(data.reduce((s, d) => s + d.total, 0))}
      </p>

      <div className="flex items-end gap-2 h-40">
        {data.map((day) => {
          const pct = max > 0 ? (day.total / max) * 100 : 0;
          const isToday = day.date === new Date().toISOString().split("T")[0];

          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5">
              {/* Value */}
              <span className="text-[10px] text-muted-foreground font-medium">
                {day.total > 0 ? formatBRL(day.total) : "—"}
              </span>
              {/* Bar */}
              <div className="w-full flex justify-center">
                <div
                  className={`w-full max-w-10 rounded-t-md transition-all ${
                    isToday ? "bg-primary" : "bg-primary/30"
                  }`}
                  style={{ height: `${Math.max(pct, 4)}%` }}
                />
              </div>
              {/* Label */}
              <span
                className={`text-[11px] font-medium ${
                  isToday ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
