import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@botecodaestacao.com.br" },
    update: {},
    create: {
      name: "Admin Boteco",
      email: "admin@botecodaestacao.com.br",
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log(`Admin: ${admin.email}`);

  // Categorias
  const categorias = await Promise.all([
    prisma.category.upsert({
      where: { slug: "hamburgueres" },
      update: {},
      create: {
        name: "Hamburgueres",
        slug: "hamburgueres",
        description: "Hamburgueres artesanais com blend exclusivo",
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "porcoes" },
      update: {},
      create: {
        name: "Porcoes",
        slug: "porcoes",
        description: "Porcoes generosas pra dividir com os amigos",
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "cervejas" },
      update: {},
      create: {
        name: "Cervejas",
        slug: "cervejas",
        description: "Cervejas geladas de todas as marcas",
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "drinks" },
      update: {},
      create: {
        name: "Drinks",
        slug: "drinks",
        description: "Drinks e coqueteis da casa",
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: "refrigerantes" },
      update: {},
      create: {
        name: "Refrigerantes",
        slug: "refrigerantes",
        description: "Refrigerantes e sucos",
        sortOrder: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: "combos" },
      update: {},
      create: {
        name: "Combos",
        slug: "combos",
        description: "Combos com desconto especial",
        sortOrder: 6,
      },
    }),
  ]);

  const [hamburgueres, porcoes, cervejas, drinks, refrigerantes, combos] =
    categorias;

  console.log(`Categorias: ${categorias.length}`);

  // Produtos — baseados no cardapio real do Boteco da Estacao
  const produtos = await Promise.all([
    // Hamburgueres
    prisma.product.upsert({
      where: { slug: "smash-classico" },
      update: {},
      create: {
        name: "Smash Classico",
        slug: "smash-classico",
        description:
          "Pao brioche, 2 smash burgers 80g, queijo cheddar, cebola caramelizada, molho especial",
        categoryId: hamburgueres.id,
        basePrice: 32.9,
        isFeatured: true,
        preparationTime: 15,
      },
    }),
    prisma.product.upsert({
      where: { slug: "smash-bacon" },
      update: {},
      create: {
        name: "Smash Bacon",
        slug: "smash-bacon",
        description:
          "Pao brioche, 2 smash burgers 80g, bacon crocante, queijo cheddar, cebola crispy, molho barbecue",
        categoryId: hamburgueres.id,
        basePrice: 36.9,
        isFeatured: true,
        preparationTime: 15,
      },
    }),
    prisma.product.upsert({
      where: { slug: "smash-salada" },
      update: {},
      create: {
        name: "Smash Salada",
        slug: "smash-salada",
        description:
          "Pao brioche, 2 smash burgers 80g, alface, tomate, cebola roxa, maionese da casa",
        categoryId: hamburgueres.id,
        basePrice: 34.9,
        preparationTime: 15,
      },
    }),
    prisma.product.upsert({
      where: { slug: "x-tudo-estacao" },
      update: {},
      create: {
        name: "X-Tudo Estacao",
        slug: "x-tudo-estacao",
        description:
          "Pao brioche, 2 smash burgers 80g, bacon, ovo, presunto, queijo, alface, tomate, milho, batata palha, todos os molhos",
        categoryId: hamburgueres.id,
        basePrice: 42.9,
        isFeatured: true,
        preparationTime: 20,
      },
    }),

    // Porcoes
    prisma.product.upsert({
      where: { slug: "coxinha-catupiry" },
      update: {},
      create: {
        name: "Coxinha de Catupiry",
        slug: "coxinha-catupiry",
        description: "6 unidades de coxinha crocante com catupiry cremoso",
        categoryId: porcoes.id,
        basePrice: 28.9,
        isFeatured: true,
        preparationTime: 10,
      },
    }),
    prisma.product.upsert({
      where: { slug: "provolone-empanado" },
      update: {},
      create: {
        name: "Provolone Empanado",
        slug: "provolone-empanado",
        description:
          "Fatias de provolone empanadas e fritas, acompanha geleia de pimenta",
        categoryId: porcoes.id,
        basePrice: 34.9,
        preparationTime: 10,
      },
    }),
    prisma.product.upsert({
      where: { slug: "fritas-cheddar-bacon" },
      update: {},
      create: {
        name: "Fritas Cheddar & Bacon",
        slug: "fritas-cheddar-bacon",
        description:
          "Porcao generosa de fritas cobertas com cheddar cremoso e bacon crocante",
        categoryId: porcoes.id,
        basePrice: 32.9,
        isFeatured: true,
        preparationTime: 12,
      },
    }),
    prisma.product.upsert({
      where: { slug: "isca-de-frango" },
      update: {},
      create: {
        name: "Isca de Frango",
        slug: "isca-de-frango",
        description: "Iscas de frango empanadas com molho de alho",
        categoryId: porcoes.id,
        basePrice: 29.9,
        preparationTime: 12,
      },
    }),

    // Cervejas
    prisma.product.upsert({
      where: { slug: "chopp-pilsen" },
      update: {},
      create: {
        name: "Chopp Pilsen",
        slug: "chopp-pilsen",
        description: "Chopp artesanal da casa, 500ml, gelado na temperatura certa",
        categoryId: cervejas.id,
        basePrice: 14.9,
        isFeatured: true,
        preparationTime: 2,
      },
    }),
    prisma.product.upsert({
      where: { slug: "heineken-long-neck" },
      update: {},
      create: {
        name: "Heineken Long Neck",
        slug: "heineken-long-neck",
        description: "Heineken 330ml gelada",
        categoryId: cervejas.id,
        basePrice: 12.9,
        preparationTime: 1,
      },
    }),
    prisma.product.upsert({
      where: { slug: "brahma-600ml" },
      update: {},
      create: {
        name: "Brahma 600ml",
        slug: "brahma-600ml",
        description: "Cerveja Brahma garrafa 600ml",
        categoryId: cervejas.id,
        basePrice: 15.9,
        preparationTime: 1,
      },
    }),

    // Drinks
    prisma.product.upsert({
      where: { slug: "caipirinha-limao" },
      update: {},
      create: {
        name: "Caipirinha de Limao",
        slug: "caipirinha-limao",
        description: "Caipirinha classica com limao tahiti, acucar e cachaca artesanal",
        categoryId: drinks.id,
        basePrice: 18.9,
        preparationTime: 5,
      },
    }),
    prisma.product.upsert({
      where: { slug: "moscow-mule" },
      update: {},
      create: {
        name: "Moscow Mule",
        slug: "moscow-mule",
        description: "Vodka, espuma de gengibre, limao siciliano e agua tonica",
        categoryId: drinks.id,
        basePrice: 24.9,
        isFeatured: true,
        preparationTime: 5,
      },
    }),

    // Refrigerantes
    prisma.product.upsert({
      where: { slug: "coca-cola-350ml" },
      update: {},
      create: {
        name: "Coca-Cola 350ml",
        slug: "coca-cola-350ml",
        description: "Coca-Cola lata 350ml gelada",
        categoryId: refrigerantes.id,
        basePrice: 7.9,
        preparationTime: 1,
      },
    }),
    prisma.product.upsert({
      where: { slug: "guarana-antarctica-350ml" },
      update: {},
      create: {
        name: "Guarana Antarctica 350ml",
        slug: "guarana-antarctica-350ml",
        description: "Guarana Antarctica lata 350ml gelada",
        categoryId: refrigerantes.id,
        basePrice: 7.9,
        preparationTime: 1,
      },
    }),

    // Combos
    prisma.product.upsert({
      where: { slug: "combo-casal" },
      update: {},
      create: {
        name: "Combo Casal",
        slug: "combo-casal",
        description:
          "2 Smash Classicos + 1 Porcao de Fritas Cheddar & Bacon + 2 Coca-Cola 350ml",
        categoryId: combos.id,
        basePrice: 79.9,
        isFeatured: true,
        preparationTime: 20,
      },
    }),
    prisma.product.upsert({
      where: { slug: "combo-amigos" },
      update: {},
      create: {
        name: "Combo Amigos",
        slug: "combo-amigos",
        description:
          "4 Smash Classicos + 1 Coxinha de Catupiry + 1 Fritas Cheddar & Bacon + 4 Cervejas",
        categoryId: combos.id,
        basePrice: 159.9,
        preparationTime: 25,
      },
    }),
  ]);

  console.log(`Produtos: ${produtos.length}`);

  // Variantes para hamburgueres
  const hamburguerProducts = produtos.filter((p) =>
    ["smash-classico", "smash-bacon", "smash-salada", "x-tudo-estacao"].includes(
      p.slug
    )
  );

  for (const burger of hamburguerProducts) {
    await prisma.productVariant.createMany({
      skipDuplicates: true,
      data: [
        {
          productId: burger.id,
          name: "Adicional: Bacon extra",
          priceModifier: 5.0,
        },
        {
          productId: burger.id,
          name: "Adicional: Ovo",
          priceModifier: 3.0,
        },
        {
          productId: burger.id,
          name: "Adicional: Cheddar extra",
          priceModifier: 4.0,
        },
      ],
    });
  }

  console.log("Variantes de hamburgueres criadas");

  // Cupons de teste
  await prisma.coupon.upsert({
    where: { code: "BEMVINDO10" },
    update: {},
    create: {
      code: "BEMVINDO10",
      type: "PERCENTAGE",
      value: 10,
      minOrderValue: 40,
      maxUses: 100,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 dias
    },
  });

  await prisma.coupon.upsert({
    where: { code: "FRETE0" },
    update: {},
    create: {
      code: "FRETE0",
      type: "FIXED",
      value: 8,
      minOrderValue: 60,
      maxUses: 50,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
    },
  });

  console.log("Cupons de teste criados");
  console.log("Seed concluido com sucesso!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
