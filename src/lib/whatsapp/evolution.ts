// Evolution API SDK — enviar e receber mensagens WhatsApp

const EVOLUTION_URL = process.env.EVOLUTION_API_URL || "";
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY || "";
const INSTANCE = process.env.EVOLUTION_INSTANCE || "boteco";

interface EvolutionResponse {
  key: { id: string };
  status: string;
}

async function api(path: string, body?: unknown): Promise<unknown> {
  const res = await fetch(`${EVOLUTION_URL}${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: EVOLUTION_KEY,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Evolution API error ${res.status}: ${text}`);
  }

  return res.json();
}

// ============================================================
// Enviar mensagem de texto
// ============================================================
export async function sendText(phone: string, text: string): Promise<string> {
  const result = (await api(`/message/sendText/${INSTANCE}`, {
    number: normalizePhone(phone),
    text,
  })) as EvolutionResponse;

  return result.key?.id || "";
}

// ============================================================
// Enviar mensagem com botoes (list message)
// ============================================================
export async function sendButtons(
  phone: string,
  title: string,
  description: string,
  buttons: { displayText: string; id: string }[]
) {
  return api(`/message/sendButtons/${INSTANCE}`, {
    number: normalizePhone(phone),
    title,
    description,
    buttons: buttons.map((b) => ({
      type: "reply",
      reply: { id: b.id, displayText: b.displayText },
    })),
  });
}

// ============================================================
// Enviar imagem com caption
// ============================================================
export async function sendImage(phone: string, imageUrl: string, caption: string) {
  return api(`/message/sendMedia/${INSTANCE}`, {
    number: normalizePhone(phone),
    mediatype: "image",
    media: imageUrl,
    caption,
  });
}

// ============================================================
// Enviar lista (menu com secoes)
// ============================================================
export async function sendList(
  phone: string,
  title: string,
  description: string,
  buttonText: string,
  sections: {
    title: string;
    rows: { title: string; description?: string; rowId: string }[];
  }[]
) {
  return api(`/message/sendList/${INSTANCE}`, {
    number: normalizePhone(phone),
    title,
    description,
    buttonText,
    sections,
  });
}

// ============================================================
// Verificar status da instancia
// ============================================================
export async function getInstanceStatus(): Promise<string> {
  const result = (await api(`/instance/connectionState/${INSTANCE}`)) as { state: string };
  return result.state || "unknown";
}

// ============================================================
// Helpers
// ============================================================
function normalizePhone(phone: string): string {
  // Remove tudo que nao e numero
  let clean = phone.replace(/\D/g, "");
  // Garante que tem codigo do pais
  if (clean.length <= 11) {
    clean = "55" + clean;
  }
  return clean;
}

// ============================================================
// Tipos do webhook
// ============================================================
export interface EvolutionWebhookMessage {
  event: string;
  instance: string;
  data: {
    key: {
      remoteJid: string;
      fromMe: boolean;
      id: string;
    };
    pushName?: string;
    message?: {
      conversation?: string;
      extendedTextMessage?: { text: string };
      buttonsResponseMessage?: { selectedButtonId: string };
      listResponseMessage?: { singleSelectReply: { selectedRowId: string } };
    };
    messageType?: string;
  };
}

export function extractMessageText(data: EvolutionWebhookMessage["data"]): string {
  const msg = data.message;
  if (!msg) return "";

  return (
    msg.conversation ||
    msg.extendedTextMessage?.text ||
    msg.buttonsResponseMessage?.selectedButtonId ||
    msg.listResponseMessage?.singleSelectReply?.selectedRowId ||
    ""
  ).trim();
}

export function extractPhone(remoteJid: string): string {
  // "5542999327823@s.whatsapp.net" -> "5542999327823"
  return remoteJid.replace("@s.whatsapp.net", "").replace("@g.us", "");
}
