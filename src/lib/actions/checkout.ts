"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

interface CheckoutItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface CheckoutData {
  type: "DELIVERY" | "PICKUP" | "TABLE";
  tableNumber?: number;
  notes?: string;
  items: CheckoutItem[];
}

function generateOrderNumber(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export async function createOrder(data: CheckoutData) {
  const session = await auth();

  // Allow guest checkout with a default user
  let userId = session?.user?.id;

  if (!userId) {
    // Find or create a guest user
    const guest = await db.user.upsert({
      where: { email: "guest@boteco.com" },
      update: {},
      create: {
        email: "guest@boteco.com",
        name: "Cliente",
        role: "CUSTOMER",
      },
    });
    userId = guest.id;
  }

  const subtotal = data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = data.type === "DELIVERY" ? 8.0 : 0;
  const total = subtotal + deliveryFee;

  const order = await db.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId,
      type: data.type,
      tableNumber: data.tableNumber || null,
      status: "CONFIRMED",
      origin: "SITE",
      subtotal,
      deliveryFee,
      discount: 0,
      total,
      notes: data.notes || null,
      estimatedTime: 30,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId?.includes("+")
            ? null
            : item.variantId || null,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
          notes: item.notes || null,
        })),
      },
    },
  });

  // Fake payment — auto-approved
  await db.payment.create({
    data: {
      orderId: order.id,
      method: "PIX",
      status: "APPROVED",
      amount: total,
      paidAt: new Date(),
    },
  });

  return { orderNumber: order.orderNumber, orderId: order.id };
}
