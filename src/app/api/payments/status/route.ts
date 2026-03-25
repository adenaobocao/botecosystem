import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Polling do frontend pra checar se pagamento foi aprovado
export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.json({ error: "orderId required" }, { status: 400 });
  }

  const payment = await db.payment.findFirst({
    where: { orderId },
    orderBy: { createdAt: "desc" },
    select: { status: true },
  });

  return NextResponse.json({
    status: payment?.status || "NOT_FOUND",
  });
}
