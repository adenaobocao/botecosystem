"use client";

import { useState, useRef, useCallback } from "react";

// ===== TYPES =====

interface TemplateConfig {
  id: string;
  label: string;
  bg: string;
  overlay: string;
  textColor: string;
  accentColor: string;
  accentBg: string;
  titleSize: string;
  subtitleSize: string;
  layout: "center" | "bottom" | "split" | "editorial";
}

interface Product {
  id: string;
  name: string;
  image: string | null;
  price: number;
}

const TEMPLATES: TemplateConfig[] = [
  {
    id: "promo_flash", label: "Promo Flash",
    bg: "bg-gradient-to-br from-red-600 via-red-700 to-red-900",
    overlay: "bg-black/20", textColor: "text-white",
    accentColor: "text-amber-300", accentBg: "bg-amber-400 text-red-900",
    titleSize: "text-4xl sm:text-5xl", subtitleSize: "text-lg sm:text-xl", layout: "center",
  },
  {
    id: "happy_hour", label: "Happy Hour",
    bg: "bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900",
    overlay: "bg-black/30", textColor: "text-white",
    accentColor: "text-amber-200", accentBg: "bg-white text-amber-800",
    titleSize: "text-4xl sm:text-5xl", subtitleSize: "text-lg sm:text-xl", layout: "bottom",
  },
  {
    id: "evento", label: "Evento / Show",
    bg: "bg-gradient-to-br from-zinc-900 via-neutral-900 to-black",
    overlay: "bg-gradient-to-t from-black/80 via-black/40 to-transparent",
    textColor: "text-white", accentColor: "text-violet-300", accentBg: "bg-violet-500 text-white",
    titleSize: "text-3xl sm:text-4xl", subtitleSize: "text-base sm:text-lg", layout: "editorial",
  },
  {
    id: "reativacao", label: "Volta pro Boteco",
    bg: "bg-gradient-to-br from-orange-500 via-red-500 to-rose-600",
    overlay: "bg-black/25", textColor: "text-white",
    accentColor: "text-yellow-200", accentBg: "bg-white text-rose-700",
    titleSize: "text-3xl sm:text-4xl", subtitleSize: "text-lg", layout: "center",
  },
  {
    id: "generico", label: "Post Classico",
    bg: "bg-gradient-to-br from-zinc-800 via-zinc-900 to-black",
    overlay: "bg-black/40", textColor: "text-white",
    accentColor: "text-red-400", accentBg: "bg-red-600 text-white",
    titleSize: "text-3xl sm:text-4xl", subtitleSize: "text-base sm:text-lg", layout: "split",
  },
];

interface Props {
  onExport: (dataUrl: string) => void;
  products: Product[];
  initialTitle?: string;
  initialSubtitle?: string;
}

