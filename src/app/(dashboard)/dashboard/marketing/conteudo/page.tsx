import { Metadata } from "next";
import { ContentGenerator } from "@/components/dashboard/marketing/content-generator";
import Link from "next/link";

export const metadata: Metadata = { title: "Gerador de Conteudo | Marketing" };

export default function ConteudoPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/marketing" className="text-muted-foreground hover:text-foreground">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Gerador de conteudo</h1>
          <p className="text-sm text-muted-foreground">Crie textos com IA para redes sociais e WhatsApp</p>
        </div>
      </div>

      <ContentGenerator />
    </div>
  );
}
