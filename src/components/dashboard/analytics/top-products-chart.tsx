interface Props {
  data: { name: string; quantity: number; revenue: number }[];
}

export function TopProductsChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        Sem dados de produtos
      </div>
    );
  }

  const maxQty = Math.max(...data.map((d) => d.quantity));

  return (
    <div className="space-y-2.5">
      {data.map((product, i) => (
        <div key={i} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium truncate max-w-[60%]">{product.name}</span>
            <span className="text-muted-foreground shrink-0 ml-2">
              {product.quantity}x &middot; R$ {product.revenue.toFixed(0)}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(product.quantity / maxQty) * 100}%`,
                background:
                  i === 0
                    ? "hsl(var(--primary))"
                    : i < 3
                      ? "hsl(var(--primary) / 0.7)"
                      : "hsl(var(--primary) / 0.4)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
