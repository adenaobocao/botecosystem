// State machine de conversa — cada telefone tem seu estado

import { db } from "@/lib/db";
import { sendText, sendList } from "./evolution";
import { buildCategoryMenu, buildProductList, buildOptionsMessage, buildCartSummary } from "./menu-builder";
import { createWhatsAppOrder } from "./order-builder";
import { createPixPayment } from "@/lib/mercadopago";
import { interpretMessage } from "./gemini";

// ============================================================
// Estados da conversa
// ============================================================
type ConversationState =
  | "IDLE"
  | "MENU"            // vendo categorias
  | "CATEGORY"        // vendo produtos de uma categoria
  | "OPTIONS"         // escolhendo opcoes de um produto
  | "CART"            // revisando carrinho
  | "ADDRESS"         // informando endereco
  | "ORDER_TYPE"      // entrega, retirada ou mesa
  | "PAYMENT"         // aguardando pagamento
  | "CONFIRMED";      // pedido confirmado

interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  options: string[]; // "Pao Brioche", "Ao ponto", etc
}

interface ConversationData {
  state: ConversationState;
  phone: string;
  name: string;
  cart: CartItem[];
  currentCategorySlug?: string;
  currentProductId?: string;
  pendingOptions?: { groupName: string; groupId: string; maxChoices: number; required: boolean }[];
  currentOptionIndex?: number;
  selectedOptions: string[];
  orderType?: "DELIVERY" | "PICKUP" | "TABLE";
  address?: string;
  tableNumber?: number;
  orderId?: string;
  paymentId?: string;
  lastActivity: number;
}

// In-memory store — suficiente pra volume de bar
// Em producao pesada, migrar pra Redis
const conversations = new Map<string, ConversationData>();

// Timeout de 30 min sem atividade
const TIMEOUT_MS = 30 * 60 * 1000;

function getOrCreate(phone: string, name: string): ConversationData {
  const existing = conversations.get(phone);
  if (existing && Date.now() - existing.lastActivity < TIMEOUT_MS) {
    existing.lastActivity = Date.now();
    existing.name = name || existing.name;
    return existing;
  }

  const fresh: ConversationData = {
    state: "IDLE",
    phone,
    name: name || "Cliente",
    cart: [],
    selectedOptions: [],
    lastActivity: Date.now(),
  };
  conversations.set(phone, fresh);
  return fresh;
}

// ============================================================
// Handler principal — recebe msg e responde
// ============================================================
export async function handleMessage(phone: string, text: string, pushName: string) {
  const conv = getOrCreate(phone, pushName);
  const input = text.toLowerCase().trim();

  try {
    // Comandos globais
    if (["cancelar", "sair", "voltar ao inicio", "0"].includes(input)) {
      conversations.delete(phone);
      await sendText(phone, "Tudo certo! Quando quiser pedir, e so mandar um oi.");
      return;
    }

    if (["carrinho", "ver carrinho", "meu pedido"].includes(input)) {
      if (conv.cart.length === 0) {
        await sendText(phone, "Seu carrinho esta vazio. Quer ver o *cardapio*?");
        return;
      }
      conv.state = "CART";
      await sendText(phone, buildCartSummary(conv.cart));
      await sendText(phone, "Deseja:\n1 - Adicionar mais itens\n2 - Finalizar pedido\n3 - Limpar carrinho");
      return;
    }

    // Usar Gemini pra interpretar mensagens livres
    const intent = await interpretMessage(input, conv.state, conv.cart);

    switch (conv.state) {
      case "IDLE":
        await handleIdle(conv, input, intent);
        break;
      case "MENU":
        await handleMenu(conv, input, intent);
        break;
      case "CATEGORY":
        await handleCategory(conv, input, intent);
        break;
      case "OPTIONS":
        await handleOptions(conv, input, intent);
        break;
      case "CART":
        await handleCart(conv, input, intent);
        break;
      case "ORDER_TYPE":
        await handleOrderType(conv, input, intent);
        break;
      case "ADDRESS":
        await handleAddress(conv, input, intent);
        break;
      case "PAYMENT":
        await handlePayment(conv, input, intent);
        break;
      default:
        await sendGreeting(conv);
    }
  } catch (error) {
    console.error("[whatsapp] Error handling message:", error);
    await sendText(phone, "Ops, tive um probleminha aqui. Tenta de novo ou manda *cardapio* pra comecar.");
  }
}

// ============================================================
// Handlers por estado
// ============================================================

