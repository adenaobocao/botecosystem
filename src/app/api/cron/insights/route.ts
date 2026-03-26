import { NextResponse } from "next/server";
import {
  generateDailySummary,
  checkAnomalies,
  generateForecast,
  analyzeProducts,
  calculateHealthScore,
} from "@/lib/ai/insights";

// Vercel Cron — roda 1x/dia as 23h (horario de Brasilia)
// GET porque Vercel Cron faz GET

export async function GET(req: Request) {
  // Valida CRON_SECRET (seguranca)
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await generateDailySummary();
    await checkAnomalies();
    await generateForecast();
    await analyzeProducts();
    await calculateHealthScore();

    return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("[cron/insights] Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
