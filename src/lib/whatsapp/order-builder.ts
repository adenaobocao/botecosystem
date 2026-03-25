// Cria Order no banco a partir da conversa do WhatsApp

import { db } from "@/lib/db";

interface WhatsAppOrderData {
  phone: string;
  name: string;
  cart: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    options: string[];
  }[];
  orderType: "DELIVERY" | "PICKUP" | "TABLE";
  address?: string;
  tableNumber?: number;
  deliveryFee: number;
}

function generateOrderNumber(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export async function createWhatsAppOrder(data: WhatsAppOrderData) {
  // Busca ou cria usuario pelo telefone
  let user = await db.user.findFirst({
    where: { phone: data.phone },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        phone: data.phone,
        name: data.name,
        email: `whatsapp_${data.phone}@boteco.local`,
        role: "CUSTOMER",
      },
    });
  }

  const subtotal = data.cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + data.deliveryFee;

  const order = await db.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: user.id,
      type: data.orderType,
      tableNumber: data.tableNumber || null,
      status: "PENDING", // Fica PENDING ate pagar (site fica CONFIRMED pq paga antes)
      origin: "WHATSAPP",
      subtotal,
      deliveryFee: data.deliveryFee,
      discount: 0,
      total,
      notes: data.address ? `Endereco: ${data.address}` : null,
      estimatedTime: 30,
      items: {
        create: data.cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
          notes: item.options.length > 0 ? item.options.join(" | ") : null,
        })),
      },
    },
  });

  // Payment record — fica PENDING ate webhook confirmar
  await db.payment.create({
    data: {
      orderId: order.id,
      method: "PIX",
      status: "PENDING",
      amount: total,
    },
  });

  return { orderId: order.id, orderNumber: order.orderNumber };
}
