"use client";

import { useState, useEffect } from "react";

interface Review {
  author: string;
  rating: number;
  text: string;
  timeAgo: string;
}

interface BotecoData {
  name: string;
  rating: number;
  totalReviews: number;
  phone: string | null;
  website: string | null;
  reviews: Review[];
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

// Place ID do Boteco da Estacao (Pub Station no Google)
const BOTECO_PLACE_ID = "ChIJIwpGLVsa6JQRCc4qML-9cs4";

export function OurReviews() {
  const [data, setData] = useState<BotecoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "positive" | "negative">("all");

  useEffect(() => {
    fetch(`/api/ai/competitor-analysis?placeId=${BOTECO_PLACE_ID}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3 py-4">
        <div className="h-16 bg-muted rounded-xl" />
        <div className="h-24 bg-muted rounded-xl" />
        <div className="h-24 bg-muted rounded-xl" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-xs text-muted-foreground py-4 text-center">Erro ao carregar avaliacoes</p>;
  }

  const filtered = data.reviews.filter((r) => {
    if (filter === "positive") return r.rating >= 4;
    if (filter === "negative") return r.rating <= 3;
    return true;
  });

  const positiveCount = data.reviews.filter((r) => r.rating >= 4).length;
  const negativeCount = data.reviews.filter((r) => r.rating <= 3).length;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl text-center">
          <p className="text-2xl font-bold text-primary">{data.rating}</p>
          <Stars rating={Math.round(data.rating)} />
          <p className="text-[9px] text-muted-foreground mt-1">Google Maps</p>
        </div>
        <div className="p-3 bg-muted/30 rounded-xl text-center">
          <p className="text-2xl font-bold">{data.totalReviews}</p>
          <p className="text-[9px] text-muted-foreground">total avaliacoes</p>
        </div>
        <div className="p-3 bg-muted/30 rounded-xl text-center">
          <p className="text-2xl font-bold text-green-600">{positiveCount}</p>
          <p className="text-[9px] text-muted-foreground">positivas (4-5)</p>
          {negativeCount > 0 && (
            <p className="text-[9px] text-red-500 mt-0.5">{negativeCount} negativas</p>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-1.5">
        {[
          { value: "all" as const, label: "Todas" },
          { value: "positive" as const, label: "Positivas" },
          { value: "negative" as const, label: "Negativas" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`flex-1 py-1.5 text-[10px] font-medium rounded-lg border transition-colors ${
              filter === f.value ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Reviews */}
      {filtered.length === 0 ? (
        <p className="text-xs text-muted-foreground py-4 text-center">
          Nenhuma avaliacao {filter === "negative" ? "negativa" : ""} encontrada
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((review, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg ${
                review.rating <= 2
                  ? "bg-red-50/50 border border-red-100"
                  : review.rating === 3
                    ? "bg-amber-50/50 border border-amber-100"
                    : "bg-muted/20 border border-border"
              }`}
            >
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
                  {review.text}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
