import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Salva subscription do browser pro push
export async function POST(req: Request) {
  try {
    const { subscription, userId } = await req.json();
    if (!subscription?.endpoint) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    await db.$executeRawUnsafe(
      `INSERT INTO "PushSubscription" (id, "userId", endpoint, p256dh, auth, "createdAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
       ON CONFLICT (endpoint) DO UPDATE SET p256dh = $3, auth = $4, "userId" = $1`,
      userId || null,
      subscription.endpoint,
      subscription.keys.p256dh,
      subscription.keys.auth
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[push/subscribe] Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
