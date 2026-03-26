-- 010: Tabelas para IA Analytics (Fase 3) e Marketing (Fase 4)

-- ============================================================
-- FASE 3: AI Insights + Alertas
-- ============================================================

CREATE TABLE "AiInsight" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "type" TEXT NOT NULL,        -- DAILY_SUMMARY, ANOMALY, FORECAST, PRODUCT_ANALYSIS, HEALTH_SCORE
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,     -- markdown
  "data" JSONB,                -- metricas brutas usadas pra gerar
  "status" TEXT NOT NULL DEFAULT 'NEW',  -- NEW, READ, DISMISSED
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "AiInsight_type_createdAt_idx" ON "AiInsight"("type", "createdAt" DESC);
CREATE INDEX "AiInsight_status_idx" ON "AiInsight"("status");

CREATE TABLE "AlertRule" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "metric" TEXT NOT NULL,       -- DAILY_REVENUE, ORDER_COUNT, CANCELLATION_RATE, AVG_TICKET
  "operator" TEXT NOT NULL,     -- LT, GT
  "threshold" DECIMAL(10,2) NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Alert" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "ruleId" TEXT NOT NULL REFERENCES "AlertRule"("id") ON DELETE CASCADE,
  "message" TEXT NOT NULL,
  "currentValue" DECIMAL(10,2),
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Alert_isRead_createdAt_idx" ON "Alert"("isRead", "createdAt" DESC);

-- ============================================================
-- FASE 4: Segmentacao + Campanhas + Cupons IA
-- ============================================================

CREATE TABLE "CustomerSegmentAssignment" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "segment" TEXT NOT NULL,      -- NEW, RECURRING, VIP, INACTIVE
  "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "CustomerSegmentAssignment_userId_key" ON "CustomerSegmentAssignment"("userId");
CREATE INDEX "CustomerSegmentAssignment_segment_idx" ON "CustomerSegmentAssignment"("segment");

CREATE TABLE "Campaign" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "targetSegment" TEXT NOT NULL,  -- ALL, NEW, RECURRING, VIP, INACTIVE
  "messageTemplate" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'DRAFT',  -- DRAFT, SCHEDULED, SENDING, SENT, CANCELLED
  "scheduledAt" TIMESTAMP(3),
  "sentAt" TIMESTAMP(3),
  "totalTargets" INTEGER NOT NULL DEFAULT 0,
  "totalDelivered" INTEGER NOT NULL DEFAULT 0,
  "totalRead" INTEGER NOT NULL DEFAULT 0,
  "createdBy" TEXT REFERENCES "User"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Campaign_status_idx" ON "Campaign"("status");

CREATE TABLE "CampaignMessage" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "campaignId" TEXT NOT NULL REFERENCES "Campaign"("id") ON DELETE CASCADE,
  "phone" TEXT NOT NULL,
  "userId" TEXT REFERENCES "User"("id"),
  "status" TEXT NOT NULL DEFAULT 'PENDING',  -- PENDING, SENT, DELIVERED, FAILED
  "sentAt" TIMESTAMP(3),
  "deliveredAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "CampaignMessage_campaignId_status_idx" ON "CampaignMessage"("campaignId", "status");

CREATE TABLE "AiCouponSuggestion" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "reason" TEXT NOT NULL,
  "couponType" TEXT NOT NULL,    -- PERCENTAGE, FIXED
  "suggestedValue" DECIMAL(10,2) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',  -- PENDING, APPROVED, REJECTED, EXPIRED
  "approvedCouponId" TEXT REFERENCES "Coupon"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "AiCouponSuggestion_status_idx" ON "AiCouponSuggestion"("status");
