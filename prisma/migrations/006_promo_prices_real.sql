-- Migration 006: Promo prices nos produtos REAIS
-- Roda no SQL Editor do Supabase

-- Burgers com desconto (os mais populares)
UPDATE "Product" SET "promoPrice" = 27.90 WHERE "slug" = 'classic-burguer' AND "promoPrice" IS NULL;
UPDATE "Product" SET "promoPrice" = 31.90 WHERE "slug" = 'cheddar-burguer' AND "promoPrice" IS NULL;
UPDATE "Product" SET "promoPrice" = 33.90 WHERE "slug" = 'bacon-burguer' AND "promoPrice" IS NULL;

-- Porcoes com desconto
UPDATE "Product" SET "promoPrice" = 23.90 WHERE "slug" = 'coxinha-catupiry' AND "promoPrice" IS NULL;
UPDATE "Product" SET "promoPrice" = 29.90 WHERE "slug" = 'fritas-cheddar-bacon' AND "promoPrice" IS NULL;

-- Drinks
UPDATE "Product" SET "promoPrice" = 11.90 WHERE "slug" = 'chopp-pilsen-500ml' AND "promoPrice" IS NULL;
UPDATE "Product" SET "promoPrice" = 22.90 WHERE "slug" = 'caipirinha-limao' AND "promoPrice" IS NULL;

-- Combos
UPDATE "Product" SET "promoPrice" = 59.90 WHERE "slug" = 'combo-casal' AND "promoPrice" IS NULL;
UPDATE "Product" SET "promoPrice" = 89.90 WHERE "slug" = 'combo-amigos' AND "promoPrice" IS NULL;

-- Verificar resultado
SELECT "slug", "name", "basePrice", "promoPrice"
FROM "Product"
WHERE "promoPrice" IS NOT NULL
ORDER BY "slug";
