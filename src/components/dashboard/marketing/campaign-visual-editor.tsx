"use client";

import { useState, useRef, useCallback } from "react";

// ===== TYPES =====

interface TemplateConfig {
  id: string;
  label: string;
  description: string;
  // Style
  bg: string;
  overlay: string;
  textColor: string;
  accentColor: string;
  accentBg: string;
  // Layout
  titleSize: string;
  subtitleSize: string;
  layout: "center" | "bottom" | "split" | "editorial";
}

const TEMPLATES: TemplateConfig[] = [
  {
    id: "promo_flash",
    label: "Promo Flash",
    description: "Fundo vibrante, preco grande, urgencia",
    bg: "bg-gradient-to-br from-red-600 via-red-700 to-red-900",
    overlay: "bg-black/20",
    textColor: "text-white",
    accentColor: "text-amber-300",
    accentBg: "bg-amber-400 text-red-900",
    titleSize: "text-4xl sm:text-5xl",
    subtitleSize: "text-lg sm:text-xl",
    layout: "center",
  },
  {
    id: "happy_hour",
    label: "Happy Hour",
    description: "Dourado elegante, horario em destaque",
    bg: "bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900",
    overlay: "bg-black/30",
    textColor: "text-white",
    accentColor: "text-amber-200",
    accentBg: "bg-white text-amber-800",
    titleSize: "text-4xl sm:text-5xl",
    subtitleSize: "text-lg sm:text-xl",
    layout: "bottom",
  },
  {
    id: "evento",
    label: "Evento / Show",
    description: "Dark premium, artista em destaque",
    bg: "bg-gradient-to-br from-zinc-900 via-neutral-900 to-black",
    overlay: "bg-gradient-to-t from-black/80 via-black/40 to-transparent",
    textColor: "text-white",
    accentColor: "text-violet-300",
    accentBg: "bg-violet-500 text-white",
    titleSize: "text-3xl sm:text-4xl",
    subtitleSize: "text-base sm:text-lg",
    layout: "editorial",
  },
  {
    id: "reativacao",
    label: "Volta pro Boteco",
    description: "Quente e acolhedor, cupom destaque",
    bg: "bg-gradient-to-br from-orange-500 via-red-500 to-rose-600",
    overlay: "bg-black/25",
    textColor: "text-white",
    accentColor: "text-yellow-200",
    accentBg: "bg-white text-rose-700",
    titleSize: "text-3xl sm:text-4xl",
    subtitleSize: "text-lg",
    layout: "center",
  },
  {
    id: "generico",
    label: "Post Classico",
    description: "Clean, versatil, marca forte",
    bg: "bg-gradient-to-br from-zinc-800 via-zinc-900 to-black",
    overlay: "bg-black/40",
    textColor: "text-white",
    accentColor: "text-red-400",
    accentBg: "bg-red-600 text-white",
    titleSize: "text-3xl sm:text-4xl",
    subtitleSize: "text-base sm:text-lg",
    layout: "split",
  },
];

interface Props {
  onExport: (dataUrl: string) => void;
}

