import { NextResponse } from "next/server";
import { askGemini } from "@/lib/ai/gemini";

export async function POST(req: Request) {
  try {
    const { style } = await req.json();

    const prompt = `Gere uma notificacao push pro Boteco da Estacao (bar em Ponta Grossa-PR).

ESTILO: ${style || "humor de bar"}

Regras:
- O titulo deve ter MAX 30 caracteres
- O corpo deve ter MAX 100 caracteres
- Tom: engracado, memetico, tipo meme brasileiro
- Pode ser zoeira, fome de madrugada, saudade do chopp, urgencia fake divertida
- Nao use emojis
- Tem que dar vontade de clicar e ir pro bar
- Exemplos de tom certo:
  * "Seu estomago mandou mensagem" / "Ele ta pedindo um hamburguer artesanal"
  * "Emergencia nutricional" / "Aquele chopp gelado nao vai se beber sozinho"
  * "Sexta-feira detectada" / "Protocolo de boteco ativado. Venha imediatamente."
  * "Alerta vermelho" / "Batata frita saindo do oleo AGORA. Corre."

Responda EXATAMENTE nesse formato:
TITULO: [max 30 chars]
BODY: [max 100 chars]`;

    const text = await askGemini(prompt, { maxTokens: 256, temperature: 0.95 });

    const titleMatch = text.match(/TITULO:\s*(.+)/);
    const bodyMatch = text.match(/BODY:\s*(.+)/);

    return NextResponse.json({
      title: titleMatch?.[1]?.trim() || "Boteco da Estacao",
      body: bodyMatch?.[1]?.trim() || "",
    });
  } catch (error) {
    console.error("[ai/push-copy] Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
