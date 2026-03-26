// Servico IA compartilhado (Groq) -- usado por insights, campanhas, conteudo

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

// Rate limiter simples: 30 RPM (Groq free tier)
const calls: number[] = [];
const MAX_RPM = 30;

async function waitForSlot(): Promise<void> {
  const now = Date.now();
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

const SYSTEM_PROMPT =
  "Voce e o analista de negocios do Boteco da Estacao, um bar/restaurante em Ponta Grossa-PR. " +
  "Sempre responda em portugues brasileiro, de forma direta e acionavel. " +
  "Use dados concretos quando fornecidos. Nao use emojis.";

export async function askGemini(
  prompt: string,
  opts?: { maxTokens?: number; temperature?: number }
): Promise<string> {
  if (!process.env.GROQ_API_KEY) {
    return "[IA indisponivel — GROQ_API_KEY nao configurada]";
  }

  await waitForSlot();

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      max_tokens: opts?.maxTokens ?? 1024,
      temperature: opts?.temperature ?? 0.7,
    });

    return completion.choices[0]?.message?.content?.trim() || "[Resposta vazia da IA]";
  } catch (error) {
    console.error("[groq] Error:", error);
    return "[Erro ao gerar resposta da IA]";
  }
}
