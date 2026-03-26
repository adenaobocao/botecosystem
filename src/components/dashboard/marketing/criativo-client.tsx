"use client";

import { useState } from "react";
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
  const [exportedImages, setExportedImages] = useState<string[]>([]);

  function handleExport(dataUrl: string) {
    setExportedImages((prev) => [dataUrl, ...prev]);
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
