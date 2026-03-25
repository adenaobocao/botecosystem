"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
  name: string;
  phone: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Nao autorizado");

  const phone = data.phone.replace(/\D/g, "");
  if (phone.length < 10) throw new Error("Telefone invalido");
  if (!data.name.trim() || data.name.trim().length < 2) throw new Error("Nome invalido");

  await db.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name.trim(),
      phone,
    },
  });

  revalidatePath("/minha-conta");
}
