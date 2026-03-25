"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

interface EventData {
  title: string;
  description?: string;
  artistName?: string;
  artistImage?: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime?: string;
  coverCharge: number;
  isCoverFree: boolean;
}

export async function createEvent(data: EventData) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "MANAGER"].includes(session.user.role)) {
    throw new Error("Nao autorizado");
  }

  await db.$executeRawUnsafe(
    `INSERT INTO "Event" (id, title, description, "artistName", "artistImage", date, "startTime", "endTime", "coverCharge", "isCoverFree", "isActive", "createdAt", "updatedAt")
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5::date, $6, $7, $8, $9, true, NOW(), NOW())`,
    data.title,
    data.description || null,
    data.artistName || null,
    data.artistImage || null,
    data.date,
    data.startTime,
    data.endTime || null,
    data.coverCharge,
    data.isCoverFree
  );

  revalidatePath("/");
  revalidatePath("/dashboard/agenda");
}

export async function updateEvent(id: string, data: EventData) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "MANAGER"].includes(session.user.role)) {
    throw new Error("Nao autorizado");
  }

  await db.$executeRawUnsafe(
    `UPDATE "Event" SET
      title = $1, description = $2, "artistName" = $3, "artistImage" = $4,
      date = $5::date, "startTime" = $6, "endTime" = $7,
      "coverCharge" = $8, "isCoverFree" = $9, "updatedAt" = NOW()
     WHERE id = $10`,
    data.title,
    data.description || null,
    data.artistName || null,
    data.artistImage || null,
    data.date,
    data.startTime,
    data.endTime || null,
    data.coverCharge,
    data.isCoverFree,
    id
  );

  revalidatePath("/");
  revalidatePath("/dashboard/agenda");
}

export async function toggleEventActive(id: string, isActive: boolean) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "MANAGER"].includes(session.user.role)) {
    throw new Error("Nao autorizado");
  }

  await db.$executeRawUnsafe(
    `UPDATE "Event" SET "isActive" = $1, "updatedAt" = NOW() WHERE id = $2`,
    isActive,
    id
  );

  revalidatePath("/");
  revalidatePath("/dashboard/agenda");
}

export async function deleteEvent(id: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "MANAGER"].includes(session.user.role)) {
    throw new Error("Nao autorizado");
  }

  await db.$executeRawUnsafe(`DELETE FROM "Event" WHERE id = $1`, id);

  revalidatePath("/");
  revalidatePath("/dashboard/agenda");
}
