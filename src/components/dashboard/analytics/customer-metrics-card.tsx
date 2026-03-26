interface Props {
  metrics: {
    totalCustomers: number;
    newThisMonth: number;
    recurring: number;
    withOrders: number;
    churnRate: number;
  };
}

export function CustomerMetricsCard({ metrics }: Props) {
  const items = [
    { label: "Total clientes", value: metrics.totalCustomers.toString() },
    { label: "Novos (mes)", value: metrics.newThisMonth.toString() },
    { label: "Recorrentes", value: metrics.recurring.toString() },
    { label: "Churn", value: `${metrics.churnRate.toFixed(0)}%` },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div key={item.label} className="p-3 bg-muted/50 rounded-xl text-center">
          <p className="text-lg font-bold">{item.value}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
