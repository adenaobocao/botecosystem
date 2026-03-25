-- Migration: Add product options, delivery zones, promo pricing, ingredients
-- Run this in Supabase SQL Editor

-- 1. Add new columns to Product
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "promoPrice" DECIMAL(10,2);
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "ingredients" TEXT;

-- 2. ProductOptionGroup
CREATE TABLE IF NOT EXISTS "ProductOptionGroup" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "required" BOOLEAN NOT NULL DEFAULT false,
  "maxChoices" INTEGER NOT NULL DEFAULT 1,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "ProductOptionGroup_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ProductOptionGroup_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "ProductOptionGroup_productId_idx" ON "ProductOptionGroup"("productId");

-- 3. ProductOptionChoice
CREATE TABLE IF NOT EXISTS "ProductOptionChoice" (
  "id" TEXT NOT NULL,
  "groupId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "priceModifier" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "ProductOptionChoice_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ProductOptionChoice_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ProductOptionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "ProductOptionChoice_groupId_idx" ON "ProductOptionChoice"("groupId");

-- 4. DeliveryZone
CREATE TABLE IF NOT EXISTS "DeliveryZone" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "fee" DECIMAL(10,2) NOT NULL,
  "estimatedMin" INTEGER NOT NULL DEFAULT 40,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "DeliveryZone_pkey" PRIMARY KEY ("id")
);

-- 5. DeliveryNeighborhood
CREATE TABLE IF NOT EXISTS "DeliveryNeighborhood" (
  "id" TEXT NOT NULL,
  "zoneId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  CONSTRAINT "DeliveryNeighborhood_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "DeliveryNeighborhood_name_key" UNIQUE ("name"),
  CONSTRAINT "DeliveryNeighborhood_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "DeliveryZone"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "DeliveryNeighborhood_zoneId_idx" ON "DeliveryNeighborhood"("zoneId");

-- 6. Seed delivery zones for Ponta Grossa
INSERT INTO "DeliveryZone" ("id", "name", "fee", "estimatedMin", "isActive") VALUES
  ('zone_centro', 'Centro', 5.00, 25, true),
  ('zone_olarias', 'Olarias / Estrela', 5.00, 20, true),
  ('zone_uvaranas', 'Uvaranas', 8.00, 35, true),
  ('zone_oficinas', 'Oficinas / Ronda', 8.00, 35, true),
  ('zone_nova_russia', 'Nova Russia / Jardim Carvalho', 10.00, 40, true),
  ('zone_contorno', 'Contorno / Boa Vista', 12.00, 45, true)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "DeliveryNeighborhood" ("id", "zoneId", "name") VALUES
  -- Centro
  ('nb_centro', 'zone_centro', 'Centro'),
  ('nb_riachuelo', 'zone_centro', 'Riachuelo'),
  -- Olarias / Estrela
  ('nb_olarias', 'zone_olarias', 'Olarias'),
  ('nb_estrela', 'zone_olarias', 'Estrela'),
  ('nb_colonia_dona_luiza', 'zone_olarias', 'Colonia Dona Luiza'),
  -- Uvaranas
  ('nb_uvaranas', 'zone_uvaranas', 'Uvaranas'),
  ('nb_cara_cara', 'zone_uvaranas', 'Cara-Cara'),
  ('nb_jardim_america', 'zone_uvaranas', 'Jardim America'),
  -- Oficinas / Ronda
  ('nb_oficinas', 'zone_oficinas', 'Oficinas'),
  ('nb_ronda', 'zone_oficinas', 'Ronda'),
  ('nb_chapada', 'zone_oficinas', 'Chapada'),
  -- Nova Russia / Jardim Carvalho
  ('nb_nova_russia', 'zone_nova_russia', 'Nova Russia'),
  ('nb_jardim_carvalho', 'zone_nova_russia', 'Jardim Carvalho'),
  ('nb_neves', 'zone_nova_russia', 'Neves'),
  -- Contorno / Boa Vista
  ('nb_contorno', 'zone_contorno', 'Contorno'),
  ('nb_boa_vista', 'zone_contorno', 'Boa Vista'),
  ('nb_colonia_murici', 'zone_contorno', 'Colonia Murici')
ON CONFLICT ("name") DO NOTHING;
