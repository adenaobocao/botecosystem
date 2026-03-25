-- Migration 007: Tabela de mensagens WhatsApp pra dashboard
-- Roda no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS "WhatsAppMessage" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "phone" TEXT NOT NULL,
  "name" TEXT NOT NULL DEFAULT 'Cliente',
  "direction" TEXT NOT NULL DEFAULT 'IN', -- IN = recebida, OUT = enviada
  "text" TEXT NOT NULL,
  "orderId" TEXT REFERENCES "Order"("id") ON DELETE SET NULL,
  "needsAttention" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "WhatsAppMessage_phone_idx" ON "WhatsAppMessage"("phone");
CREATE INDEX IF NOT EXISTS "WhatsAppMessage_createdAt_idx" ON "WhatsAppMessage"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "WhatsAppMessage_needsAttention_idx" ON "WhatsAppMessage"("needsAttention") WHERE "needsAttention" = true;

-- Verificar
SELECT COUNT(*) as total FROM "WhatsAppMessage";
