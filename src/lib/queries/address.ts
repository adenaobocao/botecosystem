import { db } from "@/lib/db";

export async function getUserAddresses(userId: string) {
  return db.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      street: true,
      number: true,
      complement: true,
      neighborhood: true,
      city: true,
      state: true,
      zipCode: true,
      isDefault: true,
    },
  });
}
