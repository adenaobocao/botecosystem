"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

interface CreateReservationData {
  date: string; // YYYY-MM-DD
  time: string;
  partySize: number;
  notes?: string;
  tableId?: string;
}

export async function createReservation(data: CreateReservationData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Faca login para reservar");
  }

  // Verificar se ja tem reserva aprovada nessa data
  const existing = await db.$queryRawUnsafe<{ id: string }[]>(
    `SELECT id FROM "Reservation"
     WHERE "tableId" = $1 AND "date" = $2::date AND "status" = 'APPROVED'
     LIMIT 1`,
    data.tableId || "sofa-vip",
    data.date
  );

  if (existing.length > 0) {
    throw new Error("Esta mesa ja esta reservada para esta data");
  }

  await db.$queryRawUnsafe(
    `INSERT INTO "Reservation" (id, "userId", "userName", "userPhone", "date", "time", "partySize", "tableId", "status", "notes", "createdAt", "updatedAt")
     VALUES (gen_random_uuid(), $1, $2, $3, $4::date, $5, $6, $7, 'PENDING', $8, NOW(), NOW())`,
    session.user.id,
    session.user.name || "Sem nome",
    (session.user as { phone?: string }).phone || "",
    data.date,
    data.time,
    data.partySize,
    data.tableId || "sofa-vip",
    data.notes || null
  );

  revalidatePath("/");
  revalidatePath("/dashboard/reservas");
}

export async function updateReservationStatus(
  id: string,
  status: "APPROVED" | "REJECTED" | "CANCELLED",
  adminNotes?: string
) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "MANAGER"].includes((session.user as { role?: string }).role || "")) {
    throw new Error("Nao autorizado");
  }

  await db.$queryRawUnsafe(
    `UPDATE "Reservation" SET "status" = $1, "adminNotes" = $2, "updatedAt" = NOW() WHERE id = $3`,
    status,
    adminNotes || null,
    id
  );

  revalidatePath("/");
  revalidatePath("/dashboard/reservas");
}

export async function cancelReservation(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Nao autorizado");
  }

  // Usuario so pode cancelar a propria reserva
  const rows = await db.$queryRawUnsafe<{ userId: string }[]>(
    `SELECT "userId" FROM "Reservation" WHERE id = $1`,
    id
  );

  const isAdmin = ["ADMIN", "MANAGER"].includes((session.user as { role?: string }).role || "");
  if (rows.length === 0 || (rows[0].userId !== session.user.id && !isAdmin)) {
    throw new Error("Nao autorizado");
  }

  await db.$queryRawUnsafe(
    `UPDATE "Reservation" SET "status" = 'CANCELLED', "updatedAt" = NOW() WHERE id = $1`,
    id
  );

  revalidatePath("/");
  revalidatePath("/dashboard/reservas");
}

export async function deleteReservation(id: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "MANAGER"].includes((session.user as { role?: string }).role || "")) {
    throw new Error("Nao autorizado");
  }

  await db.$queryRawUnsafe(`DELETE FROM "Reservation" WHERE id = $1`, id);

  revalidatePath("/");
  revalidatePath("/dashboard/reservas");
}
