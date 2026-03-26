import { db } from "@/lib/db";

// Faturamento por dia (periodo flexivel)
export async function getRevenueOverTime(days: 7 | 30 | 90 = 7) {
  const rows = await db.$queryRawUnsafe<{ date: string; total: number }[]>(
    `SELECT
       TO_CHAR("createdAt"::date, 'YYYY-MM-DD') as date,
       COALESCE(SUM(total), 0)::float as total
     FROM "Order"
     WHERE "deletedAt" IS NULL
       AND status != 'CANCELLED'
       AND "createdAt" >= NOW() - INTERVAL '${days} days'
     GROUP BY "createdAt"::date
     ORDER BY "createdAt"::date`
  );
  return rows;
}

// Top produtos por quantidade e receita
export async function getTopProducts(days: number = 30, limit: number = 10) {
  const rows = await db.$queryRawUnsafe<
    { name: string; quantity: number; revenue: number }[]
  >(
    `SELECT
       p.name,
       SUM(oi.quantity)::int as quantity,
       SUM(oi."totalPrice")::float as revenue
     FROM "OrderItem" oi
     JOIN "Product" p ON p.id = oi."productId"
     JOIN "Order" o ON o.id = oi."orderId"
     WHERE o."deletedAt" IS NULL
       AND o.status != 'CANCELLED'
       AND o."createdAt" >= NOW() - INTERVAL '${days} days'
     GROUP BY p.id, p.name
     ORDER BY quantity DESC
     LIMIT $1`,
    limit
  );
  return rows;
}

// Heatmap horarios de pico (hora x dia da semana)
export async function getPeakHoursData(days: number = 30) {
  const rows = await db.$queryRawUnsafe<
    { day_of_week: number; hour: number; order_count: number }[]
  >(
    `SELECT
       EXTRACT(DOW FROM "createdAt") as day_of_week,
       EXTRACT(HOUR FROM "createdAt") as hour,
       COUNT(*)::int as order_count
     FROM "Order"
     WHERE "deletedAt" IS NULL
       AND status != 'CANCELLED'
       AND "createdAt" >= NOW() - INTERVAL '${days} days'
     GROUP BY day_of_week, hour
     ORDER BY day_of_week, hour`
  );
  return rows;
}

// Trend de ticket medio
export async function getTicketTrend(days: number = 30) {
  const rows = await db.$queryRawUnsafe<
    { date: string; avg_ticket: number; order_count: number }[]
  >(
    `SELECT
       TO_CHAR("createdAt"::date, 'YYYY-MM-DD') as date,
       AVG(total)::float as avg_ticket,
       COUNT(*)::int as order_count
     FROM "Order"
     WHERE "deletedAt" IS NULL
       AND status != 'CANCELLED'
       AND "createdAt" >= NOW() - INTERVAL '${days} days'
     GROUP BY "createdAt"::date
     ORDER BY "createdAt"::date`
  );
  return rows;
}

// Metricas de clientes (recorrencia)
export async function getCustomerMetrics() {
  const [result] = await db.$queryRawUnsafe<
    {
      total_customers: number;
      new_this_month: number;
      recurring: number;
      with_orders: number;
    }[]
  >(
    `SELECT
       COUNT(DISTINCT u.id)::int as total_customers,
       COUNT(DISTINCT CASE WHEN u."createdAt" >= DATE_TRUNC('month', NOW()) THEN u.id END)::int as new_this_month,
       COUNT(DISTINCT CASE WHEN sub.order_count >= 2 THEN sub."userId" END)::int as recurring,
       COUNT(DISTINCT sub."userId")::int as with_orders
     FROM "User" u
     LEFT JOIN (
       SELECT "userId", COUNT(*)::int as order_count
       FROM "Order"
       WHERE "deletedAt" IS NULL AND status != 'CANCELLED'
       GROUP BY "userId"
     ) sub ON sub."userId" = u.id
     WHERE u.role = 'CUSTOMER' AND u."deletedAt" IS NULL`
  );
  return {
    totalCustomers: result.total_customers,
    newThisMonth: result.new_this_month,
    recurring: result.recurring,
    withOrders: result.with_orders,
    churnRate:
      result.with_orders > 0
        ? ((result.with_orders - result.recurring) / result.with_orders) * 100
        : 0,
  };
}

// Trend de origem dos pedidos
export async function getOriginTrend(days: number = 30) {
  const rows = await db.$queryRawUnsafe<
    { date: string; origin: string; count: number }[]
  >(
    `SELECT
       TO_CHAR("createdAt"::date, 'YYYY-MM-DD') as date,
       origin::text,
       COUNT(*)::int as count
     FROM "Order"
     WHERE "deletedAt" IS NULL
       AND status != 'CANCELLED'
       AND "createdAt" >= NOW() - INTERVAL '${days} days'
     GROUP BY "createdAt"::date, origin
     ORDER BY "createdAt"::date`
  );
  return rows;
}

// Taxa de cancelamento
export async function getCancellationRate(days: number = 30) {
  const rows = await db.$queryRawUnsafe<
    { date: string; total: number; cancelled: number; rate: number }[]
  >(
    `SELECT
       TO_CHAR("createdAt"::date, 'YYYY-MM-DD') as date,
       COUNT(*)::int as total,
       COUNT(CASE WHEN status = 'CANCELLED' THEN 1 END)::int as cancelled,
       CASE WHEN COUNT(*) > 0
         THEN (COUNT(CASE WHEN status = 'CANCELLED' THEN 1 END)::float / COUNT(*) * 100)
         ELSE 0
       END as rate
     FROM "Order"
     WHERE "deletedAt" IS NULL
       AND "createdAt" >= NOW() - INTERVAL '${days} days'
     GROUP BY "createdAt"::date
     ORDER BY "createdAt"::date`
  );
  return rows;
}

