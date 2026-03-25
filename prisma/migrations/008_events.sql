-- Migration 008: Tabela de eventos/agenda
-- Roda no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS "Event" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "title" TEXT NOT NULL,                    -- "Roda de Samba", "Banda X"
  "description" TEXT,                        -- descricao opcional
  "artistName" TEXT,                         -- nome da banda/artista
  "artistImage" TEXT,                        -- URL da foto
  "date" DATE NOT NULL,                      -- data do evento
  "startTime" TEXT NOT NULL DEFAULT '20:00', -- hora inicio "20:00"
  "endTime" TEXT,                            -- hora fim "23:00"
  "coverCharge" DECIMAL(10,2) DEFAULT 0,    -- valor do cover (0 = free)
  "isCoverFree" BOOLEAN NOT NULL DEFAULT true,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "Event_date_idx" ON "Event"("date" DESC);
CREATE INDEX IF NOT EXISTS "Event_isActive_date_idx" ON "Event"("isActive", "date");

-- Seed: proximas semanas de exemplo
INSERT INTO "Event" ("title", "artistName", "date", "startTime", "isCoverFree", "coverCharge") VALUES
  ('Roda de Samba', 'Grupo Raiz', CURRENT_DATE + (((1 + 7 - EXTRACT(DOW FROM CURRENT_DATE)::int) % 7) || ' days')::interval, '20:00', true, 0),
  ('Sexta Acustica', NULL, CURRENT_DATE + (((5 + 7 - EXTRACT(DOW FROM CURRENT_DATE)::int) % 7) || ' days')::interval, '21:00', true, 0),
  ('Sabadao Sertanejo', 'Duo Estacao', CURRENT_DATE + (((6 + 7 - EXTRACT(DOW FROM CURRENT_DATE)::int) % 7) || ' days')::interval, '21:00', false, 15.00);

-- Verificar
SELECT * FROM "Event" ORDER BY "date";
