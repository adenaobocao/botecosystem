import { NextRequest, NextResponse } from "next/server";
import { getPaymentStatus } from "@/lib/mercadopago";
import { db } from "@/lib/db";
import { notifyOrderStatus } from "@/lib/whatsapp/conversation";

// Mercado Pago envia IPN (Instant Payment Notification) aqui
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Mercado Pago manda varios tipos de notificacao
    // Nos so queremos "payment"
    if (body.type !== "payment" && body.action !== "payment.updated") {
      return NextResponse.json({ ok: true });
    }

    const paymentId = String(body.data?.id);
    if (!paymentId) {
      return NextResponse.json({ ok: true });
    }

    // Consulta status real no Mercado Pago
    const { status, externalReference: orderId } = await getPaymentStatus(paymentId);

    if (!orderId) {
      return NextResponse.json({ ok: true });
    }

    if (status === "approved") {
      // Atualiza pagamento
      await db.payment.updateMany({
        where: { orderId, status: "PENDING" },
        data: {
          status: "APPROVED",
          externalId: paymentId,
          paidAt: new Date(),
        },
      });

      // Atualiza pedido pra CONFIRMED
      const order = await db.order.update({
        where: { id: orderId },
        data: { status: "CONFIRMED" },
      });

      // Se veio do WhatsApp, notifica o cliente
      if (order.origin === "WHATSAPP") {
        await notifyOrderStatus(orderId, "CONFIRMED");
      }
    } else if (status === "rejected" || status === "cancelled") {
      await db.payment.updateMany({
        where: { orderId, status: "PENDING" },
        data: {
          status: status === "rejected" ? "REJECTED" : "CANCELLED",
          externalId: paymentId,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[mercadopago-webhook] Error:", error);
    return NextResponse.json({ error: "Error processing webhook" }, { status: 500 });
  }
}

// Mercado Pago tambem faz GET pra verificar
export async function GET() {
  return NextResponse.json({ status: "active" });
}
