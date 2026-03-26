import { db } from "@/lib/db";

export async function getAlertRules() {
  const rows = await db.$queryRawUnsafe<
    {
      id: string;
      metric: string;
      operator: string;
      threshold: number;
      isActive: boolean;
      createdAt: string;
    }[]
  >(
    `SELECT id, metric, operator, threshold::float, "isActive", "createdAt"::text
     FROM "AlertRule"
     ORDER BY "createdAt" DESC`
  );
  return rows;
}

export async function getActiveAlertRules() {
  const rows = await db.$queryRawUnsafe<
    { id: string; metric: string; operator: string; threshold: number }[]
  >(
    `SELECT id, metric, operator, threshold::float
     FROM "AlertRule"
     WHERE "isActive" = true`
  );
  return rows;
}

export async function getRecentAlerts(limit: number = 20) {
  const rows = await db.$queryRawUnsafe<
    {
      id: string;
      rule_id: string;
      metric: string;
      operator: string;
      threshold: number;
      message: string;
      current_value: number;
      is_read: boolean;
      created_at: string;
    }[]
  >(
    `SELECT a.id, a."ruleId" as rule_id, r.metric, r.operator, r.threshold::float,
            a.message, a."currentValue"::float as current_value, a."isRead" as is_read,
            a."createdAt"::text as created_at
     FROM "Alert" a
     JOIN "AlertRule" r ON r.id = a."ruleId"
     ORDER BY a."createdAt" DESC
     LIMIT $1`,
    limit
  );
  return rows;
}

export async function getUnreadAlertCount() {
  const [result] = await db.$queryRawUnsafe<{ count: number }[]>(
    `SELECT COUNT(*)::int as count FROM "Alert" WHERE "isRead" = false`
  );
  return result?.count ?? 0;
}
