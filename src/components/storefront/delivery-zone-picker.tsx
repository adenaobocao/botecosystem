"use client";

import { useState, useMemo } from "react";

interface Neighborhood {
  id: string;
  name: string;
}

interface Zone {
  id: string;
  name: string;
  fee: number | string;
  estimatedMin: number;
  neighborhoods: Neighborhood[];
}

interface DeliveryZonePickerProps {
  zones: Zone[];
  onSelect: (fee: number, estimatedMin: number, neighborhood: string) => void;
}

function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function DeliveryZonePicker({ zones, onSelect }: DeliveryZonePickerProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  // Flatten all neighborhoods with their zone info
  const allNeighborhoods = useMemo(() => {
    return zones.flatMap((zone) =>
      zone.neighborhoods.map((n) => ({
        ...n,
        zoneName: zone.name,
        fee: Number(zone.fee),
        estimatedMin: zone.estimatedMin,
      }))
    );
  }, [zones]);

  const filtered = search.trim()
    ? allNeighborhoods.filter((n) =>
        n.name.toLowerCase().includes(search.toLowerCase())
      )
    : allNeighborhoods;

  function handleSelect(n: typeof allNeighborhoods[0]) {
    setSelected(n.id);
    setSearch(n.name);
    onSelect(n.fee, n.estimatedMin, n.name);
  }

  const selectedNeighborhood = allNeighborhoods.find((n) => n.id === selected);

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold block">Seu bairro</label>
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          if (selected) setSelected(null);
        }}
        placeholder="Digite o nome do bairro..."
        className="flex h-11 w-full rounded-xl border border-border bg-card px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
      />

      {/* Dropdown results */}
      {search.trim() && !selected && filtered.length > 0 && (
        <div className="border border-border rounded-xl bg-card overflow-hidden max-h-[200px] overflow-y-auto">
          {filtered.map((n) => (
            <button
              key={n.id}
              onClick={() => handleSelect(n)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-secondary/50 transition-colors text-left"
            >
              <span className="font-medium">{n.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatPrice(n.fee)} - ~{n.estimatedMin}min
              </span>
            </button>
          ))}
        </div>
      )}

      {search.trim() && !selected && filtered.length === 0 && (
        <p className="text-xs text-muted-foreground px-1">
          Bairro nao encontrado. Entre em contato pelo WhatsApp.
        </p>
      )}

      {/* Selected info */}
      {selectedNeighborhood && (
        <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-xl">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-xs text-foreground">
            {selectedNeighborhood.name} — {formatPrice(selectedNeighborhood.fee)} (~{selectedNeighborhood.estimatedMin}min)
          </span>
        </div>
      )}
    </div>
  );
}
