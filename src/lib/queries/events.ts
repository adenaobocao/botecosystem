import { db } from "@/lib/db";

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  artistName: string | null;
  artistImage: string | null;
  date: Date;
  startTime: string;
  endTime: string | null;
  coverCharge: number;
  isCoverFree: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Proximos eventos (a partir de hoje)
export async function getUpcomingEvents(limit = 14): Promise<EventRow[]> {
  try {
    const events = await db.$queryRawUnsafe<EventRow[]>(
      `SELECT * FROM "Event"
       WHERE "isActive" = true AND "date" >= CURRENT_DATE
       ORDER BY "date" ASC
       LIMIT $1`,
      limit
    );
    return events;
  } catch {
    return [];
  }
}

// Evento de hoje
export async function getTodayEvent(): Promise<EventRow | null> {
  try {
    const events = await db.$queryRawUnsafe<EventRow[]>(
      `SELECT * FROM "Event"
       WHERE "isActive" = true AND "date" = CURRENT_DATE
       LIMIT 1`
    );
    return events[0] || null;
  } catch {
    return null;
  }
}

// Todos os eventos (pra dashboard)
export async function getAllEvents(limit = 50): Promise<EventRow[]> {
  try {
    const events = await db.$queryRawUnsafe<EventRow[]>(
      `SELECT * FROM "Event" ORDER BY "date" DESC LIMIT $1`,
      limit
    );
    return events;
  } catch {
    return [];
  }
}
