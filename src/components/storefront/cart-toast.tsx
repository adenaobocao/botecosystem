"use client";

import { useCart } from "@/lib/cart-context";
import Link from "next/link";

export function CartToast() {
  const { toast, soundEnabled, toggleSound } = useCart();

  if (!toast) return null;

  return (
    <div className="fixed top-16 right-3 left-3 z-[70] flex justify-center pointer-events-none">
      <div className="animate-toast-slide pointer-events-auto flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-xl shadow-lg max-w-[240px]">
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate">{toast} adicionado!</p>
          <Link href="/carrinho" className="text-[10px] text-primary font-medium hover:underline">
            Ver carrinho
          </Link>
        </div>
        <button
          onClick={toggleSound}
          className="shrink-0 w-6 h-6 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          title={soundEnabled ? "Desativar som" : "Ativar som"}
        >
          {soundEnabled ? (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
