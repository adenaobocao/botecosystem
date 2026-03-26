"use server";

import { askGemini } from "@/lib/ai/gemini";
import { buildContentPrompt } from "@/lib/ai/prompts";

export async function generateContent(params: {
  type: "SOCIAL_POST" | "WHATSAPP_BROADCAST" | "PROMO_DESCRIPTION" | "EVENT_PROMO";
  context?: string;
  products?: { name: string; price: number }[];
  event?: { title: string; artist?: string; date: string; coverCharge?: number };
  tone?: string;
}): Promise<string> {
  const prompt = buildContentPrompt(params);
  return askGemini(prompt, { maxTokens: 768 });
}
