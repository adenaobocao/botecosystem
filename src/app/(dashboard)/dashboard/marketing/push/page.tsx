import { Metadata } from "next";
import { db } from "@/lib/db";
import { PushSender } from "@/components/dashboard/marketing/push-sender";
import Link from "next/link";

export const metadata: Metadata = { title: "Push Notifications | Marketing" };
export const dynamic = "force-dynamic";

async function getSubscriberCount() {
  try {
    const [result] = await db.$queryRawUnsafe<{ count: number }[]>(
      `SELECT COUNT(*)::int as count FROM "PushSubscription"`
    );
    return result?.count ?? 0;
  } catch {
    return 0;
  }
}

async function getPushHistory() {
  try {
    const rows = await db.$queryRawUnsafe<
      { title: string; body: string; totalSent: number; createdAt: string }[]
    >(
      `SELECT title, body, "totalSent", "createdAt"::text as "createdAt"
       FROM "PushNotification"
       ORDER BY "createdAt" DESC
       LIMIT 20`
    );
    return rows;
  } catch {
    return [];
  }
}

export default async function PushPage() {
  const [subscriberCount, history] = await Promise.all([
    getSubscriberCount(),
    getPushHistory(),
  ]);

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/marketing" className="text-muted-foreground hover:text-foreground">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Push Notifications</h1>
          <p className="text-sm text-muted-foreground">Envie notificacoes memeticas direto no celular</p>
        </div>
      </div>

      <PushSender subscriberCount={subscriberCount} history={history} />
    </div>
  );
}
