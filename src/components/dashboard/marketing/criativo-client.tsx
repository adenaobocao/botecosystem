"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export function CriativoClient({ products }: Props) {
  const router = useRouter();
  const [exportedImages, setExportedImages] = useState<string[]>([]);
  const [lastDataUrl, setLastDataUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  function handleExport(dataUrl: string) {
    setExportedImages((prev) => [dataUrl, ...prev]);
    setLastDataUrl(dataUrl);
  }

  async function handleUseCampaign() {
    if (!lastDataUrl) return;
    setUploading(true);
    try {
      // Upload imagem e pega URL publica
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
      <div className="flex items-center gap-3">
        <Link href="/dashboard/marketing" className="text-muted-foreground hover:text-foreground">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Criativo</h1>
          <p className="text-sm text-muted-foreground">Crie artes profissionais para campanhas e redes sociais</p>
        </div>
      </div>

      <CampaignVisualEditor onExport={handleExport} products={products} />

      {/* Use in campaign button */}
      {lastDataUrl && (
        <button
          onClick={handleUseCampaign}
          disabled={uploading}
          className="w-full h-11 text-xs font-semibold border-2 border-primary text-primary rounded-lg hover:bg-primary/5 disabled:opacity-50 transition-colors"
        >
          {uploading ? "Preparando imagem..." : "Usar em campanha WhatsApp"}
        </button>
      )}

      {exportedImages.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Exportados nessa sessao ({exportedImages.length})
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
