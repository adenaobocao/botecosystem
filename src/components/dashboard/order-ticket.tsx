"use client";

interface TicketOrder {
  orderNumber: string;
  type: string;
  tableNumber?: number | null;
  origin?: string;
  createdAt: string;
  notes?: string | null;
  user?: { name: string | null; email: string | null } | null;
  items: { quantity: number; notes?: string | null; product: { name: string } }[];
  total?: number | string;
  payments?: { method: string }[];
}

const paymentLabels: Record<string, string> = {
  PIX: "PIX",
  CREDIT_CARD: "Credito",
  DEBIT_CARD: "Debito",
  CASH: "Dinheiro",
};

const originLabels: Record<string, string> = {
  SITE: "Site",
  IFOOD: "iFood",
  WHATSAPP: "WhatsApp",
  TABLE: "Mesa",
};

function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function printOrder(order: TicketOrder) {
  const printWindow = window.open("", "_blank", "width=320,height=600");
  if (!printWindow) return;

  const itemsHtml = order.items
    .map((item) => {
      const notesHtml = item.notes
        ? item.notes
            .split(" | ")
            .map((n) => `<div class="note">  > ${n}</div>`)
            .join("")
        : "";
      return `
        <div class="item">
          <div class="item-row">
            <span class="qty">${item.quantity}x</span>
            <span class="name">${item.product.name}</span>
          </div>
          ${notesHtml}
        </div>`;
    })
    .join("");

  const payment = order.payments?.[0]
    ? paymentLabels[order.payments[0].method] || order.payments[0].method
    : "";

  const totalHtml =
    order.total != null
      ? `<div class="total">TOTAL: R$ ${Number(order.total).toFixed(2).replace(".", ",")}</div>`
      : "";

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Pedido #${order.orderNumber}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Courier New', monospace;
    font-size: 12px;
    width: 72mm;
    padding: 2mm;
    color: #000;
    background: #fff;
  }
  .header {
    text-align: center;
    border-bottom: 1px dashed #000;
    padding-bottom: 6px;
    margin-bottom: 6px;
  }
  .order-num {
    font-size: 24px;
    font-weight: 900;
    letter-spacing: 1px;
  }
  .meta {
    font-size: 11px;
    margin-top: 2px;
  }
  .meta-row {
    display: flex;
    justify-content: space-between;
  }
  .section {
    border-bottom: 1px dashed #000;
    padding: 6px 0;
  }
  .item { margin-bottom: 4px; }
  .item-row {
    display: flex;
    gap: 6px;
  }
  .qty {
    font-weight: 900;
    min-width: 24px;
  }
  .name { font-weight: 700; }
  .note {
    font-size: 10px;
    font-style: italic;
    margin-left: 4px;
  }
  .obs {
    font-size: 10px;
    padding: 4px 0;
    border-bottom: 1px dashed #000;
  }
  .total {
    font-size: 16px;
    font-weight: 900;
    text-align: right;
    padding: 6px 0;
    border-bottom: 1px dashed #000;
  }
  .footer {
    text-align: center;
    font-size: 9px;
    padding-top: 6px;
    color: #666;
  }
  @media print {
    body { width: 72mm; }
    @page {
      size: 80mm auto;
      margin: 0;
    }
  }
</style>
</head>
<body>
  <div class="header">
    <div class="order-num">#${order.orderNumber}</div>
    <div class="meta">
      <div class="meta-row">
        <span>${formatDate(order.createdAt)} ${formatTime(order.createdAt)}</span>
        <span>${originLabels[order.origin ?? "SITE"] || order.origin}</span>
      </div>
      ${order.type === "TABLE" && order.tableNumber ? `<div><strong>MESA ${order.tableNumber}</strong></div>` : ""}
      ${order.type === "DELIVERY" ? "<div>DELIVERY</div>" : ""}
      ${order.type === "PICKUP" ? "<div>RETIRADA</div>" : ""}
    </div>
  </div>

  ${order.user?.name ? `<div class="section" style="font-size:11px">${order.user.name}${payment ? " | " + payment : ""}</div>` : ""}

  <div class="section">
    ${itemsHtml}
  </div>

  ${order.notes ? `<div class="obs">OBS: ${order.notes}</div>` : ""}

  ${totalHtml}

  <div class="footer">
    Impresso em ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
  </div>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  };
}

export function PrintButton({
  order,
  size = "sm",
}: {
  order: TicketOrder;
  size?: "sm" | "md";
}) {
  return (
    <button
      onClick={() => printOrder(order)}
      className={`inline-flex items-center gap-1.5 font-medium rounded-lg transition-colors hover:bg-secondary ${
        size === "sm"
          ? "h-8 px-3 text-xs"
          : "h-10 px-4 text-sm"
      } bg-secondary/60 text-secondary-foreground`}
      title="Imprimir pedido"
    >
      <svg
        width={size === "sm" ? 14 : 16}
        height={size === "sm" ? 14 : 16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
      Imprimir
    </button>
  );
}