async function sendGreeting(conv: ConversationData) {
  conv.state = "MENU";
  await sendText(
    conv.phone,
    `Opa${conv.name ? ", " + conv.name : ""}! Bem-vindo ao *Boteco da Estacao*!\n\nO que vai ser hoje?\n\nManda *cardapio* pra ver as opcoes ou me diz o que ta com vontade que eu te ajudo.`
  );
}

async function handleIdle(conv: ConversationData, input: string, intent: string) {
  if (["oi", "ola", "bom dia", "boa tarde", "boa noite", "eae", "e ai", "hello", "hi", "hey"].some((g) => input.includes(g)) || intent === "GREETING") {
    await sendGreeting(conv);
    return;
  }

  if (["cardapio", "menu", "pedir", "pedido", "quero pedir"].some((k) => input.includes(k)) || intent === "VIEW_MENU") {
    conv.state = "MENU";
    const menu = await buildCategoryMenu();
    await sendText(conv.phone, menu);
    return;
  }

  // Se Gemini identificou um produto direto
  if (intent.startsWith("PRODUCT:")) {
    const productSlug = intent.replace("PRODUCT:", "");
    await selectProductBySlug(conv, productSlug);
    return;
  }

  // Default
  await sendGreeting(conv);
}

async function handleMenu(conv: ConversationData, input: string, intent: string) {
  // Numero da categoria ou nome
  if (intent.startsWith("CATEGORY:")) {
    const slug = intent.replace("CATEGORY:", "");
    conv.currentCategorySlug = slug;
    conv.state = "CATEGORY";
    const list = await buildProductList(slug);
    await sendText(conv.phone, list);
    return;
  }

  // Tenta interpretar como numero
  const num = parseInt(input);
  if (!isNaN(num)) {
    const categories = await db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    const cat = categories[num - 1];
    if (cat) {
      conv.currentCategorySlug = cat.slug;
      conv.state = "CATEGORY";
      const list = await buildProductList(cat.slug);
      await sendText(conv.phone, list);
      return;
    }
  }

  // Se Gemini entendeu produto direto
  if (intent.startsWith("PRODUCT:")) {
    const productSlug = intent.replace("PRODUCT:", "");
    await selectProductBySlug(conv, productSlug);
    return;
  }

  await sendText(conv.phone, "Nao entendi. Manda o *numero da categoria* ou o nome do que quer.");
}

async function handleCategory(conv: ConversationData, input: string, intent: string) {
  if (input === "voltar" || intent === "BACK") {
    conv.state = "MENU";
    const menu = await buildCategoryMenu();
    await sendText(conv.phone, menu);
    return;
  }

  // Numero do produto ou nome
  if (intent.startsWith("PRODUCT:")) {
    const productSlug = intent.replace("PRODUCT:", "");
    await selectProductBySlug(conv, productSlug);
    return;
  }

  const num = parseInt(input);
  if (!isNaN(num) && conv.currentCategorySlug) {
    const products = await db.product.findMany({
      where: {
        category: { slug: conv.currentCategorySlug },
        isAvailable: true,
      },
      orderBy: { name: "asc" },
    });
    const product = products[num - 1];
    if (product) {
      await selectProduct(conv, product.id);
      return;
    }
  }

  await sendText(conv.phone, "Manda o *numero do produto* ou *voltar* pra ver as categorias.");
}

async function handleOptions(conv: ConversationData, input: string, intent: string) {
  if (!conv.pendingOptions || conv.currentOptionIndex === undefined) {
    conv.state = "MENU";
    return;
  }

  const currentGroup = conv.pendingOptions[conv.currentOptionIndex];

  // Interpreta resposta (numero ou texto)
  conv.selectedOptions.push(input);

  // Proxima opcao
  conv.currentOptionIndex++;

  if (conv.currentOptionIndex < conv.pendingOptions.length) {
    // Ainda tem opcoes pra escolher
    const nextGroup = conv.pendingOptions[conv.currentOptionIndex];
    const msg = await buildOptionsMessage(conv.currentProductId!, nextGroup.groupId);
    await sendText(conv.phone, msg);
  } else {
    // Todas opcoes escolhidas — adiciona ao carrinho
    await addToCart(conv);
  }
}

async function handleCart(conv: ConversationData, input: string, intent: string) {
  if (input === "1" || intent === "ADD_MORE") {
    conv.state = "MENU";
    const menu = await buildCategoryMenu();
    await sendText(conv.phone, menu);
    return;
  }

  if (input === "2" || intent === "CHECKOUT") {
    conv.state = "ORDER_TYPE";
    await sendText(
      conv.phone,
      "Como quer receber?\n\n1 - *Entrega* (receba em casa)\n2 - *Retirada* (busque no balcao)\n3 - *Mesa* (consumo no local)"
    );
    return;
  }

  if (input === "3" || intent === "CLEAR_CART") {
    conv.cart = [];
    conv.state = "MENU";
    await sendText(conv.phone, "Carrinho limpo! Manda *cardapio* pra comecar de novo.");
    return;
  }

  await sendText(conv.phone, "Manda *1* pra adicionar mais, *2* pra finalizar ou *3* pra limpar.");
}

