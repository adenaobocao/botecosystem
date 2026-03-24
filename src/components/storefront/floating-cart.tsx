"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";

function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function FloatingCart() {
  const { itemCount, subtotal, lastAddedAt } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [shaking, setShaking] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, startX: 0, startY: 0 });
  const hasMoved = useRef(false);

  // Set initial position
  useEffect(() => {
    if (typeof window !== "undefined" && !initialized) {
      setPos({
        x: window.innerWidth - 80,
        y: window.innerHeight - 160,
      });
      setInitialized(true);
    }
  }, [initialized]);

  // Shake when item added
  useEffect(() => {
    if (lastAddedAt > 0) {
      setShaking(true);
      const t = setTimeout(() => setShaking(false), 600);
      return () => clearTimeout(t);
    }
  }, [lastAddedAt]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!ref.current) return;
    ref.current.setPointerCapture(e.pointerId);
    setDragging(true);
    hasMoved.current = false;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      startX: pos.x,
      startY: pos.y,
    };
  }, [pos]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasMoved.current = true;
    }
    const newX = Math.max(16, Math.min(window.innerWidth - 80, dragStart.current.startX + dx));
    const newY = Math.max(80, Math.min(window.innerHeight - 80, dragStart.current.startY + dy));
    setPos({ x: newX, y: newY });
  }, [dragging]);

  const handlePointerUp = useCallback(() => {
    setDragging(false);
    if (!hasMoved.current) {
      router.push("/carrinho");
    }
    // Snap to nearest edge
    setPos((prev) => {
      const midX = window.innerWidth / 2;
      return {
        x: prev.x < midX ? 16 : window.innerWidth - 80,
        y: prev.y,
      };
    });
  }, [router]);

  // Hide on cart/checkout pages or when cart is empty
  const hiddenPages = ["/carrinho", "/checkout", "/pedido-confirmado"];
  if (itemCount === 0 || hiddenPages.some((p) => pathname.startsWith(p))) {
    return null;
  }

  if (!initialized) return null;

  return (
    <button
      ref={ref}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        zIndex: 60,
        touchAction: "none",
        transition: dragging ? "none" : "left 0.3s ease, top 0.05s ease",
      }}
      className={`flex items-center gap-2 h-12 pl-3 pr-4 bg-primary text-primary-foreground rounded-full shadow-xl hover:shadow-2xl active:scale-95 select-none cursor-grab active:cursor-grabbing ${
        shaking ? "animate-cart-shake" : ""
      }`}
    >
      {/* Cart icon */}
      <div className="relative">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      </div>
      <span className="text-sm font-bold">{formatPrice(subtotal)}</span>
    </button>
  );
}
