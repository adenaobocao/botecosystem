"use client";

import { useState } from "react";

const MEME_STYLES = [
  "humor de bar",
  "meme brasileiro",
  "tio do churrasco",
  "fome de madrugada",
  "sexta-feira mood",
  "chopp gelado urgente",
];

interface PushHistory {
  title: string;
  body: string;
  totalSent: number;
  createdAt: string;
}

interface Props {
  subscriberCount: number;
  history: PushHistory[];
}

export function PushSender({ subscriberCount, history }: Props) {
  const [title, setTitle] = useState("Boteco da Estacao");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/cardapio");
  const [sending, setSending] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const style = MEME_STYLES[Math.floor(Math.random() * MEME_STYLES.length)];
      const res = await fetch("/api/ai/push-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ style }),
      });
      const data = await res.json();
      if (data.title) setTitle(data.title);
      if (data.body) setBody(data.body);
    } catch {
      // silently fail
    }
    setGenerating(false);
  }

  async function handleSend() {
    if (!body) return;
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, url }),
      });
      const data = await res.json();
      setResult({ sent: data.sent || 0, failed: data.failed || 0 });
    } catch {
      setResult({ sent: 0, failed: 0 });
    }
    setSending(false);
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-card border border-border rounded-xl text-center">
          <p className="text-2xl font-bold text-primary">{subscriberCount}</p>
          <p className="text-[10px] text-muted-foreground">Assinantes push</p>
        </div>
        <div className="p-3 bg-card border border-border rounded-xl text-center">
          <p className="text-2xl font-bold">{history.length}</p>
          <p className="text-[10px] text-muted-foreground">Notificacoes enviadas</p>
        </div>
      </div>

      {/* Generator */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <h2 className="text-sm font-semibold">Criar notificacao</h2>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full h-9 text-xs font-medium border border-primary text-primary rounded-lg hover:bg-primary/5 disabled:opacity-50"
        >
          {generating ? "Criando frase memetica..." : "Gerar frase memetica com IA"}
        </button>

        <div className="space-y-2">
          <div>
            <label className="text-[10px] text-muted-foreground">Titulo</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-9 px-3 text-xs bg-background border border-border rounded-lg"
              placeholder="Boteco da Estacao"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground">Mensagem</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-lg resize-none"
              placeholder="Ex: Aquele chopp nao vai se beber sozinho..."
            />
            <p className={`text-[10px] text-right ${body.length > 120 ? "text-amber-500" : "text-muted-foreground"}`}>
              {body.length}/120 (ideal pra push)
            </p>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground">Link ao clicar</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full h-9 px-3 text-xs bg-background border border-border rounded-lg"
              placeholder="/cardapio"
            />
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="text-[10px] text-muted-foreground mb-1 block">Preview da notificacao</label>
          <div className="bg-zinc-900 rounded-xl p-3 flex items-start gap-3">
            <img src="/logo.png" alt="" className="w-10 h-10 rounded-lg shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-white truncate">{title || "Boteco da Estacao"}</p>
              <p className="text-[10px] text-zinc-300 leading-snug mt-0.5">
                {body || "Sua mensagem aqui..."}
              </p>
              <p className="text-[9px] text-zinc-500 mt-1">agora</p>
            </div>
          </div>
        </div>

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={sending || !body || subscriberCount === 0}
          className="w-full h-10 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {sending
            ? "Enviando..."
            : subscriberCount === 0
              ? "Nenhum assinante ainda"
              : `Enviar para ${subscriberCount} assinantes`}
        </button>

        {result && (
          <div className={`p-2.5 rounded-lg text-xs text-center ${result.sent > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {result.sent} enviadas, {result.failed} falharam
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-3">Historico</h2>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{h.title}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{h.body}</p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-[10px] font-medium">{h.totalSent} enviadas</p>
                  <p className="text-[9px] text-muted-foreground">
                    {new Date(h.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
