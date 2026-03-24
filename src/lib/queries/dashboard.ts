import { db } from "@/lib/db";

export async function getDashboardMetrics() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 6);

  const [
    todayOrders,
    pendingOrders,
    allTodayOrders,
    weekOrders,
  ] = await Promise.all([
    // Total vendas hoje (completed orders)
    db.order.findMany({
      where: {
        createdAt: { gte: todayStart },
        status: { notIn: ["CANCELLED"] },
        deletedAt: null,
      },
      select: { total: true, origin: true },
    }),
    // Pedidos pendentes (need attention)
    db.order.count({
      where: {
        status: { in: ["PENDING", "CONFIRMED", "PREPARING"] },
        deletedAt: null,
      },
    }),
    // All orders today
    db.order.count({
      where: {
        createdAt: { gte: todayStart },
        deletedAt: null,
      },
    }),
    // Last 7 days
    db.order.findMany({
      where: {
        createdAt: { gte: weekStart },
        status: { notIn: ["CANCELLED"] },
        deletedAt: null,
      },
      select: { total: true, createdAt: true, origin: true },
    }),
  ]);

  const vendasHoje = todayOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const ticketMedio = todayOrders.length > 0 ? vendasHoje / todayOrders.length : 0;

  // Sales by day (last 7 days)
  const salesByDay: { date: string; label: string; total: number }[] = [];
  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(todayStart);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayOrders = weekOrders.filter(
      (o) => o.createdAt.toISOString().split("T")[0] === dateStr
    );
    salesByDay.push({
      date: dateStr,
      label: diasSemana[d.getDay()],
      total: dayOrders.reduce((sum, o) => sum + Number(o.total), 0),
    });
  }

  // Orders by origin
  const originCount: Record<string, number> = {};
  todayOrders.forEach((o) => {
    const origin = (o as { origin?: string }).origin ?? "SITE";
    originCount[origin] = (originCount[origin] || 0) + 1;
  });

  return {
    vendasHoje,
    pedidosHoje: allTodayOrders,
    ticketMedio,
    pedidosPendentes: pendingOrders,
    salesByDay,
    originCount,
  };
}

export async function getRecentOrders(limit = 20) {
  return db.order.findMany({
    where: { deletedAt: null },
    include: {
      items: {
        include: {
          product: { select: { name: true } },
        },
      },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getOrdersByStatus(statuses: string[]) {
  return db.order.findMany({
    where: {
      status: { in: statuses as any },
      deletedAt: null,
    },
    include: {
      items: {
        include: {
          product: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getAllOrders(filters?: {
  status?: string;
  origin?: string;
}) {
  const where: any = { deletedAt: null };
  if (filters?.status && filters.status !== "ALL") {
    where.status = filters.status;
  }
  if (filters?.origin && filters.origin !== "ALL") {
    where.origin = filters.origin;
  }

  return db.order.findMany({
    where,
    include: {
      items: {
        include: {
          product: { select: { name: true } },
        },
      },
      user: { select: { name: true, email: true } },
      payments: { select: { method: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}
