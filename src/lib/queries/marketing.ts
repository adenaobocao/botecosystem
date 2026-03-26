import { db } from "@/lib/db";

// Contagem por segmento
export async function getSegmentCounts() {
  const rows = await db.$queryRawUnsafe<{ segment: string; count: number }[]>(
    `SELECT segment, COUNT(*)::int as count
     FROM "CustomerSegmentAssignment"
     GROUP BY segment
     ORDER BY count DESC`
  );
  return rows;
}

// Clientes de um segmento (com telefone, pra campanhas)
export async function getSegmentCustomers(segment: string) {
  const rows = await db.$queryRawUnsafe<
    { user_id: string; name: string; phone: string }[]
  >(
    `SELECT cs."userId" as user_id, u.name, u.phone
     FROM "CustomerSegmentAssignment" cs
     JOIN "User" u ON u.id = cs."userId"
     WHERE cs.segment = $1 AND u.phone IS NOT NULL AND u.phone != ''
     ORDER BY u.name`,
    segment
  );
  return rows;
}

// Todos os clientes com telefone (pra campanha ALL)
export async function getAllCustomersWithPhone() {
  const rows = await db.$queryRawUnsafe<
    { user_id: string; name: string; phone: string }[]
  >(
    `SELECT id as user_id, name, phone
     FROM "User"
     WHERE role = 'CUSTOMER' AND "deletedAt" IS NULL
       AND phone IS NOT NULL AND phone != ''
     ORDER BY name`
  );
  return rows;
}

// Lista de campanhas
export async function getCampaigns(limit: number = 50) {
  const rows = await db.$queryRawUnsafe<
    {
      id: string;
      name: string;
      target_segment: string;
      message_template: string;
      status: string;
      scheduled_at: string | null;
      sent_at: string | null;
      total_targets: number;
      total_delivered: number;
      created_at: string;
    }[]
  >(
    `SELECT id, name, "targetSegment" as target_segment, "messageTemplate" as message_template,
            status, "scheduledAt"::text as scheduled_at, "sentAt"::text as sent_at,
            "totalTargets" as total_targets, "totalDelivered" as total_delivered,
            "createdAt"::text as created_at
     FROM "Campaign"
     ORDER BY "createdAt" DESC
     LIMIT $1`,
    limit
  );
  return rows;
}

// Detalhe de uma campanha
export async function getCampaignDetail(campaignId: string) {
  const [campaign] = await db.$queryRawUnsafe<
    {
      id: string;
      name: string;
      target_segment: string;
      message_template: string;
      status: string;
      scheduled_at: string | null;
      sent_at: string | null;
      total_targets: number;
      total_delivered: number;
      created_at: string;
    }[]
  >(
    `SELECT id, name, "targetSegment" as target_segment, "messageTemplate" as message_template,
            status, "scheduledAt"::text as scheduled_at, "sentAt"::text as sent_at,
            "totalTargets" as total_targets, "totalDelivered" as total_delivered,
            "createdAt"::text as created_at
     FROM "Campaign"
     WHERE id = $1`,
    campaignId
  );
  if (!campaign) return null;

  const messages = await db.$queryRawUnsafe<
    { id: string; phone: string; status: string; sent_at: string | null }[]
  >(
    `SELECT id, phone, status, "sentAt"::text as sent_at
     FROM "CampaignMessage"
     WHERE "campaignId" = $1
     ORDER BY "createdAt"`,
    campaignId
  );

  return { ...campaign, messages };
}

// Sugestoes de cupons IA
export async function getCouponSuggestions(status: string = "PENDING") {
  const rows = await db.$queryRawUnsafe<
    {
      id: string;
      user_id: string;
      user_name: string;
      phone: string;
      reason: string;
      coupon_type: string;
      suggested_value: number;
      status: string;
      created_at: string;
    }[]
  >(
    `SELECT cs.id, cs."userId" as user_id, u.name as user_name, u.phone,
            cs.reason, cs."couponType" as coupon_type, cs."suggestedValue"::float as suggested_value,
            cs.status, cs."createdAt"::text as created_at
     FROM "AiCouponSuggestion" cs
     JOIN "User" u ON u.id = cs."userId"
     WHERE cs.status = $1
     ORDER BY cs."createdAt" DESC`,
    status
  );
  return rows;
}

// Insights recentes
export async function getRecentInsights(limit: number = 10) {
  const rows = await db.$queryRawUnsafe<
    {
      id: string;
      type: string;
      title: string;
      content: string;
      status: string;
      created_at: string;
    }[]
  >(
    `SELECT id, type, title, content, status, "createdAt"::text as created_at
     FROM "AiInsight"
     WHERE status != 'DISMISSED'
     ORDER BY "createdAt" DESC
     LIMIT $1`,
    limit
  );
  return rows;
}
