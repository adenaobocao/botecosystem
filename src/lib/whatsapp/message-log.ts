// Log de mensagens WhatsApp — salva no banco pra exibir na dashboard

import { db } from "@/lib/db";

export async function logMessage(params: {
  phone: string;
  name: string;
  direction: "IN" | "OUT";
  text: string;
  orderId?: string;
  needsAttention?: boolean;
}) {
  // Usa a tabela genérica — vamos criar via SQL
  // Por enquanto, salva como JSON no formato que a dashboard espera
  try {
    // Upsert conversation record
    await db.$executeRawUnsafe(
      `INSERT INTO "WhatsAppMessage" (id, phone, name, direction, text, "orderId", "needsAttention", "createdAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW())`,
      params.phone,
      params.name,
      params.direction,
      params.text.substring(0, 2000),
      params.orderId || null,
      params.needsAttention || false
    );
  } catch (error) {
    // Tabela pode nao existir ainda — nao quebra o fluxo
    console.error("[message-log] Error saving message:", error);
  }
}

export async function getRecentMessages(limit = 50) {
  try {
    const messages = await db.$queryRawUnsafe<{
      id: string;
      phone: string;
      name: string;
      direction: string;
      text: string;
      orderId: string | null;
      needsAttention: boolean;
      createdAt: Date;
    }[]>(
      `SELECT * FROM "WhatsAppMessage" ORDER BY "createdAt" DESC LIMIT $1`,
      limit
    );
    return messages;
  } catch {
    return [];
  }
}

export async function getConversations() {
  try {
    const convs = await db.$queryRawUnsafe<{
      phone: string;
      name: string;
      lastMessage: string;
      lastAt: Date;
      messageCount: number;
      hasOrder: boolean;
      needsAttention: boolean;
    }[]>(`
      SELECT
        phone,
        MAX(name) as name,
        (SELECT text FROM "WhatsAppMessage" m2 WHERE m2.phone = m.phone ORDER BY "createdAt" DESC LIMIT 1) as "lastMessage",
        MAX("createdAt") as "lastAt",
        COUNT(*)::int as "messageCount",
        bool_or("orderId" IS NOT NULL) as "hasOrder",
        bool_or("needsAttention") as "needsAttention"
      FROM "WhatsAppMessage" m
      WHERE direction = 'IN'
      GROUP BY phone
      ORDER BY MAX("createdAt") DESC
      LIMIT 100
    `);
    return convs;
  } catch {
    return [];
  }
}

export async function getConversationMessages(phone: string) {
  try {
    const messages = await db.$queryRawUnsafe<{
      id: string;
      direction: string;
      text: string;
      createdAt: Date;
    }[]>(
      `SELECT id, direction, text, "createdAt" FROM "WhatsAppMessage" WHERE phone = $1 ORDER BY "createdAt" ASC LIMIT 200`,
      phone
    );
    return messages;
  } catch {
    return [];
  }
}
