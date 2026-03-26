"use client";

interface Review {
  author: string;
  rating: number;
  text: string;
  timeAgo: string;
}

interface Props {
  detail: {
    name: string;
    rating: number;
    totalReviews: number;
    address: string;
    distance: number;
    phone: string | null;
    website: string | null;
    reviews: Review[];
  } | null;
  loading: boolean;
  onClose: () => void;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width="12" height="12" viewBox="0 0 24 24"
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

export function CompetitorDetail({ detail, loading, onClose }: Props) {
  if (loading) {
    return (
      <div className="p-6 animate-pulse space-y-3">
        <div className="h-5 w-40 bg-muted rounded" />
        <div className="h-4 w-60 bg-muted rounded" />
        <div className="h-20 bg-muted rounded" />
        <div className="h-20 bg-muted rounded" />
      </div>
    );
  }

  if (!detail) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold">{detail.name}</h3>
          <p className="text-[10px] text-muted-foreground">{detail.address}</p>
          <p className="text-[10px] text-muted-foreground">{detail.distance.toFixed(1)}km de distancia</p>
        </div>
        <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2.5 bg-muted/30 rounded-lg text-center">
          <p className="text-lg font-bold">{detail.rating}</p>
          <Stars rating={Math.round(detail.rating)} />
        </div>
        <div className="p-2.5 bg-muted/30 rounded-lg text-center">
          <p className="text-lg font-bold">{detail.totalReviews}</p>
          <p className="text-[9px] text-muted-foreground">avaliacoes</p>
        </div>
        <div className="p-2.5 bg-muted/30 rounded-lg text-center">
          {detail.phone ? (
            <>
              <p className="text-[11px] font-medium">{detail.phone}</p>
              <p className="text-[9px] text-muted-foreground">telefone</p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">Sem tel.</p>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div>
        <h4 className="text-xs font-semibold mb-2">Avaliacoes recentes</h4>
        {detail.reviews.length === 0 ? (
          <p className="text-xs text-muted-foreground">Sem avaliacoes disponiveis</p>
        ) : (
          <div className="space-y-2">
            {detail.reviews.map((review, i) => (
              <div key={i} className="p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 flex items-center justify-center text-[9px] font-bold bg-muted rounded-full">
                      {review.author.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-[10px] font-medium">{review.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Stars rating={review.rating} />
                    <span className="text-[9px] text-muted-foreground">{review.timeAgo}</span>
                  </div>
                </div>
                {review.text && (
                  <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                    {review.text.length > 200 ? review.text.slice(0, 200) + "..." : review.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
