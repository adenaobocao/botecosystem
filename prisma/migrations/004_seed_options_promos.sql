-- Migration: Seed product option groups + promo prices
-- Run this in Supabase SQL Editor AFTER 003

-- ============================================================
-- 1. PROMO PRICES — alguns produtos com desconto
-- ============================================================

-- Smash Classico: de 32.90 por 27.90
UPDATE "Product" SET "promoPrice" = 27.90 WHERE "slug" = 'smash-classico';

-- Coxinha de Catupiry: de 28.90 por 23.90
UPDATE "Product" SET "promoPrice" = 23.90 WHERE "slug" = 'coxinha-catupiry';

-- Combo Casal: de 79.90 por 69.90
UPDATE "Product" SET "promoPrice" = 69.90 WHERE "slug" = 'combo-casal';

-- Chopp Pilsen: de 14.90 por 11.90
UPDATE "Product" SET "promoPrice" = 11.90 WHERE "slug" = 'chopp-pilsen';

-- ============================================================
-- 2. INGREDIENTS — ingredientes nos hamburgueres
-- ============================================================

UPDATE "Product" SET "ingredients" = 'Pao brioche, blend bovino 160g, queijo cheddar, cebola caramelizada, molho especial'
WHERE "slug" = 'smash-classico';

UPDATE "Product" SET "ingredients" = 'Pao brioche, blend bovino 160g, bacon crocante, queijo cheddar, cebola crispy, molho barbecue'
WHERE "slug" = 'smash-bacon';

UPDATE "Product" SET "ingredients" = 'Pao brioche, blend bovino 160g, alface, tomate, cebola roxa, maionese da casa'
WHERE "slug" = 'smash-salada';

UPDATE "Product" SET "ingredients" = 'Pao brioche, blend bovino 160g, bacon, ovo, presunto, queijo, alface, tomate, milho, batata palha, todos os molhos'
WHERE "slug" = 'x-tudo-estacao';

-- ============================================================
-- 3. OPTION GROUPS — tipo do pao, ponto da carne, retirar itens
-- ============================================================

-- Funcao helper pra gerar IDs tipo cuid
-- Vamos usar IDs fixos pra facilitar

-- ===== TIPO DO PAO (hamburgueres) =====
-- Preciso criar um grupo por produto

-- Smash Classico
INSERT INTO "ProductOptionGroup" ("id", "productId", "name", "required", "maxChoices", "sortOrder")
SELECT 'og_pao_' || "id", "id", 'Tipo do pao', true, 1, 1
FROM "Product" WHERE "slug" = 'smash-classico'
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_brioche_' || p."id", 'og_pao_' || p."id", 'Pao Brioche', 0, true, 1
FROM "Product" p WHERE p."slug" = 'smash-classico'
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_australiano_' || p."id", 'og_pao_' || p."id", 'Pao Australiano', 2.00, false, 2
FROM "Product" p WHERE p."slug" = 'smash-classico'
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_integral_' || p."id", 'og_pao_' || p."id", 'Pao Integral', 1.50, false, 3
FROM "Product" p WHERE p."slug" = 'smash-classico'
ON CONFLICT ("id") DO NOTHING;

-- Smash Bacon
INSERT INTO "ProductOptionGroup" ("id", "productId", "name", "required", "maxChoices", "sortOrder")
SELECT 'og_pao_' || "id", "id", 'Tipo do pao', true, 1, 1
FROM "Product" WHERE "slug" = 'smash-bacon'
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_brioche_' || p."id", 'og_pao_' || p."id", 'Pao Brioche', 0, true, 1
FROM "Product" p WHERE p."slug" = 'smash-bacon'
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_australiano_' || p."id", 'og_pao_' || p."id", 'Pao Australiano', 2.00, false, 2
FROM "Product" p WHERE p."slug" = 'smash-bacon'
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_integral_' || p."id", 'og_pao_' || p."id", 'Pao Integral', 1.50, false, 3
FROM "Product" p WHERE p."slug" = 'smash-bacon'
ON CONFLICT ("id") DO NOTHING;

-- Smash Salada
INSERT INTO "ProductOptionGroup" ("id", "productId", "name", "required", "maxChoices", "sortOrder")
SELECT 'og_pao_' || "id", "id", 'Tipo do pao', true, 1, 1
FROM "Product" WHERE "slug" = 'smash-salada'
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_brioche_' || p."id", 'og_pao_' || p."id", 'Pao Brioche', 0, true, 1
FROM "Product" p WHERE p."slug" = 'smash-salada'
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_australiano_' || p."id", 'og_pao_' || p."id", 'Pao Australiano', 2.00, false, 2
FROM "Product" p WHERE p."slug" = 'smash-salada'
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_integral_' || p."id", 'og_pao_' || p."id", 'Pao Integral', 1.50, false, 3
FROM "Product" p WHERE p."slug" = 'smash-salada'
ON CONFLICT ("id") DO NOTHING;

-- X-Tudo Estacao
INSERT INTO "ProductOptionGroup" ("id", "productId", "name", "required", "maxChoices", "sortOrder")
SELECT 'og_pao_' || "id", "id", 'Tipo do pao', true, 1, 1
FROM "Product" WHERE "slug" = 'x-tudo-estacao'
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_brioche_' || p."id", 'og_pao_' || p."id", 'Pao Brioche', 0, true, 1
FROM "Product" p WHERE p."slug" = 'x-tudo-estacao'
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_australiano_' || p."id", 'og_pao_' || p."id", 'Pao Australiano', 2.00, false, 2
FROM "Product" p WHERE p."slug" = 'x-tudo-estacao'
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_integral_' || p."id", 'og_pao_' || p."id", 'Pao Integral', 1.50, false, 3
FROM "Product" p WHERE p."slug" = 'x-tudo-estacao'
ON CONFLICT ("id") DO NOTHING;

