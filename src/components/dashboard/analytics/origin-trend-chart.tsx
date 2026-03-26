"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface Props {
  data: { date: string; origin: string; count: number }[];
}

const originColors: Record<string, string> = {
  SITE: "hsl(var(--primary))",
  WHATSAPP: "#25D366",
  IFOOD: "#EA1D2C",
  TABLE: "#F59E0B",
};

const originLabels: Record<string, string> = {
  SITE: "Site",
  WHATSAPP: "WhatsApp",
  IFOOD: "iFood",
  TABLE: "Mesa",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function OriginTrendChart({ data }: Props) {
  // Pivot: each date has SITE, WHATSAPP, IFOOD, TABLE as keys
  const pivoted = new Map<string, Record<string, number>>();
  data.forEach((d) => {
    const key = d.date;
    if (!pivoted.has(key)) pivoted.set(key, {});
    pivoted.get(key)![d.origin] = d.count;
  });

  const chartData = Array.from(pivoted.entries()).map(([date, origins]) => ({
    date: formatDate(date),
    ...origins,
  }));

  const origins = [...new Set(data.map((d) => d.origin))];

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        Sem dados de origem
      </div>
    );
  }

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10 }}
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "11px",
            }}
          />
          <Legend
            iconSize={8}
            wrapperStyle={{ fontSize: "11px" }}
            formatter={(value: string) => originLabels[value] || value}
          />
          {origins.map((origin) => (
            <Bar
              key={origin}
              dataKey={origin}
              stackId="a"
              fill={originColors[origin] || "hsl(var(--muted))"}
              radius={origin === origins[origins.length - 1] ? [2, 2, 0, 0] : undefined}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
