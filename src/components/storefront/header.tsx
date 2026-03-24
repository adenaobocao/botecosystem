"use client";

import Link from "next/link";
import Image from "next/image";
import { UserMenu } from "./user-menu";
import { CartBadge } from "./cart-badge";

export function StorefrontHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Boteco da Estacao"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="font-bold text-base tracking-tight hidden sm:inline">
            Boteco da Estacao
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link
            href="/cardapio"
            className="hover:text-foreground transition-colors"
          >
            Cardapio
          </Link>
          <Link
            href="/sobre"
            className="hover:text-foreground transition-colors"
          >
            Sobre
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <CartBadge />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
