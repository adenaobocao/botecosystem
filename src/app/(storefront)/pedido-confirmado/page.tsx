import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Pedido Confirmado" };

interface Props {
  searchParams: Promise<{ pedido?: string }>;
}

export default async function PedidoConfirmadoPage({ searchParams }: Props) {
  const params = await searchParams;
  const orderNumber = params.pedido || "—";

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      {/* Success icon */}
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold tracking-tight">Pedido confirmado!</h1>
      <p className="mt-2 text-muted-foreground">
        Seu pedido <span className="font-bold text-foreground">#{orderNumber}</span> foi recebido
      </p>

      {/* Status card */}
      <div className="mt-8 p-5 bg-card border border-border rounded-xl text-left space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold">Pagamento aprovado</p>
            <p className="text-xs text-muted-foreground">PIX confirmado</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold">Tempo estimado</p>
            <p className="text-xs text-muted-foreground">~30 minutos</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold">Acompanhe pelo painel</p>
            <p className="text-xs text-muted-foreground">Status atualizado em tempo real</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 space-y-3">
        <Link
          href="/cardapio"
          className="flex items-center justify-center w-full h-12 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-90 transition-opacity"
        >
          Fazer outro pedido
        </Link>
        <Link
          href="/"
          className="flex items-center justify-center w-full h-11 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Voltar ao inicio
        </Link>
      </div>
    </div>
  );
}
