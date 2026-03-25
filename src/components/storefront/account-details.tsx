"use client";

import Image from "next/image";
import Link from "next/link";
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

const tiers = [
  { name: "Bronze", min: 0, next: 200, color: "from-amber-700 to-amber-600", bar: "bg-amber-600", text: "text-amber-700 dark:text-amber-400" },
  { name: "Prata", min: 200, next: 500, color: "from-gray-400 to-gray-500", bar: "bg-gray-400", text: "text-gray-600 dark:text-gray-300" },
  { name: "Ouro", min: 500, next: 1000, color: "from-yellow-500 to-amber-500", bar: "bg-yellow-500", text: "text-yellow-700 dark:text-yellow-400" },
  { name: "Diamante", min: 1000, next: 2000, color: "from-cyan-400 to-blue-500", bar: "bg-cyan-500", text: "text-cyan-700 dark:text-cyan-400" },
];

function getTier(points: number) {
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (points >= tiers[i].min) return tiers[i];
  }
  return tiers[0];
}

export function AccountDetails({ user }: AccountDetailsProps) {
  const initial = (user.name ?? user.email ?? "U").charAt(0).toUpperCase();
  const tier = getTier(user.loyaltyPoints);
  const nextReward = tier.next;
  const tierProgress = Math.min(((user.loyaltyPoints - tier.min) / (tier.next - tier.min)) * 100, 100);

  return (
    <div className="mt-6 space-y-4">
      {/* Profile card */}
      <div className="p-5 bg-card border border-border rounded-2xl">
        <div className="flex items-center gap-4">
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
              {initial}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-bold text-lg truncate">{user.name ?? "Sem nome"}</p>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Loyalty card — warm, promotional */}
      <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200/60 dark:border-amber-800/30 rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-amber-500">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            Fidelidade Boteco
          </h2>
          <span className={`ml-auto px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-gradient-to-r ${tier.color} text-white`}>
            {tier.name}
          </span>
        </div>

        <p className="text-3xl font-black tracking-tight text-amber-900 dark:text-amber-200">
          {user.loyaltyPoints}
          <span className="text-base font-semibold ml-1 text-amber-700 dark:text-amber-400">pontos</span>
        </p>

        {/* Progress bar to next tier */}
        <div className="mt-3">
          <div className="flex justify-between text-[11px] font-medium text-amber-700/70 dark:text-amber-400/60 mb-1">
            <span>Proximo nivel: {tiers[tiers.indexOf(tier) + 1]?.name ?? "Max"}</span>
            <span>{user.loyaltyPoints}/{nextReward}</span>
          </div>
          <div className="h-2.5 bg-amber-200/60 dark:bg-amber-900/40 rounded-full overflow-hidden">
            <div
              className={`h-full ${tier.bar} rounded-full transition-all`}
              style={{ width: `${tierProgress}%` }}
            />
          </div>
          <p className="text-[11px] text-amber-700/70 dark:text-amber-400/60 mt-1.5">
            {user.loyaltyPoints >= nextReward
              ? "Voce tem um premio disponivel!"
              : `Faltam ${nextReward - user.loyaltyPoints} pontos para o proximo nivel`}
          </p>
        </div>

        <div className="mt-4 p-3 bg-white/50 dark:bg-black/10 rounded-xl">
          <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">Como funciona?</p>
          <p className="text-[11px] text-amber-700/80 dark:text-amber-400/70 mt-0.5 leading-relaxed">
            A cada pedido voce acumula pontos. Com 500 pontos, troque por um brinde exclusivo!
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div className="space-y-2">
        <Link
          href="/meus-pedidos"
          className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                <path d="M16 3h5v5" /><path d="M8 3H3v5" />
                <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" /><path d="m15 9 6-6" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold">Meus pedidos</p>
              <p className="text-[11px] text-muted-foreground">Acompanhe seus pedidos</p>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>

        <Link
          href="/cardapio"
          className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold">Fazer pedido</p>
              <p className="text-[11px] text-muted-foreground">Ver o cardapio completo</p>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>

        <a
          href="https://wa.me/5542999327823"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-600">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold">Falar com o Boteco</p>
              <p className="text-[11px] text-muted-foreground">WhatsApp direto</p>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </a>
      </div>

      {/* Sign out */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="w-full h-11 border border-border rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors"
      >
        Sair da conta
      </button>
    </div>
  );
}
