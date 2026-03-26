import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendCampaignNow } from "@/lib/actions/campaigns";

// Vercel Cron — roda a cada 5min
// Checa campanhas agendadas cujo scheduledAt ja passou

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const campaigns = await db.$queryRawUnsafe<{ id: string }[]>(
      `SELECT id FROM "Campaign"
       WHERE status = 'SCHEDULED' AND "scheduledAt" <= NOW()`
    );

    for (const campaign of campaigns) {
      await sendCampaignNow(campaign.id);
    }

    return NextResponse.json({ ok: true, sent: campaigns.length });
  } catch (error) {
    console.error("[cron/campaigns] Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
