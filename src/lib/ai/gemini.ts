// Servico Gemini compartilhado -- usado por insights, campanhas, conteudo

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Rate limiter simples: 15 RPM (free tier)
const calls: number[] = [];
const MAX_RPM = 15;

async function waitForSlot(): Promise<void> {
  const now = Date.now();
  // Remove calls older than 60s
  while (calls.length > 0 && now - calls[0] > 60_000) {
    calls.shift();
  }
  if (calls.length >= MAX_RPM) {
    const waitMs = 60_000 - (now - calls[0]) + 100;
    await new Promise((r) => setTimeout(r, waitMs));
    return waitForSlot();
  }
  calls.push(Date.now());
}

export async function askGemini(
  prompt: string,
  opts?: { maxTokens?: number; temperature?: number }
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    return "[IA indisponivel — GEMINI_API_KEY nao configurada]";
  }

  await waitForSlot();

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        maxOutputTokens: opts?.maxTokens ?? 1024,
        temperature: opts?.temperature ?? 0.7,
      },
      systemInstruction:
        "Voce e o analista de negocios do Boteco da Estacao, um bar/restaurante em Ponta Grossa-PR. " +
        "Sempre responda em portugues brasileiro, de forma direta e acionavel. " +
        "Use dados concretos quando fornecidos. Nao use emojis.",
    });

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("[gemini] Error:", error);
    return "[Erro ao gerar resposta da IA]";
  }
}
