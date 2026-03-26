import { Metadata } from "next";
import { getCouponSuggestions } from "@/lib/queries/marketing";
import { CouponSuggestions } from "@/components/dashboard/marketing/coupon-suggestions";
import Link from "next/link";

export const metadata: Metadata = { title: "Cupons IA | Marketing" };
export const dynamic = "force-dynamic";

export default async function CuponsPage() {
  const [pending, approved, rejected] = await Promise.all([
    getCouponSuggestions("PENDING"),
    getCouponSuggestions("APPROVED"),
    getCouponSuggestions("REJECTED"),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/marketing" className="text-muted-foreground hover:text-foreground">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Cupons inteligentes</h1>
          <p className="text-sm text-muted-foreground">Sugestoes geradas pela IA para reter clientes</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-card border border-border rounded-xl text-center">
          <p className="text-xl font-bold text-amber-600">{pending.length}</p>
          <p className="text-[10px] text-muted-foreground">Pendentes</p>
        </div>
        <div className="p-3 bg-card border border-border rounded-xl text-center">
          <p className="text-xl font-bold text-green-600">{approved.length}</p>
          <p className="text-[10px] text-muted-foreground">Aprovados</p>
        </div>
        <div className="p-3 bg-card border border-border rounded-xl text-center">
          <p className="text-xl font-bold text-muted-foreground">{rejected.length}</p>
          <p className="text-[10px] text-muted-foreground">Rejeitados</p>
        </div>
      </div>

      <CouponSuggestions suggestions={pending} />
    </div>
  );
}
