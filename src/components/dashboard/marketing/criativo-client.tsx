"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateContent } from "@/lib/actions/content";
import { CampaignVisualEditor } from "./campaign-visual-editor";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  image: string | null;
  price: number;
}

interface Props {
  products: Product[];
}

const contentTypes = [
  { value: "SOCIAL_POST" as const, label: "Post Instagram" },
  { value: "WHATSAPP_BROADCAST" as const, label: "WhatsApp" },
  { value: "PROMO_DESCRIPTION" as const, label: "Promo" },
  { value: "EVENT_PROMO" as const, label: "Evento" },
];

const tones = [
  { value: "casual", label: "Casual" },
  { value: "festivo", label: "Festivo" },
  { value: "urgente", label: "Urgente" },
  { value: "informativo", label: "Info" },
];

export function CriativoClient({ products }: Props) {
  const router = useRouter();

  // Step state
  const [step, setStep] = useState<1 | 2>(1);

  // Text generation state
  const [contentType, setContentType] = useState<(typeof contentTypes)[number]["value"]>("SOCIAL_POST");
  const [tone, setTone] = useState("casual");
  const [context, setContext] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [textLoading, setTextLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Visual state
  const [exportedImages, setExportedImages] = useState<string[]>([]);
  const [lastDataUrl, setLastDataUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Pre-fill visual editor from generated text
  const [visualTitle, setVisualTitle] = useState("");
  const [visualSubtitle, setVisualSubtitle] = useState("");

  async function handleGenerateText() {
    setTextLoading(true);
    setGeneratedText("");
    const text = await generateContent({ type: contentType, tone, context: context || undefined });
    setGeneratedText(text);

    // Auto-preenche titulo e subtitulo pra arte
    const lines = text.split("\n").filter((l) => l.trim());
    if (lines.length >= 2) {
      setVisualTitle(lines[0].replace(/^#+\s*/, "").slice(0, 40).toUpperCase());
      setVisualSubtitle(lines[1].slice(0, 60));
    } else if (lines.length === 1) {
      setVisualTitle(lines[0].slice(0, 40).toUpperCase());
    }

    setTextLoading(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleGoToVisual() {
    setStep(2);
  }

  function handleExport(dataUrl: string) {
    setExportedImages((prev) => [dataUrl, ...prev]);
    setLastDataUrl(dataUrl);
  }

  async function handleUseCampaign() {
    if (!lastDataUrl) return;
    setUploading(true);
    try {
      const res = await fetch("/api/upload/campaign-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: lastDataUrl }),
      });
      const data = await res.json();
      if (data.url) {
        router.push(`/dashboard/marketing/campanhas/nova?imageUrl=${encodeURIComponent(data.url)}&name=Campanha+com+arte`);
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
    setUploading(false);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/marketing" className="text-muted-foreground hover:text-foreground">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Criativo</h1>
          <p className="text-sm text-muted-foreground">Texto IA + Arte visual em um so lugar</p>
        </div>
      </div>

      {/* Step tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1">
        <button
          onClick={() => setStep(1)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-colors ${
            step === 1 ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          1. Texto IA
        </button>
        <button
          onClick={() => setStep(2)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-colors ${
            step === 2 ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          2. Arte Visual
        </button>
      </div>

      {/* Step 1: Text generation */}
      {step === 1 && (
        <div className="space-y-4">
          {/* Content type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Tipo de conteudo</label>
            <div className="grid grid-cols-4 gap-1.5">
              {contentTypes.map((ct) => (
                <button
                  key={ct.value}
                  onClick={() => setContentType(ct.value)}
                  className={`p-2 text-[10px] font-medium rounded-lg border transition-colors ${
                    contentType === ct.value ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                  }`}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Tom</label>
            <div className="flex gap-1.5">
              {tones.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={`flex-1 py-1.5 text-[10px] font-medium rounded-lg border transition-colors ${
                    tone === t.value ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Context */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Contexto (opcional)</label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={2}
              placeholder="Ex: Promo de hamburguer nessa sexta, show de rock as 21h..."
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-lg resize-none"
            />
          </div>

          {/* Generate */}
          <button
            onClick={handleGenerateText}
            disabled={textLoading}
            className="w-full h-10 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {textLoading ? "Gerando com IA..." : "Gerar texto"}
          </button>

          {/* Result */}
          {generatedText && (
            <div className="space-y-3">
              <div className="p-4 bg-muted/30 rounded-xl">
                <p className="text-xs leading-relaxed whitespace-pre-line">{generatedText}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 h-9 text-xs font-medium border border-border rounded-lg hover:bg-muted"
                >
                  {copied ? "Copiado!" : "Copiar texto"}
                </button>
                <button
                  onClick={handleGenerateText}
                  disabled={textLoading}
                  className="h-9 px-4 text-xs font-medium border border-border rounded-lg hover:bg-muted disabled:opacity-50"
                >
                  Regenerar
                </button>
              </div>

              {/* CTA to visual */}
              <button
                onClick={handleGoToVisual}
                className="w-full h-10 text-xs font-semibold border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
              >
                Criar arte visual com esse texto
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Visual editor */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Show generated text if exists */}
          {generatedText && (
            <div className="p-3 bg-muted/30 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Texto gerado</span>
                <button onClick={() => setStep(1)} className="text-[10px] text-primary hover:underline">
                  Editar texto
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">{generatedText}</p>
            </div>
          )}

          <CampaignVisualEditor
            onExport={handleExport}
            products={products}
            initialTitle={visualTitle}
            initialSubtitle={visualSubtitle}
          />

          {/* Actions after export */}
          {lastDataUrl && (
            <button
              onClick={handleUseCampaign}
              disabled={uploading}
              className="w-full h-11 text-xs font-semibold border-2 border-primary text-primary rounded-lg hover:bg-primary/5 disabled:opacity-50 transition-colors"
            >
              {uploading ? "Preparando imagem..." : "Usar em campanha WhatsApp"}
            </button>
          )}
        </div>
      )}

      {/* Export history */}
      {exportedImages.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Exportados ({exportedImages.length})
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {exportedImages.map((img, i) => (
              <a
                key={i}
                href={img}
                download={`boteco-criativo-${i + 1}.png`}
                className="aspect-square rounded-lg overflow-hidden border border-border hover:ring-2 hover:ring-primary/20 transition-all"
              >
                <img src={img} alt={`Export ${i + 1}`} className="w-full h-full object-cover" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
