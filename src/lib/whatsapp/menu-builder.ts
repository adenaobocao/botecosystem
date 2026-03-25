// Formata cardapio em texto WhatsApp (formatacao Markdown do WhatsApp)

import { db } from "@/lib/db";

// ============================================================
// Menu de categorias
// ============================================================
export async function buildCategoryMenu(): Promise<string> {
  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { products: { where: { isAvailable: true } } } },
    },
  });

  let msg = "*CARDAPIO — Boteco da Estacao*\n\n";

  categories.forEach((cat, i) => {
    msg += `*${i + 1}* — ${cat.name} (${cat._count.products} itens)\n`;
  });

  msg += `\nManda o *numero* da categoria pra ver os produtos.`;
  msg += `\nOu me diz o que quer: _"quero um hamburguer"_`;

  return msg;
}

// ============================================================
// Lista de produtos de uma categoria
// ============================================================
export async function buildProductList(categorySlug: string): Promise<string> {
  const category = await db.category.findUnique({
    where: { slug: categorySlug },
    include: {
      products: {
        where: { isAvailable: true },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!category || category.products.length === 0) {
    return "Categoria sem produtos disponiveis no momento.";
  }

  let msg = `*${category.name.toUpperCase()}*\n\n`;

  category.products.forEach((p, i) => {
    const price = p.promoPrice ? Number(p.promoPrice) : Number(p.basePrice);
    const promo = p.promoPrice ? ` ~R$ ${Number(p.basePrice).toFixed(2)}~` : "";

    msg += `*${i + 1}* — ${p.name}\n`;
    msg += `    R$ ${price.toFixed(2)}${promo}\n`;
    if (p.description) {
      msg += `    _${p.description.substring(0, 80)}_\n`;
    }
    msg += `\n`;
  });

  msg += `Manda o *numero* do produto pra adicionar.`;
  msg += `\nManda *voltar* pra ver as categorias.`;

  return msg;
}

// ============================================================
// Opcoes de um grupo de produto
// ============================================================
export async function buildOptionsMessage(productId: string, groupId: string): Promise<string> {
  const group = await db.productOptionGroup.findUnique({
    where: { id: groupId },
    include: { options: { orderBy: { sortOrder: "asc" } } },
  });

  if (!group) return "";

  let msg = `*${group.name}*`;
  if (group.required) msg += ` (obrigatorio)`;
  if (group.maxChoices > 1) msg += ` — escolha ate ${group.maxChoices}`;
  msg += `\n\n`;

  group.options.forEach((opt, i) => {
    const price = Number(opt.priceModifier);
    const priceLabel = price > 0 ? ` (+R$ ${price.toFixed(2)})` : "";
    const defaultLabel = opt.isDefault ? " *" : "";
    msg += `*${i + 1}* — ${opt.name}${priceLabel}${defaultLabel}\n`;
  });

  msg += `\nManda o *numero* da opcao.`;
  if (!group.required) msg += ` Manda *pular* pra seguir sem escolher.`;

  return msg;
}

// ============================================================
// Resumo do carrinho
// ============================================================
export function buildCartSummary(cart: { productName: string; price: number; quantity: number; options: string[] }[]): string {
  if (cart.length === 0) return "Carrinho vazio.";

  let msg = "*Seu carrinho:*\n\n";
  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    msg += `${item.quantity}x *${item.productName}* — R$ ${itemTotal.toFixed(2)}\n`;
    if (item.options.length > 0) {
      msg += `   _${item.options.join(", ")}_\n`;
    }
  });

  msg += `\n*Subtotal: R$ ${total.toFixed(2)}*`;

  return msg;
}
