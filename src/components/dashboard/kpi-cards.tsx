function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface KpiCardsProps {
  vendasHoje: number;
  pedidosHoje: number;
  ticketMedio: number;
  pedidosPendentes: number;
}

const cards = [
  {
    key: "vendas",
    label: "Vendas hoje",
    format: (v: number) => formatBRL(v),
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    bgClass: "bg-green-50 dark:bg-green-950/30",
  },
  {
    key: "pedidos",
    label: "Pedidos hoje",
    format: (v: number) => String(v),
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    bgClass: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    key: "ticket",
    label: "Ticket medio",
    format: (v: number) => formatBRL(v),
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" />
      </svg>
    ),
    bgClass: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    key: "pendentes",
    label: "Pendentes",
    format: (v: number) => String(v),
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    bgClass: "bg-red-50 dark:bg-red-950/30",
  },
];

export function KpiCards({ vendasHoje, pedidosHoje, ticketMedio, pedidosPendentes }: KpiCardsProps) {
  const values: Record<string, number> = {
    vendas: vendasHoje,
    pedidos: pedidosHoje,
    ticket: ticketMedio,
    pendentes: pedidosPendentes,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div
          key={card.key}
          className="p-4 rounded-xl border border-border bg-card"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {card.label}
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.bgClass}`}>
              {card.icon}
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight">
            {card.format(values[card.key])}
          </p>
        </div>
      ))}
    </div>
  );
}
