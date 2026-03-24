-- ============================================================
-- ADICIONAR COLUNA ORIGIN NA TABELA ORDER
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'OrderOrigin') THEN
    CREATE TYPE "OrderOrigin" AS ENUM ('SITE', 'IFOOD', 'WHATSAPP', 'TABLE');
  END IF;
END$$;

ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "origin" "OrderOrigin" NOT NULL DEFAULT 'SITE';

-- ============================================================
-- USUARIO DEMO (se nao existir)
-- ============================================================
INSERT INTO "User" (id, name, email, role, "loyaltyPoints", "createdAt", "updatedAt")
VALUES
  ('demo-client-1', 'Joao Silva', 'joao@email.com', 'CUSTOMER', 150, NOW(), NOW()),
  ('demo-client-2', 'Maria Souza', 'maria@email.com', 'CUSTOMER', 80, NOW(), NOW()),
  ('demo-client-3', 'Carlos Oliveira', 'carlos@email.com', 'CUSTOMER', 200, NOW(), NOW()),
  ('demo-client-4', 'Ana Paula Costa', 'ana@email.com', 'CUSTOMER', 50, NOW(), NOW()),
  ('demo-client-5', 'Pedro Santos', 'pedro@email.com', 'CUSTOMER', 0, NOW(), NOW()),
  ('demo-client-6', 'Fernanda Lima', 'fernanda@email.com', 'CUSTOMER', 120, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PEDIDOS SIMULADOS — HOJE
-- Variando: status, origin, type, horarios
-- ============================================================

-- Pedido 1: Site, entrega, preparando
INSERT INTO "Order" (id, "orderNumber", "userId", type, status, origin, subtotal, "deliveryFee", discount, total, notes, "estimatedTime", "createdAt", "updatedAt")
VALUES ('demo-order-1', '1001', 'demo-client-1', 'DELIVERY', 'PREPARING', 'SITE', 87.98, 8.00, 0, 95.98, NULL, 35, NOW() - INTERVAL '25 minutes', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, "unitPrice", "totalPrice", notes)
SELECT 'demo-item-1a', 'demo-order-1', p.id, 2, p."basePrice", p."basePrice" * 2, NULL
FROM "Product" p WHERE p.slug = 'house-burguer' LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, "unitPrice", "totalPrice")
SELECT 'demo-item-1b', 'demo-order-1', p.id, 1, p."basePrice", p."basePrice"
FROM "Product" p WHERE p.slug = 'batata-rustica' LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Payment" (id, "orderId", method, status, amount, "paidAt", "createdAt", "updatedAt")
VALUES ('demo-pay-1', 'demo-order-1', 'PIX', 'APPROVED', 95.98, NOW() - INTERVAL '25 minutes', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Pedido 2: iFood, entrega, confirmado
INSERT INTO "Order" (id, "orderNumber", "userId", type, status, origin, subtotal, "deliveryFee", discount, total, notes, "estimatedTime", "createdAt", "updatedAt")
VALUES ('demo-order-2', '1002', 'demo-client-2', 'DELIVERY', 'CONFIRMED', 'IFOOD', 73.98, 5.99, 0, 79.97, 'Sem cebola no lanche', 40, NOW() - INTERVAL '15 minutes', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, "unitPrice", "totalPrice", notes)
SELECT 'demo-item-2a', 'demo-order-2', p.id, 1, p."basePrice", p."basePrice", 'Sem cebola'
FROM "Product" p WHERE p.slug = 'supreme-burguer' LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, "unitPrice", "totalPrice")
SELECT 'demo-item-2b', 'demo-order-2', p.id, 1, p."basePrice", p."basePrice"
FROM "Product" p WHERE p.slug = 'onion-rings' LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Payment" (id, "orderId", method, status, amount, "paidAt", "createdAt", "updatedAt")
VALUES ('demo-pay-2', 'demo-order-2', 'CREDIT_CARD', 'APPROVED', 79.97, NOW() - INTERVAL '15 minutes', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Pedido 3: WhatsApp, retirada, pendente
INSERT INTO "Order" (id, "orderNumber", "userId", type, status, origin, subtotal, "deliveryFee", discount, total, "estimatedTime", "createdAt", "updatedAt")
VALUES ('demo-order-3', '1003', 'demo-client-3', 'PICKUP', 'PENDING', 'WHATSAPP', 41.99, 0, 0, 41.99, 25, NOW() - INTERVAL '5 minutes', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, "unitPrice", "totalPrice")
SELECT 'demo-item-3a', 'demo-order-3', p.id, 1, p."basePrice", p."basePrice"
FROM "Product" p WHERE p.slug = 'colonial-burguer' LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Payment" (id, "orderId", method, status, amount, "createdAt", "updatedAt")
VALUES ('demo-pay-3', 'demo-order-3', 'PIX', 'PENDING', 41.99, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Pedido 4: Mesa, preparando
INSERT INTO "Order" (id, "orderNumber", "userId", type, "tableNumber", status, origin, subtotal, "deliveryFee", discount, total, "createdAt", "updatedAt")
VALUES ('demo-order-4', '1004', 'demo-client-4', 'TABLE', 7, 'PREPARING', 'TABLE', 129.96, 0, 0, 129.96, NOW() - INTERVAL '30 minutes', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, "unitPrice", "totalPrice")
SELECT 'demo-item-4a', 'demo-order-4', p.id, 2, p."basePrice", p."basePrice" * 2
FROM "Product" p WHERE p.slug = 'crispy-burguer' LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, "unitPrice", "totalPrice")
SELECT 'demo-item-4b', 'demo-order-4', p.id, 1, p."basePrice", p."basePrice"
FROM "Product" p WHERE p.slug = 'calabresa-acebolada' LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Payment" (id, "orderId", method, status, amount, "createdAt", "updatedAt")
VALUES ('demo-pay-4', 'demo-order-4', 'DEBIT_CARD', 'APPROVED', 129.96, NOW() - INTERVAL '30 minutes', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Pedido 5: Site, pronto pra entrega
INSERT INTO "Order" (id, "orderNumber", "userId", type, status, origin, subtotal, "deliveryFee", discount, total, "estimatedTime", "createdAt", "updatedAt")
VALUES ('demo-order-5', '1005', 'demo-client-5', 'DELIVERY', 'READY', 'SITE', 67.98, 8.00, 0, 75.98, 30, NOW() - INTERVAL '40 minutes', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, "unitPrice", "totalPrice")
SELECT 'demo-item-5a', 'demo-order-5', p.id, 1, p."basePrice", p."basePrice"
FROM "Product" p WHERE p.slug = 'pig-burguer' LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, "unitPrice", "totalPrice")
SELECT 'demo-item-5b', 'demo-order-5', p.id, 1, p."basePrice", p."basePrice"
FROM "Product" p WHERE p.slug = 'dadinho-de-tapioca' LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Payment" (id, "orderId", method, status, amount, "paidAt", "createdAt", "updatedAt")
VALUES ('demo-pay-5', 'demo-order-5', 'PIX', 'APPROVED', 75.98, NOW() - INTERVAL '40 minutes', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Pedido 6: iFood, entregue (historico)
INSERT INTO "Order" (id, "orderNumber", "userId", type, status, origin, subtotal, "deliveryFee", discount, total, "createdAt", "updatedAt")
VALUES ('demo-order-6', '1006', 'demo-client-6', 'DELIVERY', 'DELIVERED', 'IFOOD', 98.97, 5.99, 10.00, 94.96, NOW() - INTERVAL '2 hours', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, "unitPrice", "totalPrice")
SELECT 'demo-item-6a', 'demo-order-6', p.id, 1, p."basePrice", p."basePrice"
FROM "Product" p WHERE p.slug = 'cheddar-burguer' LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, "unitPrice", "totalPrice")
SELECT 'demo-item-6b', 'demo-order-6', p.id, 1, p."basePrice", p."basePrice"
FROM "Product" p WHERE p.slug = 'bolinho-caipira' LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, "unitPrice", "totalPrice")
SELECT 'demo-item-6c', 'demo-order-6', p.id, 2, p."basePrice", p."basePrice" * 2
FROM "Product" p WHERE p.slug = 'pepsi' LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Payment" (id, "orderId", method, status, amount, "paidAt", "createdAt", "updatedAt")
VALUES ('demo-pay-6', 'demo-order-6', 'CREDIT_CARD', 'APPROVED', 94.96, NOW() - INTERVAL '2 hours', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Pedido 7: WhatsApp, entrega, confirmado
INSERT INTO "Order" (id, "orderNumber", "userId", type, status, origin, subtotal, "deliveryFee", discount, total, "createdAt", "updatedAt")
VALUES ('demo-order-7', '1007', 'demo-client-1', 'DELIVERY', 'CONFIRMED', 'WHATSAPP', 64.99, 8.00, 0, 72.99, NOW() - INTERVAL '10 minutes', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, "unitPrice", "totalPrice")
SELECT 'demo-item-7a', 'demo-order-7', p.id, 1, p."basePrice", p."basePrice"
FROM "Product" p WHERE p.slug = 'isca-de-tilapia' LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Payment" (id, "orderId", method, status, amount, "paidAt", "createdAt", "updatedAt")
VALUES ('demo-pay-7', 'demo-order-7', 'CASH', 'PENDING', 72.99, NULL, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Pedido 8: Site, entregue (historico de ontem)
INSERT INTO "Order" (id, "orderNumber", "userId", type, status, origin, subtotal, "deliveryFee", discount, total, "createdAt", "updatedAt")
VALUES ('demo-order-8', '0998', 'demo-client-3', 'DELIVERY', 'DELIVERED', 'SITE', 77.98, 8.00, 0, 85.98, NOW() - INTERVAL '1 day', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, "unitPrice", "totalPrice")
SELECT 'demo-item-8a', 'demo-order-8', p.id, 2, p."basePrice", p."basePrice" * 2
FROM "Product" p WHERE p.slug = 'classic-burguer' LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Payment" (id, "orderId", method, status, amount, "paidAt", "createdAt", "updatedAt")
VALUES ('demo-pay-8', 'demo-order-8', 'PIX', 'APPROVED', 85.98, NOW() - INTERVAL '1 day', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Pedido 9: Mesa, preparando (urgente)
INSERT INTO "Order" (id, "orderNumber", "userId", type, "tableNumber", status, origin, subtotal, "deliveryFee", discount, total, notes, "createdAt", "updatedAt")
VALUES ('demo-order-9', '1008', 'demo-client-2', 'TABLE', 3, 'CONFIRMED', 'TABLE', 35.99, 0, 0, 35.99, 'Alergia a amendoim', NOW() - INTERVAL '8 minutes', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, "unitPrice", "totalPrice")
SELECT 'demo-item-9a', 'demo-order-9', p.id, 1, p."basePrice", p."basePrice"
FROM "Product" p WHERE p.slug = 'vegetariano' LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Payment" (id, "orderId", method, status, amount, "createdAt", "updatedAt")
VALUES ('demo-pay-9', 'demo-order-9', 'DEBIT_CARD', 'APPROVED', 35.99, NOW() - INTERVAL '8 minutes', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Pedido 10: iFood, entregue (historico)
INSERT INTO "Order" (id, "orderNumber", "userId", type, status, origin, subtotal, "deliveryFee", discount, total, "createdAt", "updatedAt")
VALUES ('demo-order-10', '1009', 'demo-client-4', 'DELIVERY', 'DELIVERED', 'IFOOD', 55.98, 5.99, 5.00, 56.97, NOW() - INTERVAL '3 hours', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, "unitPrice", "totalPrice")
SELECT 'demo-item-10a', 'demo-order-10', p.id, 1, p."basePrice", p."basePrice"
FROM "Product" p WHERE p.slug = 'onion-burguer' LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, "unitPrice", "totalPrice")
SELECT 'demo-item-10b', 'demo-order-10', p.id, 1, p."basePrice", p."basePrice"
FROM "Product" p WHERE p.slug = 'batata-frita' LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Payment" (id, "orderId", method, status, amount, "paidAt", "createdAt", "updatedAt")
VALUES ('demo-pay-10', 'demo-order-10', 'CREDIT_CARD', 'APPROVED', 56.97, NOW() - INTERVAL '3 hours', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
