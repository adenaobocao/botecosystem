import { NextResponse } from "next/server";
import { askGemini } from "@/lib/ai/gemini";
import { buildCampaignPrompt } from "@/lib/ai/prompts";

export async function POST(req: Request) {
  try {
    const { segment, segmentDescription, products, occasion, tone } = await req.json();

    const prompt = buildCampaignPrompt({
      segment,
      segmentDescription: segmentDescription || segment,
      products,
      occasion,
      tone,
    });

    const text = await askGemini(prompt, { maxTokens: 512 });
    return NextResponse.json({ text });
  } catch (error) {
    console.error("[ai/campaign-copy] Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
