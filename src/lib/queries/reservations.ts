import { db } from "@/lib/db";

export interface ReservationRow {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  date: Date;
  time: string;
  partySize: number;
  tableId: string;
  status: string; // PENDING | APPROVED | REJECTED | CANCELLED
  notes: string | null;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Verificar se mesa esta disponivel em uma data
export async function getReservationsForDate(
  date: string,
  tableId = "sofa-vip"
): Promise<ReservationRow[]> {
  try {
    return await db.$queryRawUnsafe<ReservationRow[]>(
      `SELECT * FROM "Reservation"
       WHERE "tableId" = $1 AND "date" = $2::date AND "status" IN ('PENDING', 'APPROVED')
       ORDER BY "time" ASC`,
      tableId,
      date
    );
  } catch {
    return [];
  }
}

// Status da mesa hoje
export async function getTableStatusToday(
  tableId = "sofa-vip"
): Promise<{ available: boolean; reservation: ReservationRow | null }> {
  try {
    const rows = await db.$queryRawUnsafe<ReservationRow[]>(
      `SELECT * FROM "Reservation"
       WHERE "tableId" = $1 AND "date" = CURRENT_DATE AND "status" = 'APPROVED'
       LIMIT 1`,
      tableId
    );
    if (rows.length > 0) {
      return { available: false, reservation: rows[0] };
    }
    // Verifica pendentes
    const pending = await db.$queryRawUnsafe<ReservationRow[]>(
      `SELECT * FROM "Reservation"
       WHERE "tableId" = $1 AND "date" = CURRENT_DATE AND "status" = 'PENDING'
       LIMIT 1`,
      tableId
    );
    if (pending.length > 0) {
      return { available: false, reservation: pending[0] };
    }
    return { available: true, reservation: null };
  } catch {
    return { available: true, reservation: null };
  }
}

// Todas as reservas (dashboard)
export async function getAllReservations(limit = 50): Promise<ReservationRow[]> {
  try {
    return await db.$queryRawUnsafe<ReservationRow[]>(
      `SELECT * FROM "Reservation" ORDER BY "date" DESC, "createdAt" DESC LIMIT $1`,
      limit
    );
  } catch {
    return [];
  }
}

// Reservas do usuario
export async function getUserReservations(userId: string): Promise<ReservationRow[]> {
  try {
    return await db.$queryRawUnsafe<ReservationRow[]>(
      `SELECT * FROM "Reservation" WHERE "userId" = $1 ORDER BY "date" DESC LIMIT 20`,
      userId
    );
  } catch {
    return [];
  }
}

// Proximas datas disponiveis (sem reserva aprovada)
export async function getAvailableDates(
  tableId = "sofa-vip",
  days = 14
): Promise<string[]> {
  try {
    const reserved = await db.$queryRawUnsafe<{ date: Date }[]>(
      `SELECT DISTINCT "date" FROM "Reservation"
       WHERE "tableId" = $1 AND "date" >= CURRENT_DATE AND "date" <= CURRENT_DATE + $2
       AND "status" IN ('APPROVED')`,
      tableId,
      days
    );
    const reservedDates = new Set(
      reserved.map((r) => new Date(r.date).toISOString().slice(0, 10))
    );

    const available: string[] = [];
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      if (!reservedDates.has(key)) {
        available.push(key);
      }
    }
    return available;
  } catch {
    return [];
  }
}
