import { NextResponse } from "next/server";
import { segmentAllCustomers } from "@/lib/services/segmentation";

// Vercel Cron — roda 1x/dia as 9h

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const counts = await segmentAllCustomers();
    return NextResponse.json({ ok: true, counts });
  } catch (error) {
    console.error("[cron/segmentation] Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
