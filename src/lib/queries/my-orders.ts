import { db } from "@/lib/db";

export async function getMyOrders(userId: string) {
  return db.order.findMany({
    where: { userId, deletedAt: null },
    include: {
      items: {
        include: {
          product: { select: { name: true, image: true } },
        },
      },
      payments: { select: { method: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
}

export async function getOrderDetail(orderNumber: string) {
  return db.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          product: { select: { name: true, image: true, slug: true } },
        },
      },
      payments: { select: { method: true, status: true, amount: true, paidAt: true } },
    },
  });
}
