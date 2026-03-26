import { NextResponse } from "next/server";
import webpush from "web-push";
import { db } from "@/lib/db";

function getWebPush() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    throw new Error("VAPID keys not configured");
  }
  webpush.setVapidDetails("mailto:contato@botecoda-estacao.com.br", publicKey, privateKey);
  return webpush;
}

export async function POST(req: Request) {
  try {
    const { title, body, url } = await req.json();
    if (!title || !body) {
      return NextResponse.json({ error: "title and body required" }, { status: 400 });
    }

    const wp = getWebPush();

    const subscriptions = await db.$queryRawUnsafe<
      { id: string; endpoint: string; p256dh: string; auth: string }[]
    >(`SELECT id, endpoint, p256dh, auth FROM "PushSubscription"`);

    const payload = JSON.stringify({ title, body, url: url || "/" });
    let sent = 0;
    let failed = 0;

    for (const sub of subscriptions) {
      try {
        await wp.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload
        );
        sent++;
      } catch (error: any) {
        failed++;
        if (error.statusCode === 410 || error.statusCode === 404) {
          await db.$executeRawUnsafe(`DELETE FROM "PushSubscription" WHERE id = $1`, sub.id);
        }
      }
    }

    await db.$executeRawUnsafe(
      `INSERT INTO "PushNotification" (id, title, body, url, "totalSent", "createdAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())`,
      title,
      body,
      url || null,
      sent
    );

    return NextResponse.json({ ok: true, sent, failed, total: subscriptions.length });
  } catch (error) {
    console.error("[push/send] Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