async function handleOrderType(conv: ConversationData, input: string, intent: string) {
  if (input === "1" || input.includes("entrega") || intent === "DELIVERY") {
    conv.orderType = "DELIVERY";
    conv.state = "ADDRESS";
    await sendText(conv.phone, "Manda seu *endereco completo* (rua, numero, bairro):");
    return;
  }

  if (input === "2" || input.includes("retirada") || input.includes("retirar") || intent === "PICKUP") {
    conv.orderType = "PICKUP";
    await finishOrder(conv);
    return;
  }

  if (input === "3" || input.includes("mesa") || intent === "TABLE") {
    conv.orderType = "TABLE";
    await sendText(conv.phone, "Qual o *numero da mesa*?");
    conv.state = "ADDRESS"; // reusa estado pra pegar o numero
    return;
  }

  await sendText(conv.phone, "Manda *1* (Entrega), *2* (Retirada) ou *3* (Mesa).");
}

async function handleAddress(conv: ConversationData, input: string, _intent: string) {
  if (conv.orderType === "TABLE") {
    const num = parseInt(input);
    if (isNaN(num) || num < 1) {
      await sendText(conv.phone, "Manda o *numero da mesa* (ex: 7):");
      return;
    }
    conv.tableNumber = num;
    await finishOrder(conv);
    return;
  }

  // Entrega — salva endereco como texto
  if (input.length < 10) {
    await sendText(conv.phone, "Endereco muito curto. Manda *rua, numero, bairro*:");
    return;
  }

  conv.address = input;
  await finishOrder(conv);
}

async function handlePayment(conv: ConversationData, input: string, _intent: string) {
  if (input.includes("paguei") || input.includes("pago") || input.includes("pronto")) {
    // Checa status do pagamento
    if (conv.paymentId) {
      const { getPaymentStatus } = await import("@/lib/mercadopago");
      const status = await getPaymentStatus(conv.paymentId);

      if (status.status === "approved") {
        conv.state = "CONFIRMED";
        await sendText(conv.phone, "Pagamento confirmado! Seu pedido ja esta sendo preparado. Voce vai receber atualizacoes aqui.");
        conversations.delete(conv.phone);
        return;
      }
    }

    await sendText(conv.phone, "Ainda nao identifiquei o pagamento. Confere se o PIX foi pra chave certa e aguarda uns segundos.");
    return;
  }

  await sendText(conv.phone, "Aguardando seu pagamento via PIX. Manda *paguei* quando fizer.");
}

// ============================================================
// Acoes auxiliares
// ============================================================

