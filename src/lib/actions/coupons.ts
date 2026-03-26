"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendText } from "@/lib/whatsapp/evolution";

// Gera codigo de cupom unico
function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "BOTECO";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function approveCouponSuggestion(suggestionId: string) {
  // Busca sugestao
  const [suggestion] = await db.$queryRawUnsafe<
    { user_id: string; coupon_type: string; suggested_value: number }[]
  >(
    `SELECT "userId" as user_id, "couponType" as coupon_type, "suggestedValue"::float as suggested_value
     FROM "AiCouponSuggestion" WHERE id = $1`,
    suggestionId
  );
  if (!suggestion) throw new Error("Sugestao nao encontrada");

  const code = generateCode();
  const now = new Date();
  const validUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 dias

  // Cria cupom real
  const coupon = await db.coupon.create({
    data: {
      code,
      type: suggestion.coupon_type as "PERCENTAGE" | "FIXED",
      value: suggestion.suggested_value,
      maxUses: 1,
      validFrom: now,
      validUntil,
      isActive: true,
    },
  });

  // Atualiza sugestao
  await db.$executeRawUnsafe(
    `UPDATE "AiCouponSuggestion" SET status = 'APPROVED', "approvedCouponId" = $1 WHERE id = $2`,
    coupon.id,
    suggestionId
  );

  revalidatePath("/dashboard/marketing/cupons");
  return { code, couponId: coupon.id };
}

export async function rejectCouponSuggestion(suggestionId: string) {
  await db.$executeRawUnsafe(
    `UPDATE "AiCouponSuggestion" SET status = 'REJECTED' WHERE id = $1`,
    suggestionId
  );
  revalidatePath("/dashboard/marketing/cupons");
}

export async function sendCouponToCustomer(suggestionId: string, couponCode: string) {
  // Busca telefone do cliente
  const [data] = await db.$queryRawUnsafe<{ phone: string; name: string }[]>(
    `SELECT u.phone, u.name
     FROM "AiCouponSuggestion" cs
     JOIN "User" u ON u.id = cs."userId"
     WHERE cs.id = $1`,
    suggestionId
  );
  if (!data?.phone) throw new Error("Cliente sem telefone");

  const message = `Opa ${data.name || ""}! Faz tempo que voce nao passa no Boteco da Estacao. Separamos um cupom especial pra voce: ${couponCode}. Valido por 7 dias. Peca pelo site ou manda mensagem aqui!`;

  await sendText(data.phone, message);
}
