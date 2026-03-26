"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSegmentCustomers, getAllCustomersWithPhone } from "@/lib/queries/marketing";
import { sendText } from "@/lib/whatsapp/evolution";

export async function createCampaign(data: {
  name: string;
  targetSegment: string;
  messageTemplate: string;
  scheduledAt?: string;
}) {
  // Busca alvos
  const customers =
    data.targetSegment === "ALL"
      ? await getAllCustomersWithPhone()
      : await getSegmentCustomers(data.targetSegment);

  const status = data.scheduledAt ? "SCHEDULED" : "DRAFT";

  // Cria campanha
  const [campaign] = await db.$queryRawUnsafe<{ id: string }[]>(
    `INSERT INTO "Campaign" (id, name, "targetSegment", "messageTemplate", status, "scheduledAt", "totalTargets", "createdAt", "updatedAt")
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5::timestamp, $6, NOW(), NOW())
     RETURNING id`,
    data.name,
    data.targetSegment,
    data.messageTemplate,
    status,
    data.scheduledAt || null,
    customers.length
  );

  // Cria mensagens individuais
  for (const c of customers) {
    await db.$executeRawUnsafe(
      `INSERT INTO "CampaignMessage" (id, "campaignId", phone, "userId", status, "createdAt")
       VALUES (gen_random_uuid(), $1, $2, $3, 'PENDING', NOW())`,
      campaign.id,
      c.phone,
      c.user_id
    );
  }

  revalidatePath("/dashboard/marketing");
  revalidatePath("/dashboard/marketing/campanhas");
  return { id: campaign.id, totalTargets: customers.length };
}

export async function sendCampaignNow(campaignId: string) {
  // Marca como enviando
  await db.$executeRawUnsafe(
    `UPDATE "Campaign" SET status = 'SENDING', "updatedAt" = NOW() WHERE id = $1`,
    campaignId
  );

  // Busca template
  const [campaign] = await db.$queryRawUnsafe<{ message_template: string }[]>(
    `SELECT "messageTemplate" as message_template FROM "Campaign" WHERE id = $1`,
    campaignId
  );
  if (!campaign) return;

  // Busca mensagens pendentes
  const messages = await db.$queryRawUnsafe<{ id: string; phone: string }[]>(
    `SELECT id, phone FROM "CampaignMessage" WHERE "campaignId" = $1 AND status = 'PENDING'`,
    campaignId
  );

  let delivered = 0;

  for (const msg of messages) {
    try {
      await sendText(msg.phone, campaign.message_template);
      await db.$executeRawUnsafe(
        `UPDATE "CampaignMessage" SET status = 'SENT', "sentAt" = NOW() WHERE id = $1`,
        msg.id
      );
      delivered++;

      // Rate limit: 2s entre msgs (max ~30/min, evita ban WhatsApp)
      await new Promise((r) => setTimeout(r, 2000));
    } catch (error) {
      console.error(`[campaign] Failed to send to ${msg.phone}:`, error);
      await db.$executeRawUnsafe(
        `UPDATE "CampaignMessage" SET status = 'FAILED' WHERE id = $1`,
        msg.id
      );
    }
  }

  // Finaliza campanha
  await db.$executeRawUnsafe(
    `UPDATE "Campaign" SET status = 'SENT', "sentAt" = NOW(), "totalDelivered" = $1, "updatedAt" = NOW() WHERE id = $2`,
    delivered,
    campaignId
  );

  revalidatePath("/dashboard/marketing");
  revalidatePath("/dashboard/marketing/campanhas");
}

export async function cancelCampaign(campaignId: string) {
  await db.$executeRawUnsafe(
    `UPDATE "Campaign" SET status = 'CANCELLED', "updatedAt" = NOW() WHERE id = $1`,
    campaignId
  );
  revalidatePath("/dashboard/marketing");
  revalidatePath("/dashboard/marketing/campanhas");
}
