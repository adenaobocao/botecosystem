-- Migration 009: Mesa Especial (reservas)
-- Roda no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS "Reservation" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "userName" TEXT NOT NULL,                     -- nome de quem reservou
  "userPhone" TEXT NOT NULL,                    -- telefone
  "date" DATE NOT NULL,                         -- data da reserva
  "time" TEXT NOT NULL DEFAULT '20:00',         -- horario desejado
  "partySize" INTEGER NOT NULL DEFAULT 2,       -- qtd de pessoas
  "tableId" TEXT NOT NULL DEFAULT 'sofa-vip',   -- qual mesa (futuro: multiplas)
  "status" TEXT NOT NULL DEFAULT 'PENDING',     -- PENDING, APPROVED, REJECTED, CANCELLED
  "notes" TEXT,                                  -- observacao do cliente
  "adminNotes" TEXT,                             -- observacao do admin
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "Reservation_date_idx" ON "Reservation"("date" DESC);
CREATE INDEX IF NOT EXISTS "Reservation_status_idx" ON "Reservation"("status");
CREATE INDEX IF NOT EXISTS "Reservation_userId_idx" ON "Reservation"("userId");
CREATE INDEX IF NOT EXISTS "Reservation_tableId_date_idx" ON "Reservation"("tableId", "date");

-- Verificar
SELECT * FROM "Reservation" LIMIT 5;
