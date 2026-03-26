import { NextResponse } from "next/server";
import { askGemini } from "@/lib/ai/gemini";

export async function POST(req: Request) {
  try {
    const { style } = await req.json();

    const prompt = `Gere 6 notificacoes push DIFERENTES pro Boteco da Estacao (bar em Ponta Grossa-PR).

ESTILO: ${style || "humor de bar"}

Regras:
- Cada titulo MAX 30 caracteres
- Cada corpo MAX 100 caracteres
- Tom: engracado, memetico, tipo meme brasileiro, zoeira de bar
- Varie os temas: fome, chopp, sexta-feira, madrugada, saudade, urgencia fake, meme atual
- Nao use emojis
- Tem que dar vontade de clicar
- Exemplos de tom certo:
  * "Seu estomago mandou msg" / "Ele ta pedindo um hamburguer artesanal. Atenda."
  * "Emergencia nutricional" / "Aquele chopp gelado nao vai se beber sozinho ne"
  * "Sexta-feira detectada" / "Protocolo de boteco ativado. Venha imediatamente."
  * "Alerta vermelho" / "Batata frita saindo do oleo AGORA. Corre."
  * "Nao e propaganda" / "Mas se fosse, diria que tem promo de hamburguer hoje"
  * "POV:" / "Voce olhando o cardapio as 23h e fingindo que nao vai pedir"

Responda EXATAMENTE nesse formato (6 opcoes):
1_TITULO: [titulo]
1_BODY: [corpo]
2_TITULO: [titulo]
2_BODY: [corpo]
3_TITULO: [titulo]
3_BODY: [corpo]
4_TITULO: [titulo]
4_BODY: [corpo]
5_TITULO: [titulo]
5_BODY: [corpo]
6_TITULO: [titulo]
6_BODY: [corpo]`;

    const text = await askGemini(prompt, { maxTokens: 800, temperature: 0.95 });

    const options: { title: string; body: string }[] = [];
    for (let i = 1; i <= 6; i++) {
      const titleMatch = text.match(new RegExp(`${i}_TITULO:\\s*(.+)`));
      const bodyMatch = text.match(new RegExp(`${i}_BODY:\\s*(.+)`));
      if (titleMatch && bodyMatch) {
        options.push({
          title: titleMatch[1].trim(),
          body: bodyMatch[1].trim(),
        });
      }
    }

    return NextResponse.json({ options });
  } catch (error) {
    console.error("[ai/push-copy] Error:", error);
    return NextResponse.json({ error: "Failed", options: [] }, { status: 500 });
  }
}
