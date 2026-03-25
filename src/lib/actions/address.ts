"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

interface AddressData {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

export async function createAddress(data: AddressData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Nao autenticado");

  const userId = session.user.id;

  // If setting as default, unset other defaults
  if (data.isDefault) {
    await db.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  // If this is the first address, make it default
  const count = await db.address.count({ where: { userId } });
  const shouldDefault = data.isDefault || count === 0;

  const address = await db.address.create({
    data: {
      userId,
      street: data.street,
      number: data.number,
      complement: data.complement || null,
      neighborhood: data.neighborhood,
      city: data.city || "Ponta Grossa",
      state: data.state || "PR",
      zipCode: data.zipCode,
      isDefault: shouldDefault,
    },
  });

  revalidatePath("/checkout");
  return address;
}

export async function setDefaultAddress(addressId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Nao autenticado");

  const userId = session.user.id;

  await db.address.updateMany({
    where: { userId, isDefault: true },
    data: { isDefault: false },
  });

  await db.address.update({
    where: { id: addressId },
    data: { isDefault: true },
  });

  revalidatePath("/checkout");
}

export async function deleteAddress(addressId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Nao autenticado");

  await db.address.delete({ where: { id: addressId } });
  revalidatePath("/checkout");
}
