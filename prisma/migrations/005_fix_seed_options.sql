-- Migration 005: Re-seed product options (safe to run multiple times)
-- Limpa e recria tudo pra garantir

-- Limpar opcoes anteriores (se existirem)
DELETE FROM "ProductOptionChoice";
DELETE FROM "ProductOptionGroup";

-- ============================================================
-- PROMO PRICES
-- ============================================================
UPDATE "Product" SET "promoPrice" = 27.90 WHERE "slug" = 'smash-classico';
UPDATE "Product" SET "promoPrice" = 23.90 WHERE "slug" = 'coxinha-catupiry';
UPDATE "Product" SET "promoPrice" = 69.90 WHERE "slug" = 'combo-casal';
UPDATE "Product" SET "promoPrice" = 11.90 WHERE "slug" = 'chopp-pilsen';

-- ============================================================
-- INGREDIENTS
-- ============================================================
UPDATE "Product" SET "ingredients" = 'Pao brioche, blend bovino 160g, queijo cheddar, cebola caramelizada, molho especial' WHERE "slug" = 'smash-classico';
UPDATE "Product" SET "ingredients" = 'Pao brioche, blend bovino 160g, bacon crocante, queijo cheddar, cebola crispy, molho barbecue' WHERE "slug" = 'smash-bacon';
UPDATE "Product" SET "ingredients" = 'Pao brioche, blend bovino 160g, alface, tomate, cebola roxa, maionese da casa' WHERE "slug" = 'smash-salada';
UPDATE "Product" SET "ingredients" = 'Pao brioche, blend bovino 160g, bacon, ovo, presunto, queijo, alface, tomate, milho, batata palha, todos os molhos' WHERE "slug" = 'x-tudo-estacao';

-- ============================================================
-- HELPER: Funcao pra criar grupo + opcoes de uma vez
-- ============================================================

DO $$
DECLARE
  v_product_id TEXT;
  v_group_id TEXT;
