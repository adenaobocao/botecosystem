import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || "";

const client = new MercadoPagoConfig({ accessToken });

export const mpPayment = new Payment(client);
export const mpPreference = new Preference(client);

// ============================================================
// PIX - Gerar cobranca
// ============================================================
export async function createPixPayment(params: {
  amount: number;
  description: string;
  orderId: string;
  orderNumber: string;
  payerEmail?: string;
  payerName?: string;
}) {
  const body = {
    transaction_amount: params.amount,
    description: `Boteco da Estacao - Pedido #${params.orderNumber}`,
    payment_method_id: "pix",
    payer: {
      email: params.payerEmail || "cliente@boteco.com",
      first_name: params.payerName || "Cliente",
    },
    external_reference: params.orderId,
    notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
  };

  const payment = await mpPayment.create({ body });

  return {
    paymentId: String(payment.id),
    status: payment.status as string,
    qrCode: payment.point_of_interaction?.transaction_data?.qr_code || "",
    qrCodeBase64: payment.point_of_interaction?.transaction_data?.qr_code_base64 || "",
    ticketUrl: payment.point_of_interaction?.transaction_data?.ticket_url || "",
    expiresAt: payment.date_of_expiration || null,
  };
}

// ============================================================
// Consultar status do pagamento
// ============================================================
export async function getPaymentStatus(paymentId: string) {
  const payment = await mpPayment.get({ id: paymentId });
  return {
    status: payment.status as string,
    externalReference: payment.external_reference as string,
  };
}

// ============================================================
// Cartao - Criar preferencia (Checkout Pro / Bricks)
// ============================================================
export async function createCardPreference(params: {
  amount: number;
  orderId: string;
  orderNumber: string;
  items: { name: string; quantity: number; unitPrice: number }[];
}) {
  const preference = await mpPreference.create({
    body: {
      items: params.items.map((item) => ({
        id: params.orderId,
        title: item.name,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        currency_id: "BRL",
      })),
      external_reference: params.orderId,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/pedido-confirmado?pedido=${params.orderNumber}`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?erro=pagamento`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/pagamento-pendente?pedido=${params.orderNumber}`,
      },
      auto_return: "approved",
    },
  });

  return {
    preferenceId: preference.id as string,
    initPoint: preference.init_point as string,
    sandboxInitPoint: preference.sandbox_init_point as string,
  };
}