// KPIs do periodo (generico)
export async function getPeriodKpis(days: number = 7) {
  const [result] = await db.$queryRawUnsafe<
    {
      revenue: number;
      orders: number;
      avg_ticket: number;
      cancelled: number;
      total_with_cancelled: number;
    }[]
  >(
    `SELECT
       COALESCE(SUM(CASE WHEN status != 'CANCELLED' THEN total ELSE 0 END), 0)::float as revenue,
       COUNT(CASE WHEN status != 'CANCELLED' THEN 1 END)::int as orders,
       CASE WHEN COUNT(CASE WHEN status != 'CANCELLED' THEN 1 END) > 0
         THEN (SUM(CASE WHEN status != 'CANCELLED' THEN total ELSE 0 END) / COUNT(CASE WHEN status != 'CANCELLED' THEN 1 END))::float
         ELSE 0
       END as avg_ticket,
       COUNT(CASE WHEN status = 'CANCELLED' THEN 1 END)::int as cancelled,
       COUNT(*)::int as total_with_cancelled
     FROM "Order"
     WHERE "deletedAt" IS NULL
       AND "createdAt" >= NOW() - INTERVAL '${days} days'`
  );
  return {
    revenue: result.revenue,
    orders: result.orders,
    avgTicket: result.avg_ticket,
    cancelled: result.cancelled,
    cancellationRate:
      result.total_with_cancelled > 0
        ? (result.cancelled / result.total_with_cancelled) * 100
        : 0,
  };
}

// Dados pra insight de produto (AI)
export async function getProductPerformance(days: number = 7) {
  return getTopProducts(days, 20);
}

// Dados de segmentacao de clientes
export async function getCustomerSegmentData() {
  const rows = await db.$queryRawUnsafe<
    {
      user_id: string;
      name: string;
      phone: string;
      order_count: number;
      total_spent: number;
      last_order_date: string | null;
      days_since_last: number | null;
      avg_ticket: number;
    }[]
  >(
    `SELECT
       u.id as user_id,
       u.name,
       u.phone,
       COUNT(o.id)::int as order_count,
       COALESCE(SUM(o.total), 0)::float as total_spent,
       MAX(o."createdAt")::text as last_order_date,
       EXTRACT(DAY FROM NOW() - MAX(o."createdAt"))::int as days_since_last,
       CASE WHEN COUNT(o.id) > 0 THEN (SUM(o.total) / COUNT(o.id))::float ELSE 0 END as avg_ticket
     FROM "User" u
     LEFT JOIN "Order" o ON o."userId" = u.id AND o."deletedAt" IS NULL AND o.status != 'CANCELLED'
     WHERE u.role = 'CUSTOMER' AND u."deletedAt" IS NULL
     GROUP BY u.id, u.name, u.phone
     HAVING COUNT(o.id) > 0
     ORDER BY total_spent DESC`
  );
  return rows;
}

// Historico por dia da semana (pra forecast)
export async function getWeekdayHistory() {
  const diasSemana = ["Domingo", "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado"];
  const rows = await db.$queryRawUnsafe<
    { day_of_week: number; avg_revenue: number; avg_orders: number }[]
  >(
    `SELECT
       EXTRACT(DOW FROM "createdAt") as day_of_week,
       AVG(daily.total)::float as avg_revenue,
       AVG(daily.cnt)::float as avg_orders
     FROM (
       SELECT "createdAt"::date as dt, SUM(total)::float as total, COUNT(*)::int as cnt
       FROM "Order"
       WHERE "deletedAt" IS NULL AND status != 'CANCELLED' AND "createdAt" >= NOW() - INTERVAL '30 days'
       GROUP BY "createdAt"::date
     ) daily
     CROSS JOIN LATERAL (SELECT EXTRACT(DOW FROM daily.dt) as dow) d
     GROUP BY day_of_week
     ORDER BY day_of_week`
  );

  // Top produto por dia da semana
  const topByDay = await db.$queryRawUnsafe<
    { day_of_week: number; product_name: string }[]
  >(
    `SELECT DISTINCT ON (dow)
       EXTRACT(DOW FROM o."createdAt") as dow,
       p.name as product_name
     FROM "OrderItem" oi
     JOIN "Order" o ON o.id = oi."orderId"
     JOIN "Product" p ON p.id = oi."productId"
     WHERE o."deletedAt" IS NULL AND o.status != 'CANCELLED' AND o."createdAt" >= NOW() - INTERVAL '30 days'
     GROUP BY dow, p.name
     ORDER BY dow, SUM(oi.quantity) DESC`
  );

  return rows.map((r) => ({
    dayOfWeek: diasSemana[r.day_of_week] || "?",
    avgRevenue: r.avg_revenue,
    avgOrders: r.avg_orders,
    topProduct: topByDay.find((t) => t.day_of_week === r.day_of_week)?.product_name || "-",
  }));
}

// Dados de origem (contagem simples pro periodo)
export async function getOriginBreakdown(days: number = 7) {
  const rows = await db.$queryRawUnsafe<{ origin: string; count: number }[]>(
    `SELECT origin::text, COUNT(*)::int as count
     FROM "Order"
     WHERE "deletedAt" IS NULL AND status != 'CANCELLED'
       AND "createdAt" >= NOW() - INTERVAL '${days} days'
     GROUP BY origin
     ORDER BY count DESC`
  );
  return rows;
}
