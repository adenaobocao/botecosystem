"use client";

import { useState } from "react";
import { generateContent } from "@/lib/actions/content";

const contentTypes = [
  { value: "SOCIAL_POST", label: "Post Instagram/Facebook" },
  { value: "WHATSAPP_BROADCAST", label: "Mensagem WhatsApp" },
  { value: "PROMO_DESCRIPTION", label: "Descricao de promo" },
  { value: "EVENT_PROMO", label: "Divulgacao de evento" },
] as const;

const tones = [
  { value: "casual", label: "Casual" },
  { value: "festivo", label: "Festivo" },
  { value: "urgente", label: "Urgente" },
  { value: "informativo", label: "Informativo" },
];

export function ContentGenerator() {
  const [type, setType] = useState<(typeof contentTypes)[number]["value"]>("SOCIAL_POST");
  const [tone, setTone] = useState("casual");
  const [context, setContext] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setResult("");
    const text = await generateContent({ type, tone, context: context || undefined });
    setResult(text);
    setLoading(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Type */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium">Tipo de conteudo</label>
        <div className="grid grid-cols-2 gap-2">
          {contentTypes.map((ct) => (
            <button
              key={ct.value}
              onClick={() => setType(ct.value)}
              className={`p-2.5 text-xs font-medium rounded-xl border transition-colors ${
                type === ct.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              {ct.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tone */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium">Tom</label>
        <div className="flex gap-2">
          {tones.map((t) => (
            <button
              key={t.value}
              onClick={() => setTone(t.value)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                tone === t.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Context */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium">Contexto (opcional)</label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={2}
          placeholder="Ex: Temos promo de hamburguer nessa sexta, show de rock as 21h..."
          className="w-full px-3 py-2 text-xs bg-background border border-border rounded-lg resize-none"
        />
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full h-10 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? "Gerando com IA..." : "Gerar conteudo"}
      </button>

      {/* Result */}
      {result && (
        <div className="space-y-2">
          <div className="p-4 bg-muted/30 rounded-xl">
            <p className="text-xs leading-relaxed whitespace-pre-line">{result}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 h-9 text-xs font-medium border border-border rounded-lg hover:bg-muted"
            >
              {copied ? "Copiado!" : "Copiar texto"}
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="h-9 px-4 text-xs font-medium border border-border rounded-lg hover:bg-muted disabled:opacity-50"
            >
              Regenerar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
