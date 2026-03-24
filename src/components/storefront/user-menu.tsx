"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useState, useRef, useEffect } from "react";

export function UserMenu() {
  const { user, isAuthenticated, isLoading } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />;
  }

  if (!isAuthenticated || !user) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        Entrar
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? ""}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
            {(user.name ?? user.email ?? "U").charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
          <div className="p-3 border-b border-border">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>

          <div className="py-1">
            <Link
              href="/minha-conta"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm hover:bg-secondary transition-colors"
            >
              Minha conta
            </Link>
            <Link
              href="/pedidos"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm hover:bg-secondary transition-colors"
            >
              Meus pedidos
            </Link>
          </div>

          <div className="border-t border-border py-1">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="block w-full text-left px-3 py-2 text-sm text-destructive hover:bg-secondary transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
