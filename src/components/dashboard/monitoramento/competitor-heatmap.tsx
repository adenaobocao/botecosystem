interface ZoneData {
  zone: string;
  count: number;
  avgRating: number;
  topCompetitor: string;
  competitors: { name: string; rating: number; totalReviews: number; distance: number }[];
}

interface Props {
  zones: ZoneData[];
}

function getIntensity(count: number, max: number) {
  if (count === 0) return { bg: "bg-muted", text: "text-muted-foreground" };
  const ratio = count / max;
  if (ratio > 0.6) return { bg: "bg-red-500/80", text: "text-white" };
  if (ratio > 0.3) return { bg: "bg-amber-500/70", text: "text-white" };
  return { bg: "bg-green-500/60", text: "text-white" };
}

export function CompetitorHeatmap({ zones }: Props) {
  const maxCount = Math.max(...zones.map((z) => z.count), 1);

  return (
    <div className="space-y-3">
      {/* Visual heatmap grid */}
      <div className="grid grid-cols-5 gap-1.5">
        {zones.map((zone) => {
          const intensity = getIntensity(zone.count, maxCount);
          return (
            <div
              key={zone.zone}
              className={`relative p-3 rounded-xl ${intensity.bg} transition-all min-h-[100px] flex flex-col justify-between`}
            >
              <div>
                <p className={`text-[10px] font-semibold ${intensity.text}`}>{zone.zone}</p>
                <p className={`text-2xl font-bold ${intensity.text} mt-1`}>{zone.count}</p>
                <p className={`text-[9px] ${intensity.text} opacity-80`}>concorrentes</p>
              </div>
              {zone.avgRating > 0 && (
                <p className={`text-[10px] ${intensity.text} opacity-80 mt-2`}>
                  Media: {zone.avgRating.toFixed(1)}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-500/60" /> Baixa concorrencia
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-amber-500/70" /> Media
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-500/80" /> Alta
        </span>
      </div>

      {/* Zone details */}
      <div className="space-y-2">
        {zones.filter((z) => z.count > 0).map((zone) => (
          <details key={zone.zone} className="group">
            <summary className="flex items-center justify-between p-2.5 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 text-xs">
              <span className="font-medium">{zone.zone}</span>
              <span className="text-muted-foreground">
                {zone.count} locais &middot; Media {zone.avgRating.toFixed(1)}
              </span>
            </summary>
            <div className="mt-1 ml-3 space-y-1">
              {zone.competitors.slice(0, 5).map((c, i) => (
                <div key={i} className="flex items-center justify-between p-1.5 text-[11px]">
                  <span className="truncate max-w-[55%]">{c.name}</span>
                  <span className="text-muted-foreground shrink-0">
                    {c.rating} ({c.totalReviews}) &middot; {c.distance.toFixed(1)}km
                  </span>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