-- ===== PONTO DA CARNE (hamburgueres) =====

INSERT INTO "ProductOptionGroup" ("id", "productId", "name", "required", "maxChoices", "sortOrder")
SELECT 'og_ponto_' || "id", "id", 'Ponto da carne', true, 1, 2
FROM "Product" WHERE "slug" IN ('smash-classico', 'smash-bacon', 'smash-salada', 'x-tudo-estacao')
ON CONFLICT ("id") DO NOTHING;

-- Opcoes de ponto para cada hamburguer
INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_mal_' || p."id", 'og_ponto_' || p."id", 'Mal passado', 0, false, 1
FROM "Product" p WHERE p."slug" IN ('smash-classico', 'smash-bacon', 'smash-salada', 'x-tudo-estacao')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_medio_' || p."id", 'og_ponto_' || p."id", 'Ao ponto', 0, true, 2
FROM "Product" p WHERE p."slug" IN ('smash-classico', 'smash-bacon', 'smash-salada', 'x-tudo-estacao')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_bem_' || p."id", 'og_ponto_' || p."id", 'Bem passado', 0, false, 3
FROM "Product" p WHERE p."slug" IN ('smash-classico', 'smash-bacon', 'smash-salada', 'x-tudo-estacao')
ON CONFLICT ("id") DO NOTHING;

-- ===== RETIRAR INGREDIENTES (hamburgueres) - checkbox, max 3 =====

INSERT INTO "ProductOptionGroup" ("id", "productId", "name", "required", "maxChoices", "sortOrder")
SELECT 'og_retirar_' || "id", "id", 'Retirar ingredientes', false, 3, 3
FROM "Product" WHERE "slug" IN ('smash-classico', 'smash-bacon', 'smash-salada', 'x-tudo-estacao')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_sem_cebola_' || p."id", 'og_retirar_' || p."id", 'Sem cebola', 0, false, 1
FROM "Product" p WHERE p."slug" IN ('smash-classico', 'smash-bacon', 'smash-salada', 'x-tudo-estacao')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_sem_molho_' || p."id", 'og_retirar_' || p."id", 'Sem molho', 0, false, 2
FROM "Product" p WHERE p."slug" IN ('smash-classico', 'smash-bacon', 'smash-salada', 'x-tudo-estacao')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_sem_picles_' || p."id", 'og_retirar_' || p."id", 'Sem picles', 0, false, 3
FROM "Product" p WHERE p."slug" IN ('smash-classico', 'smash-bacon', 'smash-salada', 'x-tudo-estacao')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_sem_tomate_' || p."id", 'og_retirar_' || p."id", 'Sem tomate', 0, false, 4
FROM "Product" p WHERE p."slug" IN ('smash-classico', 'smash-bacon', 'smash-salada', 'x-tudo-estacao')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_sem_alface_' || p."id", 'og_retirar_' || p."id", 'Sem alface', 0, false, 5
FROM "Product" p WHERE p."slug" IN ('smash-classico', 'smash-bacon', 'smash-salada', 'x-tudo-estacao')
ON CONFLICT ("id") DO NOTHING;

-- ===== MOLHO EXTRA (porcoes) - opcional, max 2 =====

INSERT INTO "ProductOptionGroup" ("id", "productId", "name", "required", "maxChoices", "sortOrder")
SELECT 'og_molho_' || "id", "id", 'Molho extra', false, 2, 1
FROM "Product" WHERE "slug" IN ('coxinha-catupiry', 'provolone-empanado', 'fritas-cheddar-bacon', 'isca-de-frango')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_ketchup_' || p."id", 'og_molho_' || p."id", 'Ketchup', 0, false, 1
FROM "Product" p WHERE p."slug" IN ('coxinha-catupiry', 'provolone-empanado', 'fritas-cheddar-bacon', 'isca-de-frango')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_maionese_' || p."id", 'og_molho_' || p."id", 'Maionese temperada', 1.50, false, 2
FROM "Product" p WHERE p."slug" IN ('coxinha-catupiry', 'provolone-empanado', 'fritas-cheddar-bacon', 'isca-de-frango')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_bbq_' || p."id", 'og_molho_' || p."id", 'Barbecue', 1.50, false, 3
FROM "Product" p WHERE p."slug" IN ('coxinha-catupiry', 'provolone-empanado', 'fritas-cheddar-bacon', 'isca-de-frango')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOptionChoice" ("id", "groupId", "name", "priceModifier", "isDefault", "sortOrder")
SELECT 'oc_pimenta_' || p."id", 'og_molho_' || p."id", 'Geleia de pimenta', 2.00, false, 4
FROM "Product" p WHERE p."slug" IN ('coxinha-catupiry', 'provolone-empanado', 'fritas-cheddar-bacon', 'isca-de-frango')
ON CONFLICT ("id") DO NOTHING;

-- Done!
SELECT 'Migration 004 completed: ' || COUNT(*) || ' option groups, ' ||
  (SELECT COUNT(*) FROM "ProductOptionChoice") || ' choices created'
FROM "ProductOptionGroup";