export function CampaignVisualEditor({ onExport }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<TemplateConfig>(TEMPLATES[0]);
  const [title, setTitle] = useState("PROMO ESPECIAL");
  const [subtitle, setSubtitle] = useState("So hoje no Boteco da Estacao");
  const [badge, setBadge] = useState("50% OFF");
  const [detail, setDetail] = useState("Valido para consumo no local");
  const [photo, setPhoto] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  async function handleExport() {
    if (!canvasRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL("image/png");
      onExport(dataUrl);

      // Auto download
      const link = document.createElement("a");
      link.download = `boteco-${template.id}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export error:", err);
    }
    setExporting(false);
  }

  return (
    <div className="space-y-5">
      {/* Template picker */}
      <div>
        <label className="text-xs font-semibold mb-2 block">Template</label>
        <div className="grid grid-cols-5 gap-1.5">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t)}
              className={`p-2 rounded-lg border text-center transition-all ${
                template.id === t.id
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <div className={`w-full h-6 rounded ${t.bg} mb-1`} />
              <span className="text-[9px] font-medium leading-tight block">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Photo upload */}
      <div>
        <label className="text-xs font-semibold mb-2 block">Foto de fundo</label>
        <div className="flex gap-2 items-center">
          <label className="flex-1 h-9 flex items-center justify-center text-xs font-medium border border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            {photo ? "Trocar foto" : "Subir foto (opcional)"}
          </label>
          {photo && (
            <button
              onClick={() => setPhoto(null)}
              className="h-9 px-3 text-xs text-red-600 border border-border rounded-lg hover:bg-red-50"
            >
              Remover
            </button>
          )}
        </div>
      </div>

      {/* Text fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-muted-foreground">Titulo principal</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-9 px-3 text-xs bg-background border border-border rounded-lg"
            placeholder="PROMO ESPECIAL"
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground">Badge / Destaque</label>
          <input
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            className="w-full h-9 px-3 text-xs bg-background border border-border rounded-lg"
            placeholder="50% OFF"
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground">Subtitulo</label>
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full h-9 px-3 text-xs bg-background border border-border rounded-lg"
            placeholder="So hoje no Boteco"
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground">Detalhe / Validade</label>
          <input
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            className="w-full h-9 px-3 text-xs bg-background border border-border rounded-lg"
            placeholder="Valido ate 30/03"
          />
        </div>
      </div>

      {/* ===== PREVIEW CANVAS ===== */}
      <div>
        <label className="text-xs font-semibold mb-2 block">Preview</label>
        <div
          ref={canvasRef}
          className={`relative w-full aspect-square rounded-2xl overflow-hidden ${template.bg}`}
          style={{ maxWidth: 480 }}
        >
          {/* Photo background */}
          {photo && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${photo})` }}
            />
          )}

          {/* Overlay */}
          <div className={`absolute inset-0 ${template.overlay}`} />

          {/* Grain texture */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }} />

          {/* Content based on layout */}
          <div className="relative h-full flex flex-col justify-between p-6 sm:p-8">
            {/* Top bar */}
            <div className="flex items-start justify-between">
              <div className={`flex items-center gap-2 ${template.textColor}`}>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-[10px] font-black">BE</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase opacity-80">Boteco da Estacao</p>
                </div>
              </div>
              {badge && (
                <div className={`px-3 py-1.5 rounded-lg font-black text-sm tracking-tight ${template.accentBg}`}>
                  {badge}
                </div>
              )}
            </div>

            {/* Center content */}
            {(template.layout === "center" || template.layout === "split") && (
              <div className="flex-1 flex flex-col justify-center">
                <h1 className={`${template.titleSize} font-black leading-[0.9] tracking-tighter ${template.textColor} uppercase`}>
                  {title}
                </h1>
                {subtitle && (
                  <p className={`${template.subtitleSize} font-medium mt-2 ${template.accentColor} leading-tight`}>
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Bottom content (for bottom/editorial) */}
            {(template.layout === "bottom" || template.layout === "editorial") && (
              <div className="flex-1" />
            )}

            {/* Bottom section */}
            <div>
              {(template.layout === "bottom" || template.layout === "editorial") && (
                <div className="mb-4">
                  <h1 className={`${template.titleSize} font-black leading-[0.9] tracking-tighter ${template.textColor} uppercase`}>
                    {title}
                  </h1>
                  {subtitle && (
                    <p className={`${template.subtitleSize} font-medium mt-2 ${template.accentColor} leading-tight`}>
                      {subtitle}
                    </p>
                  )}
                </div>
              )}

              {/* Detail + divider */}
              {detail && (
                <div className={`flex items-center gap-3 pt-3 border-t border-white/20 ${template.textColor}`}>
                  <div className="w-1 h-4 bg-current rounded-full opacity-40" />
                  <p className="text-[11px] font-medium tracking-wide uppercase opacity-70">{detail}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Export */}
      <button
        onClick={handleExport}
        disabled={exporting}
        className="w-full h-11 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {exporting ? "Exportando..." : "Baixar imagem (PNG)"}
      </button>
    </div>
  );
}
