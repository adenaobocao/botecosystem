"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "MANAGER"].includes(session.user.role)) {
    throw new Error("Nao autorizado");
  }

  await db.order.update({
    where: { id: orderId },
    data: { status: newStatus as any },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/pedidos");
  revalidatePath("/dashboard/cozinha");
}
