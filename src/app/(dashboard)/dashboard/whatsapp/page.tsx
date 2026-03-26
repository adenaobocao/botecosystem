import { Metadata } from "next";
import { WhatsAppConnection } from "@/components/dashboard/whatsapp-connection";
import Link from "next/link";

export const metadata: Metadata = { title: "WhatsApp | Boteco da Estacao" };

export default function WhatsAppPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">WhatsApp</h1>
        <p className="text-sm text-muted-foreground">Conecte seu numero e gerencie o bot</p>
      </div>

      <WhatsAppConnection />

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/dashboard/mensagens"
          className="flex items-center gap-2.5 p-3 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="text-xs font-medium">Mensagens</span>
        </Link>
        <Link
          href="/dashboard/marketing/campanhas/nova"
          className="flex items-center gap-2.5 p-3 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0">
            <path d="m3 11 18-5v12L3 13v-2z" />
          </svg>
          <span className="text-xs font-medium">Nova campanha</span>
        </Link>
      </div>

      {/* Info */}
      <div className="bg-muted/30 rounded-xl p-4 space-y-2">
        <h2 className="text-xs font-semibold">Como funciona</h2>
        <div className="space-y-1.5 text-[11px] text-muted-foreground">
          <p>1. Conecte seu WhatsApp escaneando o QR Code acima</p>
          <p>2. O bot comeca a responder automaticamente (cardapio, pedidos, pagamento)</p>
          <p>3. Campanhas de marketing sao enviadas por esse mesmo numero</p>
          <p>4. Cupons e notificacoes de status de pedido vao por aqui tambem</p>
        </div>
      </div>
    </div>
  );
}
