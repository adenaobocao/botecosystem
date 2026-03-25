import { db } from "@/lib/db";

export async function getDeliveryZones() {
  return db.deliveryZone.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      fee: true,
      estimatedMin: true,
      neighborhoods: {
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}
