import { Metadata } from "next";
import { getConversations } from "@/lib/whatsapp/message-log";
import Link from "next/link";

export const metadata: Metadata = { title: "Mensagens WhatsApp" };
export const dynamic = "force-dynamic";

function formatPhone(phone: string): string {
  // 5542999327823 -> (42) 99932-7823
  const clean = phone.replace(/^55/, "");
  if (clean.length === 11) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  }
  return phone;
}

function timeAgo(date: Date): string {
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export default async function MensagensPage() {
  const conversations = await getConversations();

  const withAttention = conversations.filter((c) => c.needsAttention);
  const withOrders = conversations.filter((c) => c.hasOrder && !c.needsAttention);
  const others = conversations.filter((c) => !c.hasOrder && !c.needsAttention);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mensagens WhatsApp</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Conversas do bot — pedidos automaticos e atendimento manual
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Bot ativo
          </div>
          <span className="text-xs text-muted-foreground">
            {conversations.length} conversa{conversations.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 bg-card border border-border rounded-xl">
          <p className="text-2xl font-bold text-red-600">{withAttention.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Precisam atencao</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-xl">
          <p className="text-2xl font-bold text-green-600">{withOrders.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Pedidos feitos</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-xl">
          <p className="text-2xl font-bold">{others.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Conversas gerais</p>
        </div>
      </div>

      {/* Needs attention */}
      {withAttention.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Precisam de atendimento manual
          </h2>
          <div className="space-y-2">
            {withAttention.map((conv) => (
              <ConversationCard key={conv.phone} conv={conv} variant="attention" />
            ))}
          </div>
        </div>
      )}

      {/* With orders */}
      {withOrders.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Pedidos concluidos pelo bot
          </h2>
          <div className="space-y-2">
            {withOrders.map((conv) => (
              <ConversationCard key={conv.phone} conv={conv} variant="success" />
            ))}
          </div>
        </div>
      )}

      {/* Others */}
      {others.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">
            Outras conversas
          </h2>
          <div className="space-y-2">
            {others.map((conv) => (
              <ConversationCard key={conv.phone} conv={conv} variant="default" />
            ))}
          </div>
        </div>
      )}

      {conversations.length === 0 && (
        <div className="p-12 text-center text-sm text-muted-foreground rounded-xl border border-border bg-card">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-600">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" fill="currentColor"/>
            </svg>
          </div>
          <p className="font-semibold">Nenhuma conversa ainda</p>
          <p className="text-xs mt-1">Quando clientes mandarem mensagem pelo WhatsApp, vao aparecer aqui.</p>
        </div>
      )}
    </div>
  );
}

function ConversationCard({
  conv,
  variant,
}: {
  conv: {
    phone: string;
    name: string;
    lastMessage: string;
    lastAt: Date;
    messageCount: number;
    hasOrder: boolean;
    needsAttention: boolean;
  };
  variant: "attention" | "success" | "default";
}) {
  const borderClass =
    variant === "attention"
      ? "border-red-200 bg-red-50/50 dark:bg-red-950/10"
      : variant === "success"
      ? "border-green-200 bg-green-50/50 dark:bg-green-950/10"
      : "border-border bg-card";

  return (
    <div className={`p-4 rounded-xl border ${borderClass} flex items-start gap-3`}>
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
        <span className="text-white text-sm font-bold">
          {(conv.name || "C")[0].toUpperCase()}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{conv.name || "Cliente"}</span>
            <span className="text-[10px] text-muted-foreground">{formatPhone(conv.phone)}</span>
          </div>
          <span className="text-[10px] text-muted-foreground shrink-0">
            {timeAgo(conv.lastAt)}
          </span>
        </div>

        <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>

        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] text-muted-foreground">{conv.messageCount} msgs</span>
          {conv.hasOrder && (
            <span className="text-[10px] text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full font-medium">
              Pedido feito
            </span>
          )}
          {conv.needsAttention && (
            <span className="text-[10px] text-red-700 bg-red-100 px-1.5 py-0.5 rounded-full font-medium">
              Precisa atencao
            </span>
          )}
        </div>
      </div>

      {/* WhatsApp link */}
      <a
        href={`https://wa.me/${conv.phone}`}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center hover:bg-[#20BD5A] transition-colors"
        title="Abrir no WhatsApp"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
