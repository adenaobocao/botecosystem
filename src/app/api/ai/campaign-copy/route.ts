import { NextResponse } from "next/server";
import { askGemini } from "@/lib/ai/gemini";
import { buildCampaignPrompt } from "@/lib/ai/prompts";

export async function POST(req: Request) {
  try {
    const { segment, segmentDescription, products, occasion, tone, event } = await req.json();

    // Se tem evento, enriquece a ocasiao
    let fullOccasion = occasion || "";
    if (event) {
      fullOccasion += ` Evento: ${event.title}`;
      if (event.artist) fullOccasion += ` com ${event.artist}`;
      fullOccasion += ` em ${event.date}`;
      if (event.coverCharge > 0) fullOccasion += ` (entrada R$${event.coverCharge})`;
      else fullOccasion += ` (entrada franca)`;
    }

    const prompt = buildCampaignPrompt({
      segment,
      segmentDescription: segmentDescription || segment,
      products,
      occasion: fullOccasion || undefined,
      tone,
    });

    const text = await askGemini(prompt, { maxTokens: 512 });
    return NextResponse.json({ text });
  } catch (error) {
    console.error("[ai/campaign-copy] Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
