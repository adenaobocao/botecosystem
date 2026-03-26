import { Metadata } from "next";
import { getSegmentCounts } from "@/lib/queries/marketing";
import { getUpcomingEvents } from "@/lib/queries/events";
import { db } from "@/lib/db";
import { CampaignForm } from "@/components/dashboard/marketing/campaign-form";
import { serialize } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = { title: "Nova Campanha | Marketing" };
export const dynamic = "force-dynamic";

async function getProductsForCampaign() {
  const products = await db.product.findMany({
    where: { isAvailable: true, deletedAt: null },
    select: { id: true, name: true, basePrice: true, promoPrice: true },
    orderBy: { name: "asc" },
  });
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.promoPrice ?? p.basePrice),
  }));
}

export default async function NovaCampanhaPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string; segment?: string; occasion?: string; name?: string }>;
}) {
  const params = await searchParams;
  const [segmentCounts, products, events] = await Promise.all([
    getSegmentCounts(),
    getProductsForCampaign(),
    getUpcomingEvents(10),
  ]);

  const eventsData = serialize(events).map((e: any) => ({
    id: e.id,
    title: e.title,
    artistName: e.artistName,
    date: typeof e.date === "string"
      ? e.date.split("T")[0]
      : new Date(e.date).toISOString().split("T")[0],
    startTime: e.startTime,
    coverCharge: Number(e.coverCharge),
    isCoverFree: e.isCoverFree,
  }));

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/marketing/campanhas" className="text-muted-foreground hover:text-foreground">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Nova campanha</h1>
          <p className="text-sm text-muted-foreground">Envie mensagens via WhatsApp</p>
        </div>
      </div>

      <CampaignForm
        segmentCounts={segmentCounts}
        products={products}
        events={eventsData}
        templateName={params.name}
        templateSegment={params.segment}
        templateOccasion={params.occasion}
      />
    </div>
  );
}