export function CampaignVisualEditor({ onExport, products, initialTitle, initialSubtitle }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<TemplateConfig>(TEMPLATES[0]);
  const [title, setTitle] = useState(initialTitle || "PROMO ESPECIAL");
  const [subtitle, setSubtitle] = useState(initialSubtitle || "So hoje no Boteco da Estacao");
  const [badge, setBadge] = useState("50% OFF");
  const [detail, setDetail] = useState("Valido para consumo no local");
  const [bgPhoto, setBgPhoto] = useState<string | null>(null);
  const [productPhoto, setProductPhoto] = useState<string | null>(null);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleFileUpload = useCallback((setter: (v: string | null) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => setter(ev.target?.result as string);
      reader.readAsDataURL(file);
    };
  }, []);

  function selectProduct(product: Product) {
    if (product.image) {
      setProductPhoto(product.image);
    }
    setTitle(product.name.toUpperCase());
    setSubtitle(`R$ ${product.price.toFixed(2)}`);
    setShowProductPicker(false);
  }

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
                template.id === t.id ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40"
              }`}
            >
              <div className={`w-full h-6 rounded ${t.bg} mb-1`} />
              <span className="text-[9px] font-medium leading-tight block">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Photos */}
      <div className="grid grid-cols-2 gap-3">
        {/* Background photo */}
        <div>
          <label className="text-[10px] text-muted-foreground mb-1 block">Foto de fundo</label>
          <div className="flex gap-1.5">
            <label className="flex-1 h-9 flex items-center justify-center text-[10px] font-medium border border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50">
              <input type="file" accept="image/*" onChange={handleFileUpload(setBgPhoto)} className="hidden" />
              {bgPhoto ? "Trocar" : "Subir foto"}
            </label>
            {bgPhoto && (
              <button onClick={() => setBgPhoto(null)} className="h-9 px-2 text-[10px] text-red-600 border border-border rounded-lg hover:bg-red-50">
                X
              </button>
            )}
          </div>
        </div>

        {/* Product photo */}
        <div>
          <label className="text-[10px] text-muted-foreground mb-1 block">Foto do produto</label>
          <div className="flex gap-1.5">
            <label className="flex-1 h-9 flex items-center justify-center text-[10px] font-medium border border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50">
              <input type="file" accept="image/*" onChange={handleFileUpload(setProductPhoto)} className="hidden" />
              {productPhoto ? "Trocar PNG" : "Subir PNG"}
            </label>
            {productPhoto && (
              <button onClick={() => setProductPhoto(null)} className="h-9 px-2 text-[10px] text-red-600 border border-border rounded-lg hover:bg-red-50">
                X
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product picker from menu */}
      <div>
        <button
          onClick={() => setShowProductPicker(!showProductPicker)}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${showProductPicker ? "rotate-90" : ""}`}>
            <path d="m9 18 6-6-6-6" />
          </svg>
          Escolher produto do cardapio
        </button>
        {showProductPicker && (
          <div className="mt-2 max-h-52 overflow-y-auto rounded-xl border border-border bg-card">
            <div className="grid grid-cols-2 gap-0.5 p-1.5">
              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectProduct(p)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/70 transition-colors text-left"
                >
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <span className="text-[8px] text-muted-foreground">SEM IMG</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium truncate">{p.name}</p>
                    <p className="text-[10px] text-primary font-bold">R$ {p.price.toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Text fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-muted-foreground">Titulo principal</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-9 px-3 text-xs bg-background border border-border rounded-lg" />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground">Badge / Destaque</label>
          <input value={badge} onChange={(e) => setBadge(e.target.value)} className="w-full h-9 px-3 text-xs bg-background border border-border rounded-lg" />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground">Subtitulo</label>
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full h-9 px-3 text-xs bg-background border border-border rounded-lg" />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground">Detalhe / Validade</label>
          <input value={detail} onChange={(e) => setDetail(e.target.value)} className="w-full h-9 px-3 text-xs bg-background border border-border rounded-lg" />
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
          {/* Background photo */}
          {bgPhoto && (
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgPhoto})` }} />
          )}

          {/* Overlay */}
          <div className={`absolute inset-0 ${template.overlay}`} />

          {/* Grain texture */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }} />

          {/* Product image (floating, bottom-right area) */}
          {productPhoto && (
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10">
              <div className="relative">
                <img
                  src={productPhoto}
                  alt="Produto"
                  className="w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
                  crossOrigin="anonymous"
                />
                {/* Glow behind product */}
                <div className="absolute inset-0 -z-10 blur-2xl opacity-30 bg-white rounded-full scale-75" />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="relative h-full flex flex-col justify-between p-6 sm:p-8">
            {/* Top bar -- Logo real + badge */}
            <div className="flex items-start justify-between">
              <div className={`flex items-center gap-2.5 ${template.textColor}`}>
                {/* Logo real do Boteco redondinha */}
                <img
                  src="/logo.png"
                  alt="Boteco da Estacao"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white/30 shadow-lg"
                  crossOrigin="anonymous"
                />
                <div>
                  <p className="text-[11px] font-extrabold tracking-wide uppercase leading-tight">
                    Boteco da Estacao
                  </p>
                  <p className="text-[8px] font-medium uppercase tracking-widest opacity-50">
                    Ponta Grossa - PR
                  </p>
                </div>
              </div>
              {badge && (
                <div className={`px-3 py-1.5 rounded-lg font-black text-sm tracking-tight shadow-lg ${template.accentBg}`}>
                  {badge}
                </div>
              )}
            </div>

            {/* Center content */}
            {(template.layout === "center" || template.layout === "split") && (
              <div className={`flex-1 flex flex-col justify-center ${productPhoto ? "max-w-[60%]" : ""}`}>
                <h1 className={`${template.titleSize} font-black leading-[0.85] tracking-tighter ${template.textColor} uppercase`}>
                  {title}
                </h1>
                {subtitle && (
                  <p className={`${template.subtitleSize} font-semibold mt-3 ${template.accentColor} leading-tight`}>
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Spacer for bottom/editorial */}
            {(template.layout === "bottom" || template.layout === "editorial") && (
              <div className="flex-1" />
            )}

            {/* Bottom section */}
            <div>
              {(template.layout === "bottom" || template.layout === "editorial") && (
                <div className={`mb-4 ${productPhoto ? "max-w-[60%]" : ""}`}>
                  <h1 className={`${template.titleSize} font-black leading-[0.85] tracking-tighter ${template.textColor} uppercase`}>
                    {title}
                  </h1>
                  {subtitle && (
                    <p className={`${template.subtitleSize} font-semibold mt-3 ${template.accentColor} leading-tight`}>
                      {subtitle}
                    </p>
                  )}
                </div>
              )}

              {detail && (
                <div className={`flex items-center gap-3 pt-3 border-t border-white/15 ${template.textColor}`}>
                  <div className="w-1 h-4 bg-current rounded-full opacity-30" />
                  <p className="text-[11px] font-medium tracking-wide uppercase opacity-60">{detail}</p>
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
