"use client";

import Image from "next/image";
import { signOut } from "next-auth/react";

interface AccountDetailsProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    loyaltyPoints: number;
  };
}

export function AccountDetails({ user }: AccountDetailsProps) {
  return (
    <div className="mt-6 space-y-6">
      {/* Profile card */}
      <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? ""}
            width={56}
            height={56}
            className="rounded-full"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
            {(user.name ?? user.email ?? "U").charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold truncate">{user.name ?? "Sem nome"}</p>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>

      {/* Loyalty points */}
      <div className="p-4 bg-card border border-border rounded-xl">
        <p className="text-sm text-muted-foreground">Pontos de fidelidade</p>
        <p className="mt-1 text-2xl font-bold tracking-tight">
          {user.loyaltyPoints}
          <span className="text-sm font-normal text-muted-foreground ml-1">
            pontos
          </span>
        </p>
      </div>

      {/* Sign out */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="w-full h-12 border border-border rounded-xl text-sm font-medium text-destructive hover:bg-secondary transition-colors"
      >
        Sair da conta
      </button>
    </div>
  );
}
