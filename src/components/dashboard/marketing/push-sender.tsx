"use client";

import { useState } from "react";

const MEME_STYLES = [
  "humor de bar",
  "meme brasileiro",
  "tio do churrasco",
  "fome de madrugada",
  "sexta-feira mood",
  "chopp gelado urgente",
  "drama fake engracado",
  "POV memetico",
];

interface PushHistory {
  title: string;
  body: string;
  totalSent: number;
  createdAt: string;
}

interface PushOption {
  title: string;
  body: string;
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
  const [options, setOptions] = useState<PushOption[]>([]);
  const [selectedStyle, setSelectedStyle] = useState("humor de bar");

  async function handleGenerate() {
    setGenerating(true);
    setOptions([]);
    try {
      const res = await fetch("/api/ai/push-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ style: selectedStyle }),
      });
      const data = await res.json();
      if (data.options?.length > 0) {
        setOptions(data.options);
      }
    } catch {
      // silently fail
    }
    setGenerating(false);
  }

  function selectOption(opt: PushOption) {
    setTitle(opt.title);
    setBody(opt.body);
    setOptions([]);
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
        <h2 className="text-sm font-semibold">Gerar frases memeticas</h2>

        {/* Style picker */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-muted-foreground">Estilo do humor</label>
          <div className="flex flex-wrap gap-1.5">
            {MEME_STYLES.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStyle(s)}
                className={`px-2.5 py-1 text-[10px] font-medium rounded-full border transition-colors ${
                  selectedStyle === s ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted/50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full h-9 text-xs font-medium border border-primary text-primary rounded-lg hover:bg-primary/5 disabled:opacity-50"
        >
          {generating ? "Criando frases..." : "Gerar 6 opcoes com IA"}
        </button>

        {/* Options grid */}
        {options.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-[10px] text-muted-foreground">Escolha uma (clique pra usar)</label>
            <div className="grid grid-cols-1 gap-1.5">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => selectOption(opt)}
                  className="w-full p-3 bg-zinc-900 rounded-xl flex items-start gap-3 hover:ring-2 hover:ring-primary/30 transition-all text-left"
                >
                  <img src="/logo.png" alt="" className="w-8 h-8 rounded-lg shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-white truncate">{opt.title}</p>
                    <p className="text-[10px] text-zinc-300 leading-snug mt-0.5">{opt.body}</p>
                  </div>
                  <span className="text-[9px] text-zinc-600 shrink-0 mt-0.5">#{i + 1}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Editor manual */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <h2 className="text-sm font-semibold">Editar e enviar</h2>

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
              placeholder="Escolha uma opcao acima ou escreva..."
            />
            <p className={`text-[10px] text-right ${body.length > 120 ? "text-amber-500" : "text-muted-foreground"}`}>
              {body.length}/120
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
        {body && (
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">Preview</label>
            <div className="bg-zinc-900 rounded-xl p-3 flex items-start gap-3">
              <img src="/logo.png" alt="" className="w-10 h-10 rounded-lg shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-white truncate">{title || "Boteco da Estacao"}</p>
                <p className="text-[10px] text-zinc-300 leading-snug mt-0.5">{body}</p>
                <p className="text-[9px] text-zinc-500 mt-1">agora</p>
              </div>
            </div>
          </div>
        )}

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
                  <p className="text-[10px] font-medium">{h.totalSent}</p>
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
