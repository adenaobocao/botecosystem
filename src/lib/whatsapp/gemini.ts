// Gemini AI — interpreta mensagens livres do WhatsApp

import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Cache de slugs pra nao consultar toda hora
let productCache: { slug: string; name: string; category: string }[] = [];
let cacheTime = 0;

async function getProductSlugs() {
  if (Date.now() - cacheTime < 5 * 60 * 1000 && productCache.length > 0) {
    return productCache;
  }

  const products = await db.product.findMany({
    where: { isAvailable: true },
    select: { slug: true, name: true, category: { select: { slug: true } } },
  });

  productCache = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category.slug,
  }));
  cacheTime = Date.now();
  return productCache;
}

export async function interpretMessage(
  text: string,
  currentState: string,
  cart: { productName: string }[]
): Promise<string> {
  // Sem API key — fallback basico
  if (!process.env.GEMINI_API_KEY) {
    return basicInterpret(text);
  }

  try {
    const products = await getProductSlugs();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Voce e o assistente do Boteco da Estacao (bar/restaurante). Interprete a mensagem do cliente e retorne APENAS uma das seguintes respostas (sem explicacao):

GREETING — se e uma saudacao
VIEW_MENU — se quer ver cardapio/menu
BACK — se quer voltar
ADD_MORE — se quer adicionar mais itens
CHECKOUT — se quer finalizar/pagar
CLEAR_CART — se quer limpar carrinho
DELIVERY — se quer entrega
PICKUP — se quer retirar
TABLE — se quer mesa
CATEGORY:{slug} — se mencionou uma categoria
PRODUCT:{slug} — se mencionou um produto especifico
UNKNOWN — se nao entendeu

Categorias e produtos disponiveis:
${products.map((p) => `${p.category} > ${p.name} (${p.slug})`).join("\n")}

Estado atual: ${currentState}
Carrinho: ${cart.map((i) => i.productName).join(", ") || "vazio"}

Mensagem do cliente: "${text}"

Responda APENAS com o codigo (ex: PRODUCT:classic-burguer ou GREETING):`;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();

    // Valida resposta
    if (response.startsWith("PRODUCT:") || response.startsWith("CATEGORY:") ||
        ["GREETING", "VIEW_MENU", "BACK", "ADD_MORE", "CHECKOUT", "CLEAR_CART",
         "DELIVERY", "PICKUP", "TABLE", "UNKNOWN"].includes(response)) {
      return response;
    }

    return "UNKNOWN";
  } catch (error) {
    console.error("[gemini] Error:", error);
    return basicInterpret(text);
  }
}

// Fallback sem AI — regex simples
function basicInterpret(text: string): string {
  const t = text.toLowerCase();

  if (["oi", "ola", "bom dia", "boa tarde", "boa noite"].some((g) => t.includes(g))) return "GREETING";
  if (["cardapio", "menu", "pedir"].some((k) => t.includes(k))) return "VIEW_MENU";
  if (t === "voltar") return "BACK";
  if (["mais", "adicionar", "outro"].some((k) => t.includes(k))) return "ADD_MORE";
  if (["finalizar", "fechar", "pagar"].some((k) => t.includes(k))) return "CHECKOUT";
  if (["limpar", "zerar"].some((k) => t.includes(k))) return "CLEAR_CART";
  if (["entrega", "entregar", "delivery"].some((k) => t.includes(k))) return "DELIVERY";
  if (["retirar", "retirada", "buscar"].some((k) => t.includes(k))) return "PICKUP";
  if (["mesa"].some((k) => t.includes(k))) return "TABLE";

  return "UNKNOWN";
}
