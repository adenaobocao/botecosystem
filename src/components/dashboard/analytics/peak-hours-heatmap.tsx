interface Props {
  data: { day_of_week: number; hour: number; order_count: number }[];
}

const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const horas = Array.from({ length: 16 }, (_, i) => i + 8); // 8h-23h

function getColor(value: number, max: number) {
  if (value === 0) return "bg-muted";
  const intensity = value / max;
  if (intensity > 0.75) return "bg-primary";
  if (intensity > 0.5) return "bg-primary/70";
  if (intensity > 0.25) return "bg-primary/40";
  return "bg-primary/20";
}

export function PeakHoursHeatmap({ data }: Props) {
  const max = Math.max(...data.map((d) => d.order_count), 1);

  // Build lookup map
  const lookup = new Map<string, number>();
  data.forEach((d) => lookup.set(`${d.day_of_week}-${d.hour}`, d.order_count));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        Sem dados de horarios
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[400px]">
        {/* Header */}
        <div className="flex gap-0.5 mb-1 pl-10">
          {horas.map((h) => (
            <div key={h} className="flex-1 text-center text-[9px] text-muted-foreground">
              {h}h
            </div>
          ))}
        </div>

        {/* Grid */}
        {dias.map((dia, dayIdx) => (
          <div key={dia} className="flex gap-0.5 mb-0.5 items-center">
            <span className="text-[10px] text-muted-foreground w-10 text-right pr-2 shrink-0">
              {dia}
            </span>
            {horas.map((hora) => {
              const count = lookup.get(`${dayIdx}-${hora}`) || 0;
              return (
                <div
                  key={hora}
                  className={`flex-1 aspect-square rounded-sm ${getColor(count, max)} transition-colors`}
                  title={`${dia} ${hora}h: ${count} pedidos`}
                />
              );
            })}
          </div>
        ))}

        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-[9px] text-muted-foreground">Menos</span>
          <div className="flex gap-0.5">
            {["bg-muted", "bg-primary/20", "bg-primary/40", "bg-primary/70", "bg-primary"].map((c) => (
              <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
          </div>
          <span className="text-[9px] text-muted-foreground">Mais</span>
        </div>
      </div>
    </div>
  );
}
