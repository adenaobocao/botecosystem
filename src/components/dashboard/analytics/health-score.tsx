interface Props {
  insight: {
    content: string;
  } | null;
}

function parseScore(content: string): { score: number; level: string; summary: string } {
  const scoreMatch = content.match(/SCORE:\s*(\d+)/);
  const levelMatch = content.match(/NIVEL:\s*(.+)/);
  const summaryMatch = content.match(/RESUMO:\s*([\s\S]+)/);

  return {
    score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
    level: levelMatch ? levelMatch[1].trim() : "Sem dados",
    summary: summaryMatch ? summaryMatch[1].trim() : content,
  };
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-blue-600";
  if (score >= 40) return "text-amber-600";
  return "text-red-600";
}

function getBarColor(score: number) {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-blue-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-red-500";
}

export function HealthScore({ insight }: Props) {
  if (!insight) {
    return (
      <div className="p-6 text-center">
        <p className="text-3xl font-bold text-muted-foreground/30">--</p>
        <p className="text-xs text-muted-foreground mt-1">Gerando score...</p>
      </div>
    );
  }

  const { score, level, summary } = parseScore(insight.content);

  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}</p>
        <p className="text-xs font-medium mt-1">{level}</p>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${getBarColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">{summary}</p>
    </div>
  );
}
