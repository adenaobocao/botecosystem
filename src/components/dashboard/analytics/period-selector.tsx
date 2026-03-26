"use client";

import { useRouter, useSearchParams } from "next/navigation";

const periods = [
  { value: "7", label: "7 dias" },
  { value: "30", label: "30 dias" },
  { value: "90", label: "90 dias" },
];

export function PeriodSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("dias") || "7";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("dias", value);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex gap-1 bg-muted rounded-lg p-1">
      {periods.map((p) => (
        <button
          key={p.value}
          onClick={() => handleChange(p.value)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            current === p.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
