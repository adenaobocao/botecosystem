"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createPixPayment, createCardPreference } from "@/lib/mercadopago";

interface CheckoutItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  notes?: string;
  name?: string;
}

interface CheckoutData {
  type: "DELIVERY" | "PICKUP" | "TABLE";
  tableNumber?: number;
  notes?: string;
  deliveryFee?: number;
  addressId?: string;
  paymentMethod: "PIX" | "CREDIT_CARD" | "DEBIT_CARD" | "CASH";
  items: CheckoutItem[];
}

function generateOrderNumber(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export async function createOrder(data: CheckoutData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Login necessario para fazer pedido");
  }

  const userId = session.user.id;
  const userEmail = session.user.email || undefined;
  const userName = session.user.name || undefined;

  const subtotal = data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = data.type === "DELIVERY" ? (data.deliveryFee ?? 8.0) : 0;
  const total = subtotal + deliveryFee;
  const orderNumber = generateOrderNumber();

  const order = await db.order.create({
    data: {
      orderNumber,
      userId,
      type: data.type,
      tableNumber: data.tableNumber || null,
      addressId: data.addressId || null,
      status: "PENDING", // Fica PENDING ate pagamento ser confirmado
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

  // ============================================================
  // Pagamento
  // ============================================================

  if (data.paymentMethod === "CASH") {
    // Dinheiro — confirma direto
    await db.payment.create({
      data: {
        orderId: order.id,
        method: "CASH",
        status: "PENDING",
        amount: total,
      },
    });

    // Dinheiro = pedido ja vai pra cozinha
    await db.order.update({
      where: { id: order.id },
      data: { status: "CONFIRMED" },
    });

    return {
      orderNumber,
      orderId: order.id,
      paymentMethod: "CASH" as const,
    };
  }

  if (data.paymentMethod === "PIX") {
    try {
      const pix = await createPixPayment({
        amount: total,
        description: `Pedido #${orderNumber}`,
        orderId: order.id,
        orderNumber,
        payerEmail: userEmail,
        payerName: userName,
      });

      await db.payment.create({
        data: {
          orderId: order.id,
          method: "PIX",
          status: "PENDING",
          externalId: pix.paymentId,
          amount: total,
        },
      });

      return {
        orderNumber,
        orderId: order.id,
        paymentMethod: "PIX" as const,
        pix: {
          qrCode: pix.qrCode,
          qrCodeBase64: pix.qrCodeBase64,
          paymentId: pix.paymentId,
        },
      };
    } catch (error) {
      console.error("[checkout] Mercado Pago PIX error:", error);
      // Fallback: cria como PENDING sem PIX (pra quando MP nao ta configurado)
      await db.payment.create({
        data: {
          orderId: order.id,
          method: "PIX",
          status: "PENDING",
          amount: total,
        },
      });

      // Confirma direto (modo demo)
      await db.order.update({
        where: { id: order.id },
        data: { status: "CONFIRMED" },
      });

      return {
        orderNumber,
        orderId: order.id,
        paymentMethod: "PIX_FALLBACK" as const,
      };
    }
  }

  if (data.paymentMethod === "CREDIT_CARD" || data.paymentMethod === "DEBIT_CARD") {
    try {
      const preference = await createCardPreference({
        amount: total,
        orderId: order.id,
        orderNumber,
        items: data.items.map((item) => ({
          name: item.name || "Item",
          quantity: item.quantity,
          unitPrice: item.price,
        })),
      });

      await db.payment.create({
        data: {
          orderId: order.id,
          method: data.paymentMethod,
          status: "PENDING",
          externalId: preference.preferenceId,
          amount: total,
        },
      });

      return {
        orderNumber,
        orderId: order.id,
        paymentMethod: "CARD" as const,
        card: {
          checkoutUrl: preference.initPoint,
          preferenceId: preference.preferenceId,
        },
      };
    } catch (error) {
      console.error("[checkout] Mercado Pago Card error:", error);
      // Fallback demo
      await db.payment.create({
        data: {
          orderId: order.id,
          method: data.paymentMethod,
          status: "PENDING",
          amount: total,
        },
      });

      await db.order.update({
        where: { id: order.id },
        data: { status: "CONFIRMED" },
      });

      return {
        orderNumber,
        orderId: order.id,
        paymentMethod: "CARD_FALLBACK" as const,
      };
    }
  }

  // Fallback generico
  return { orderNumber, orderId: order.id, paymentMethod: "CASH" as const };
}
