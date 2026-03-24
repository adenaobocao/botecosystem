"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  price: number; // unit price (base + variant modifier)
  quantity: number;
  image: string | null;
  notes?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  toast: string | null;
  lastAddedAt: number;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "boteco-cart";
const SOUND_KEY = "boteco-sound";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // quota exceeded, ignore
  }
}

function playCartSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
    setTimeout(() => ctx.close(), 300);
  } catch {
    // Web Audio not available, ignore
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [lastAddedAt, setLastAddedAt] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Load from localStorage on mount
  useEffect(() => {
    setItems(loadCart());
    const sound = localStorage.getItem(SOUND_KEY);
    if (sound !== null) setSoundEnabled(sound === "true");
    setLoaded(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (loaded) saveCart(items);
  }, [items, loaded]);

  const addItem = useCallback(
    (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setItems((prev) => {
        const key = `${newItem.productId}-${newItem.variantId || ""}`;
        const existing = prev.find(
          (i) => `${i.productId}-${i.variantId || ""}` === key
        );
        if (existing) {
          return prev.map((i) =>
            `${i.productId}-${i.variantId || ""}` === key
              ? { ...i, quantity: i.quantity + (newItem.quantity || 1) }
              : i
          );
        }
        return [...prev, { ...newItem, quantity: newItem.quantity || 1 }];
      });

      // Toast notification
      setToast(newItem.name);
      setLastAddedAt(Date.now());

      // Sound
      if (typeof window !== "undefined") {
        const sound = localStorage.getItem(SOUND_KEY);
        if (sound !== "false") playCartSound();
      }

      // Auto-clear toast
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 2500);
    },
    []
  );

  const removeItem = useCallback(
    (productId: string, variantId?: string) => {
      setItems((prev) =>
        prev.filter(
          (i) =>
            !(i.productId === productId && (i.variantId || "") === (variantId || ""))
        )
      );
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number, variantId?: string) => {
      if (quantity <= 0) {
        removeItem(productId, variantId);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && (i.variantId || "") === (variantId || "")
            ? { ...i, quantity }
            : i
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(SOUND_KEY, String(next));
      return next;
    });
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items, addItem, removeItem, updateQuantity, clearCart,
        itemCount, subtotal, toast, lastAddedAt, soundEnabled, toggleSound,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
