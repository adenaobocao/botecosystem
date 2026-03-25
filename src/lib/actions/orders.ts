"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "MANAGER"].includes(session.user.role)) {
    throw new Error("Nao autorizado");
  }

  const order = await db.order.update({
    where: { id: orderId },
    data: { status: newStatus as any },
  });

  // Notifica cliente via WhatsApp se o pedido veio de la
  if (order.origin === "WHATSAPP") {
    try {
      const { notifyOrderStatus } = await import("@/lib/whatsapp/conversation");
      await notifyOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error("[orders] WhatsApp notification error:", err);
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/pedidos");
  revalidatePath("/dashboard/cozinha");
}