BEGIN

  -- ========================================================
  -- HAMBURGUERES: Tipo do pao + Ponto da carne + Retirar
  -- ========================================================
  FOR v_product_id IN
    SELECT id FROM "Product" WHERE slug IN ('smash-classico', 'smash-bacon', 'smash-salada', 'x-tudo-estacao')
  LOOP
    -- TIPO DO PAO (obrigatorio, radio)
    v_group_id := gen_random_uuid()::text;
    INSERT INTO "ProductOptionGroup" (id, "productId", name, required, "maxChoices", "sortOrder")
    VALUES (v_group_id, v_product_id, 'Tipo do pao', true, 1, 1);

    INSERT INTO "ProductOptionChoice" (id, "groupId", name, "priceModifier", "isDefault", "sortOrder") VALUES
      (gen_random_uuid()::text, v_group_id, 'Pao Brioche', 0, true, 1),
      (gen_random_uuid()::text, v_group_id, 'Pao Australiano', 2.00, false, 2),
      (gen_random_uuid()::text, v_group_id, 'Pao Integral', 1.50, false, 3),
      (gen_random_uuid()::text, v_group_id, 'Sem pao (na bandeja)', 0, false, 4);

    -- PONTO DA CARNE (obrigatorio, radio)
    v_group_id := gen_random_uuid()::text;
    INSERT INTO "ProductOptionGroup" (id, "productId", name, required, "maxChoices", "sortOrder")
    VALUES (v_group_id, v_product_id, 'Ponto da carne', true, 1, 2);

    INSERT INTO "ProductOptionChoice" (id, "groupId", name, "priceModifier", "isDefault", "sortOrder") VALUES
      (gen_random_uuid()::text, v_group_id, 'Mal passado', 0, false, 1),
      (gen_random_uuid()::text, v_group_id, 'Ao ponto', 0, true, 2),
      (gen_random_uuid()::text, v_group_id, 'Bem passado', 0, false, 3);

    -- RETIRAR INGREDIENTES (opcional, checkbox max 5)
    v_group_id := gen_random_uuid()::text;
    INSERT INTO "ProductOptionGroup" (id, "productId", name, required, "maxChoices", "sortOrder")
    VALUES (v_group_id, v_product_id, 'Retirar ingredientes', false, 5, 3);

    INSERT INTO "ProductOptionChoice" (id, "groupId", name, "priceModifier", "isDefault", "sortOrder") VALUES
      (gen_random_uuid()::text, v_group_id, 'Sem cebola', 0, false, 1),
      (gen_random_uuid()::text, v_group_id, 'Sem molho', 0, false, 2),
      (gen_random_uuid()::text, v_group_id, 'Sem picles', 0, false, 3),
      (gen_random_uuid()::text, v_group_id, 'Sem tomate', 0, false, 4),
      (gen_random_uuid()::text, v_group_id, 'Sem alface', 0, false, 5);

  END LOOP;

  -- ========================================================
  -- PORCOES: Escolher molho
  -- ========================================================
  FOR v_product_id IN
    SELECT id FROM "Product" WHERE slug IN ('coxinha-catupiry', 'provolone-empanado', 'fritas-cheddar-bacon', 'isca-de-frango')
  LOOP
    v_group_id := gen_random_uuid()::text;
    INSERT INTO "ProductOptionGroup" (id, "productId", name, required, "maxChoices", "sortOrder")
    VALUES (v_group_id, v_product_id, 'Escolha o molho', false, 2, 1);

    INSERT INTO "ProductOptionChoice" (id, "groupId", name, "priceModifier", "isDefault", "sortOrder") VALUES
      (gen_random_uuid()::text, v_group_id, 'Ketchup', 0, false, 1),
      (gen_random_uuid()::text, v_group_id, 'Maionese temperada', 1.50, false, 2),
      (gen_random_uuid()::text, v_group_id, 'Barbecue', 1.50, false, 3),
      (gen_random_uuid()::text, v_group_id, 'Geleia de pimenta', 2.00, false, 4),
      (gen_random_uuid()::text, v_group_id, 'Mostarda e mel', 1.50, false, 5);

  END LOOP;

  -- ========================================================
  -- DRINKS: Escolher gelo
  -- ========================================================
  FOR v_product_id IN
    SELECT id FROM "Product" WHERE slug IN ('caipirinha-limao', 'moscow-mule')
  LOOP
    v_group_id := gen_random_uuid()::text;
    INSERT INTO "ProductOptionGroup" (id, "productId", name, required, "maxChoices", "sortOrder")
    VALUES (v_group_id, v_product_id, 'Preferencia', false, 1, 1);

    INSERT INTO "ProductOptionChoice" (id, "groupId", name, "priceModifier", "isDefault", "sortOrder") VALUES
      (gen_random_uuid()::text, v_group_id, 'Normal', 0, true, 1),
      (gen_random_uuid()::text, v_group_id, 'Menos gelo', 0, false, 2),
      (gen_random_uuid()::text, v_group_id, 'Sem gelo', 0, false, 3);

  END LOOP;

  -- ========================================================
  -- COMBOS: Escolher refrigerante
  -- ========================================================
  FOR v_product_id IN
    SELECT id FROM "Product" WHERE slug IN ('combo-casal', 'combo-amigos')
  LOOP
    v_group_id := gen_random_uuid()::text;
    INSERT INTO "ProductOptionGroup" (id, "productId", name, required, "maxChoices", "sortOrder")
    VALUES (v_group_id, v_product_id, 'Refrigerante do combo', true, 1, 1);

    INSERT INTO "ProductOptionChoice" (id, "groupId", name, "priceModifier", "isDefault", "sortOrder") VALUES
      (gen_random_uuid()::text, v_group_id, 'Coca-Cola', 0, true, 1),
      (gen_random_uuid()::text, v_group_id, 'Guarana Antarctica', 0, false, 2),
      (gen_random_uuid()::text, v_group_id, 'Sprite', 0, false, 3),
      (gen_random_uuid()::text, v_group_id, 'Fanta Laranja', 0, false, 4);

  END LOOP;

  -- ========================================================
  -- CERVEJAS: Temperatura
  -- ========================================================
  FOR v_product_id IN
    SELECT id FROM "Product" WHERE slug IN ('chopp-pilsen', 'heineken-long-neck', 'brahma-600ml')
  LOOP
    v_group_id := gen_random_uuid()::text;
    INSERT INTO "ProductOptionGroup" (id, "productId", name, required, "maxChoices", "sortOrder")
    VALUES (v_group_id, v_product_id, 'Preferencia', false, 1, 1);

    INSERT INTO "ProductOptionChoice" (id, "groupId", name, "priceModifier", "isDefault", "sortOrder") VALUES
      (gen_random_uuid()::text, v_group_id, 'Bem gelada', 0, true, 1),
      (gen_random_uuid()::text, v_group_id, 'Natural', 0, false, 2);

  END LOOP;

  -- ========================================================
  -- REFRIGERANTES: Sem opcoes especiais, mas adicional de limao
  -- ========================================================
  FOR v_product_id IN
    SELECT id FROM "Product" WHERE slug IN ('coca-cola-350ml', 'guarana-antarctica-350ml')
  LOOP
    v_group_id := gen_random_uuid()::text;
    INSERT INTO "ProductOptionGroup" (id, "productId", name, required, "maxChoices", "sortOrder")
    VALUES (v_group_id, v_product_id, 'Extras', false, 2, 1);

    INSERT INTO "ProductOptionChoice" (id, "groupId", name, "priceModifier", "isDefault", "sortOrder") VALUES
      (gen_random_uuid()::text, v_group_id, 'Com limao', 0, false, 1),
      (gen_random_uuid()::text, v_group_id, 'Com gelo no copo', 0, false, 2);

  END LOOP;

END $$;

-- Verificar resultado
SELECT
  (SELECT COUNT(*) FROM "ProductOptionGroup") as grupos,
  (SELECT COUNT(*) FROM "ProductOptionChoice") as opcoes;
