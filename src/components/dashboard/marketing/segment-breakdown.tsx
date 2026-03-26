interface Props {
  segments: { segment: string; count: number }[];
}

const segmentInfo: Record<string, { label: string; color: string; description: string }> = {
  NEW: { label: "Novos", color: "bg-blue-500", description: "1-2 pedidos, recente" },
  RECURRING: { label: "Recorrentes", color: "bg-green-500", description: "3+ pedidos, ativo" },
  VIP: { label: "VIP", color: "bg-amber-500", description: "10+ pedidos ou R$500+" },
  INACTIVE: { label: "Inativos", color: "bg-red-500", description: "30+ dias sem pedir" },
};

export function SegmentBreakdown({ segments }: Props) {
  const total = segments.reduce((sum, s) => sum + s.count, 0);

  if (total === 0) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        Nenhum cliente segmentado ainda. A segmentacao roda automaticamente todo dia.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bar visual */}
      <div className="flex h-4 rounded-full overflow-hidden">
        {segments.map((s) => {
          const info = segmentInfo[s.segment];
          const pct = (s.count / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={s.segment}
              className={`${info?.color || "bg-muted"} transition-all`}
              style={{ width: `${pct}%` }}
              title={`${info?.label}: ${s.count} (${pct.toFixed(0)}%)`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2">
        {segments.map((s) => {
          const info = segmentInfo[s.segment] || { label: s.segment, color: "bg-muted", description: "" };
          const pct = total > 0 ? ((s.count / total) * 100).toFixed(0) : "0";
          return (
            <div key={s.segment} className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
              <div className={`w-3 h-3 rounded-full shrink-0 mt-0.5 ${info.color}`} />
              <div>
                <p className="text-xs font-medium">
                  {info.label} <span className="text-muted-foreground">({s.count})</span>
                </p>
                <p className="text-[10px] text-muted-foreground">{pct}% &middot; {info.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-muted-foreground text-center">
        Total: {total} clientes segmentados
      </p>
    </div>
  );
}
