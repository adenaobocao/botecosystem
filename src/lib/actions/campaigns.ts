"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSegmentCustomers, getAllCustomersWithPhone } from "@/lib/queries/marketing";
import { sendText, sendImage } from "@/lib/whatsapp/evolution";

export async function createCampaign(data: {
  name: string;
  targetSegment: string;
  messageTemplate: string;
  scheduledAt?: string;
  imageUrl?: string;
}) {
  const customers =
    data.targetSegment === "ALL"
      ? await getAllCustomersWithPhone()
      : await getSegmentCustomers(data.targetSegment);

  const status = data.scheduledAt ? "SCHEDULED" : "DRAFT";

  const [campaign] = await db.$queryRawUnsafe<{ id: string }[]>(
    `INSERT INTO "Campaign" (id, name, "targetSegment", "messageTemplate", status, "scheduledAt", "imageUrl", "totalTargets", "createdAt", "updatedAt")
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5::timestamp, $6, $7, NOW(), NOW())
     RETURNING id`,
    data.name,
    data.targetSegment,
    data.messageTemplate,
    status,
    data.scheduledAt || null,
    data.imageUrl || null,
    customers.length
  );

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
  await db.$executeRawUnsafe(
    `UPDATE "Campaign" SET status = 'SENDING', "updatedAt" = NOW() WHERE id = $1`,
    campaignId
  );

  const [campaign] = await db.$queryRawUnsafe<{ message_template: string; image_url: string | null }[]>(
    `SELECT "messageTemplate" as message_template, "imageUrl" as image_url FROM "Campaign" WHERE id = $1`,
    campaignId
  );
  if (!campaign) return;

  const messages = await db.$queryRawUnsafe<{ id: string; phone: string; name: string | null }[]>(
    `SELECT cm.id, cm.phone, u.name
     FROM "CampaignMessage" cm
     LEFT JOIN "User" u ON u.id = cm."userId"
     WHERE cm."campaignId" = $1 AND cm.status = 'PENDING'`,
    campaignId
  );

  let delivered = 0;

  for (const msg of messages) {
    try {
      const personalizedMsg = campaign.message_template.replace(
        /\{nome\}/gi,
        msg.name || "cliente"
      );

      // Se tem imagem, envia como imagem com caption. Senao, envia texto.
      if (campaign.image_url) {
        await sendImage(msg.phone, campaign.image_url, personalizedMsg);
      } else {
        await sendText(msg.phone, personalizedMsg);
      }

      await db.$executeRawUnsafe(
        `UPDATE "CampaignMessage" SET status = 'SENT', "sentAt" = NOW() WHERE id = $1`,
        msg.id
      );
      delivered++;

      await new Promise((r) => setTimeout(r, 2000));
    } catch (error) {
      console.error(`[campaign] Failed to send to ${msg.phone}:`, error);
      await db.$executeRawUnsafe(
        `UPDATE "CampaignMessage" SET status = 'FAILED' WHERE id = $1`,
        msg.id
      );
    }
  }

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
