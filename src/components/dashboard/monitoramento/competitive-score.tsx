interface Props {
  analysis: {
    totalCompetitors: number;
    avgRating: number;
    avgReviews: number;
    botecoRating: number;
    aboveUs: number;
    belowUs: number;
    rankPosition: number;
    percentile: number;
  };
}

function getScoreColor(percentile: number) {
  if (percentile >= 80) return { color: "text-green-600", bg: "bg-green-500", label: "Excelente" };
  if (percentile >= 60) return { color: "text-blue-600", bg: "bg-blue-500", label: "Bom" };
  if (percentile >= 40) return { color: "text-amber-600", bg: "bg-amber-500", label: "Medio" };
  return { color: "text-red-600", bg: "bg-red-500", label: "Precisa melhorar" };
}

export function CompetitiveScore({ analysis }: Props) {
  const score = getScoreColor(analysis.percentile);

  return (
    <div className="space-y-4">
      {/* Main score */}
      <div className="text-center">
        <p className={`text-5xl font-bold ${score.color}`}>#{analysis.rankPosition}</p>
        <p className="text-xs text-muted-foreground mt-1">
          de {analysis.totalCompetitors} concorrentes
        </p>
        <p className={`text-xs font-medium mt-0.5 ${score.color}`}>{score.label}</p>
      </div>

      {/* Percentile bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground">Percentil</span>
          <span className="font-medium">{analysis.percentile}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${score.bg}`}
            style={{ width: `${analysis.percentile}%` }}
          />
        </div>
      </div>

      {/* Comparison grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 bg-muted/30 rounded-xl text-center">
          <p className="text-lg font-bold">{analysis.botecoRating}</p>
          <p className="text-[9px] text-muted-foreground">Nosso rating</p>
        </div>
        <div className="p-3 bg-muted/30 rounded-xl text-center">
          <p className="text-lg font-bold">{analysis.avgRating}</p>
          <p className="text-[9px] text-muted-foreground">Media mercado</p>
        </div>
        <div className="p-3 bg-muted/30 rounded-xl text-center">
          <p className="text-lg font-bold text-green-600">{analysis.belowUs}</p>
          <p className="text-[9px] text-muted-foreground">Abaixo de nos</p>
        </div>
        <div className="p-3 bg-muted/30 rounded-xl text-center">
          <p className="text-lg font-bold text-red-600">{analysis.aboveUs}</p>
          <p className="text-[9px] text-muted-foreground">Acima de nos</p>
        </div>
      </div>
    </div>
  );
}