async function selectProduct(conv: ConversationData, productId: string) {
  const product = await db.product.findUnique({
    where: { id: productId },
    include: {
      optionGroups: {
        orderBy: { sortOrder: "asc" },
        include: { options: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  if (!product) {
    await sendText(conv.phone, "Produto nao encontrado. Tenta outro.");
    return;
  }

  conv.currentProductId = productId;
  const price = product.promoPrice ? Number(product.promoPrice) : Number(product.basePrice);

  if (product.optionGroups.length === 0) {
    // Sem opcoes — adiciona direto
    conv.cart.push({
      productId: product.id,
      productName: product.name,
      price,
      quantity: 1,
      options: [],
    });

    await sendText(
      conv.phone,
      `*${product.name}* adicionado ao carrinho!\n\nManda *carrinho* pra ver, ou continue escolhendo.`
    );
    conv.state = "MENU";
    return;
  }

  // Tem opcoes — inicia fluxo
  conv.pendingOptions = product.optionGroups.map((g) => ({
    groupName: g.name,
    groupId: g.id,
    maxChoices: g.maxChoices,
    required: g.required,
  }));
  conv.currentOptionIndex = 0;
  conv.selectedOptions = [];
  conv.state = "OPTIONS";

  const firstGroup = conv.pendingOptions[0];
  const msg = await buildOptionsMessage(productId, firstGroup.groupId);
  await sendText(conv.phone, `*${product.name}* — R$ ${price.toFixed(2)}\n\n${msg}`);
}

async function selectProductBySlug(conv: ConversationData, slug: string) {
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) {
    await sendText(conv.phone, "Nao encontrei esse produto. Manda *cardapio* pra ver as opcoes.");
    return;
  }
  await selectProduct(conv, product.id);
}

async function addToCart(conv: ConversationData) {
  const product = await db.product.findUnique({
    where: { id: conv.currentProductId! },
  });

  if (!product) return;

  const price = product.promoPrice ? Number(product.promoPrice) : Number(product.basePrice);

  conv.cart.push({
    productId: product.id,
    productName: product.name,
    price,
    quantity: 1,
    options: [...conv.selectedOptions],
  });

  conv.pendingOptions = undefined;
  conv.currentOptionIndex = undefined;
  conv.selectedOptions = [];
  conv.state = "MENU";

  await sendText(
    conv.phone,
    `*${product.name}* adicionado ao carrinho!\n\nManda *carrinho* pra ver ou continue escolhendo.`
  );
}

async function finishOrder(conv: ConversationData) {
  const summary = buildCartSummary(conv.cart);
  const subtotal = conv.cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = conv.orderType === "DELIVERY" ? 8.0 : 0; // TODO: calcular por bairro
  const total = subtotal + deliveryFee;

  // Cria o pedido no banco
  const order = await createWhatsAppOrder({
    phone: conv.phone,
    name: conv.name,
    cart: conv.cart,
    orderType: conv.orderType || "PICKUP",
    address: conv.address,
    tableNumber: conv.tableNumber,
    deliveryFee,
  });

  conv.orderId = order.orderId;

  // Gera PIX
  try {
    const pix = await createPixPayment({
      amount: total,
      description: `Pedido #${order.orderNumber}`,
      orderId: order.orderId,
      orderNumber: order.orderNumber,
    });

    conv.paymentId = pix.paymentId;
    conv.state = "PAYMENT";

    let msg = `*Resumo do pedido #${order.orderNumber}*\n\n`;
    msg += summary;
    if (deliveryFee > 0) msg += `\nTaxa de entrega: R$ ${deliveryFee.toFixed(2)}`;
    msg += `\n\n*Total: R$ ${total.toFixed(2)}*`;
    msg += `\n\n---\n\n`;
    msg += `Pague via PIX:\n\n`;
    msg += `Copie o codigo abaixo:\n\`\`\`\n${pix.qrCode}\n\`\`\``;
    msg += `\n\nDepois de pagar, manda *paguei* aqui.`;
    msg += `\n\nAcompanhe pelo site: ${process.env.NEXT_PUBLIC_APP_URL}/meus-pedidos/${order.orderNumber}`;

    await sendText(conv.phone, msg);
  } catch (error) {
    // Se Mercado Pago nao ta configurado, cria pedido como pendente
    console.error("[whatsapp] PIX error:", error);
    conv.state = "CONFIRMED";

    let msg = `*Pedido #${order.orderNumber} recebido!*\n\n`;
    msg += summary;
    msg += `\n\n*Total: R$ ${total.toFixed(2)}*`;
    msg += `\n\nPagamento sera combinado na entrega/retirada.`;
    msg += `\nVoce vai receber atualizacoes aqui!`;
    msg += `\n\nAcompanhe pelo site: ${process.env.NEXT_PUBLIC_APP_URL}/meus-pedidos/${order.orderNumber}`;

    await sendText(conv.phone, msg);
    conversations.delete(conv.phone);
  }
}

// ============================================================
// Notificar cliente sobre mudanca de status (chamado pela dashboard)
// ============================================================
export async function notifyOrderStatus(orderId: string, status: string) {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });

  if (!order || order.origin !== "WHATSAPP" || !order.user?.phone) return;

  const statusMessages: Record<string, string> = {
    CONFIRMED: `Pedido #${order.orderNumber} *confirmado*! Ja vamos comecar a preparar.`,
    PREPARING: `Pedido #${order.orderNumber} esta sendo *preparado*! Aguarde...`,
    READY: `Pedido #${order.orderNumber} esta *pronto*! ${order.type === "DELIVERY" ? "Saindo pra entrega." : "Pode retirar no balcao."}`,
    DELIVERING: `Pedido #${order.orderNumber} *saiu pra entrega*! Ja ja chega.`,
    DELIVERED: `Pedido #${order.orderNumber} *entregue*! Obrigado por pedir no Boteco da Estacao!`,
    CANCELLED: `Pedido #${order.orderNumber} foi *cancelado*. Se tiver duvida, chama a gente.`,
  };

  const message = statusMessages[status];
  if (message) {
    await sendText(order.user.phone, message);
  }
}
