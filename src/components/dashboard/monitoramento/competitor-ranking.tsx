interface Competitor {
  placeId: string;
  name: string;
  rating: number;
  totalReviews: number;
  distance: number;
  isOpen: boolean | null;
}

interface Props {
  competitors: Competitor[];
  botecoRating: number;
  onSelect: (placeId: string) => void;
}

function getRatingColor(rating: number) {
  if (rating >= 4.5) return "text-green-600";
  if (rating >= 4.0) return "text-amber-600";
  return "text-red-600";
}

const BOTECO_PLACE_ID = "ChIJIwpGLVsa6JQRCc4qML-9cs4";

export function CompetitorRanking({ competitors, botecoRating, onSelect }: Props) {
  const sorted = [...competitors].sort((a, b) => b.rating - a.rating || b.totalReviews - a.totalReviews);

  return (
    <div className="space-y-1.5">
      {/* Boteco position */}
      <button
        onClick={() => onSelect(BOTECO_PLACE_ID)}
        className="w-full p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between hover:bg-primary/15 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground rounded-full">
            {sorted.filter((c) => c.rating > botecoRating).length + 1}
          </span>
          <div>
            <p className="text-xs font-bold">Boteco da Estacao</p>
            <p className="text-[10px] text-muted-foreground">Voce -- clique pra ver avaliacoes</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-sm font-bold ${getRatingColor(botecoRating)}`}>{botecoRating}</p>
          <p className="text-[9px] text-muted-foreground">Google Maps</p>
        </div>
      </button>

      {/* Competitors */}
      {sorted.map((c, i) => (
        <button
          key={c.placeId}
          onClick={() => onSelect(c.placeId)}
          className="w-full p-2.5 bg-card border border-border rounded-xl flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-6 h-6 flex items-center justify-center text-[10px] font-medium bg-muted rounded-full shrink-0">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{c.name}</p>
              <p className="text-[10px] text-muted-foreground">
                {c.distance.toFixed(1)}km
                {c.isOpen !== null && (
                  <span className={c.isOpen ? " text-green-600" : " text-red-500"}>
                    {" "}&middot; {c.isOpen ? "Aberto" : "Fechado"}
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0 ml-2">
            <p className={`text-sm font-bold ${getRatingColor(c.rating)}`}>{c.rating}</p>
            <p className="text-[9px] text-muted-foreground">{c.totalReviews} avaliacoes</p>
          </div>
        </button>
      ))}
    </div>
  );
}
