interface Review {
  competitorName: string;
  author: string;
  rating: number;
  text: string;
  timeAgo: string;
}

interface Props {
  reviews: Review[];
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width="10" height="10" viewBox="0 0 24 24"
          fill={s <= rating ? "currentColor" : "none"}
          stroke="currentColor" strokeWidth="2"
          className={s <= rating ? "text-amber-400" : "text-muted-foreground/30"}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function NegativeReviews({ reviews }: Props) {
  if (reviews.length === 0) {
    return (
      <p className="text-xs text-muted-foreground py-4 text-center">
        Nenhuma avaliacao negativa recente encontrada
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-[10px] text-muted-foreground">
        Pontos fracos dos concorrentes -- oportunidades para o Boteco
      </p>
      {reviews.map((review, i) => (
        <div key={i} className="p-3 bg-red-50/50 border border-red-100 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold text-red-700">{review.competitorName}</span>
            <div className="flex items-center gap-1.5">
              <Stars rating={review.rating} />
              <span className="text-[9px] text-muted-foreground">{review.timeAgo}</span>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            &ldquo;{review.text.length > 250 ? review.text.slice(0, 250) + "..." : review.text}&rdquo;
          </p>
          <p className="text-[9px] text-muted-foreground mt-1">-- {review.author}</p>
        </div>
      ))}
    </div>
  );
}
