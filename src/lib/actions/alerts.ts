"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createAlertRule(data: {
  metric: string;
  operator: string;
  threshold: number;
}) {
  await db.$executeRawUnsafe(
    `INSERT INTO "AlertRule" (id, metric, operator, threshold, "isActive", "createdAt")
     VALUES (gen_random_uuid(), $1, $2, $3, true, NOW())`,
    data.metric,
    data.operator,
    data.threshold
  );
  revalidatePath("/dashboard/inteligencia/alertas");
}

export async function deleteAlertRule(id: string) {
  await db.$executeRawUnsafe(`DELETE FROM "AlertRule" WHERE id = $1`, id);
  revalidatePath("/dashboard/inteligencia/alertas");
}

export async function toggleAlertRule(id: string, isActive: boolean) {
  await db.$executeRawUnsafe(
    `UPDATE "AlertRule" SET "isActive" = $1 WHERE id = $2`,
    isActive,
    id
  );
  revalidatePath("/dashboard/inteligencia/alertas");
}

export async function markAlertRead(id: string) {
  await db.$executeRawUnsafe(
    `UPDATE "Alert" SET "isRead" = true WHERE id = $1`,
    id
  );
  revalidatePath("/dashboard/inteligencia/alertas");
}

export async function markAllAlertsRead() {
  await db.$executeRawUnsafe(`UPDATE "Alert" SET "isRead" = true WHERE "isRead" = false`);
  revalidatePath("/dashboard/inteligencia/alertas");
}
