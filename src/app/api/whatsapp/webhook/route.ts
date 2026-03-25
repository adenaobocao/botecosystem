import { NextRequest, NextResponse } from "next/server";
import { handleMessage } from "@/lib/whatsapp/conversation";
import {
  type EvolutionWebhookMessage,
  extractMessageText,
  extractPhone,
} from "@/lib/whatsapp/evolution";

// Evolution API envia webhook POST com as mensagens recebidas
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as EvolutionWebhookMessage;

    // Ignora mensagens enviadas por nos (fromMe)
    if (body.data?.key?.fromMe) {
      return NextResponse.json({ ok: true });
    }

    // Ignora eventos que nao sao mensagens
    if (body.event !== "messages.upsert") {
      return NextResponse.json({ ok: true });
    }

    const phone = extractPhone(body.data.key.remoteJid);
    const text = extractMessageText(body.data);
    const pushName = body.data.pushName || "";

    if (!phone || !text) {
      return NextResponse.json({ ok: true });
    }

    // Ignora grupos (somente DM)
    if (body.data.key.remoteJid.includes("@g.us")) {
      return NextResponse.json({ ok: true });
    }

    // Processa mensagem (async, nao bloqueia o webhook)
    handleMessage(phone, text, pushName).catch((err) =>
      console.error("[webhook] Error processing message:", err)
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[webhook] Error parsing webhook:", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}

// Evolution API faz GET pra verificar se o webhook ta ativo
export async function GET() {
  return NextResponse.json({ status: "active", service: "boteco-whatsapp" });
}
