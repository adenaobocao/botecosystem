import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts } from "@/lib/queries/menu";
import { serialize } from "@/lib/utils";
import { ProductCard } from "@/components/storefront/product-card";
import { AgendaBanner } from "@/components/storefront/agenda-banner";

export const dynamic = "force-dynamic";

const galeria = [
  { src: "/ambiente.jpg", alt: "Publico curtindo a noite", span: "col-span-2 row-span-2" },
  { src: "/musica.jpg", alt: "Musica ao vivo", span: "" },
  { src: "/mesas.jpg", alt: "Mesas ao ar livre", span: "" },
];

export default async function HomePage() {
  const featured = serialize(await getFeaturedProducts());

  return (
    <div className="pb-20 md:pb-0">
      {/* ─────────────────────────────────────────────── */}
      {/* HERO — A foto é o protagonista.                 */}
      {/* Mínimo de UI. A atmosfera vende sozinha.        */}
      {/* ─────────────────────────────────────────────── */}
      <section className="relative h-[92vh] min-h-[560px] max-h-[900px] overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="Boteco da Estacao — noite com luzinhas e publico"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={85}
        />
        {/* Gradiente mínimo — só o suficiente para ler o texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

        {/* Badge sutil no topo */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/30 backdrop-blur-md rounded-full border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[11px] text-white/80 font-medium tracking-wide">
              Aberto agora
            </span>
          </div>
        </div>

        {/* Conteúdo mínimo no rodapé */}
        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Boteco da Estacao
            </h1>
            <p className="mt-2 text-base sm:text-lg text-white/60 max-w-md">
              Lanches, porcoes, cerveja gelada e musica ao vivo.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex gap-3">
              <Link
                href="/cardapio"
                className="inline-flex items-center justify-center h-12 px-7 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-90 transition-opacity"
              >
                Ver cardapio
              </Link>
              <a
                href="https://wa.me/5542999327823"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-7 bg-white/10 backdrop-blur-sm text-white font-semibold text-sm rounded-xl border border-white/15 hover:bg-white/20 transition-colors"
              >
                WhatsApp
              </a>
            </div>

            {/* Info row — discreto */}
            <div className="mt-5 flex items-center gap-4 text-[13px] text-white/45">
              <div className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400/80">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span className="text-white/70 font-medium">4.7</span>
              </div>
              <span className="text-white/20">|</span>
              <span>Olarias, Ponta Grossa</span>
              <span className="text-white/20">|</span>
              <span>Seg-Sab 17h · Dom 16h</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────── */}
      {/* AGENDA — Compacta. Pill do dia, expandível.     */}
      {/* ─────────────────────────────────────────────── */}
      <AgendaBanner />

      {/* ─────────────────────────────────────────────── */}
      {/* DESTAQUES DO CARDÁPIO                           */}
      {/* ─────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold tracking-tight">Destaques da casa</h2>
            <Link
              href="/cardapio"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Ver tudo
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {featured.map((product: {
              id: string;
              name: string;
              slug: string;
              description: string | null;
              image: string | null;
              basePrice: number;
              preparationTime: number | null;
              category: { name: string; slug: string };
            }) => (
              <ProductCard
                key={product.id}
                name={product.name}
                slug={product.slug}
                description={product.description}
                image={product.image}
                basePrice={product.basePrice}
                isFeatured={true}
                preparationTime={product.preparationTime}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────── */}
      {/* O BOTECO — Galeria editorial + texto curto      */}
      {/* ─────────────────────────────────────────────── */}
      <section className="bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Texto — 2 colunas */}
            <div className="lg:col-span-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
                Desde 2016
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight leading-tight">
                O point de Ponta Grossa.
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Predio historico, cerveja gelada, lanche artesanal e musica ao vivo.
                O Boteco da Estacao e onde todo mundo se encontra.
              </p>
              <div className="mt-5 flex gap-3">
                <Link
                  href="/sobre"
                  className="inline-flex items-center justify-center h-10 px-5 bg-secondary text-secondary-foreground font-semibold text-sm rounded-xl hover:bg-secondary/80 transition-colors"
                >
                  Sobre nos
                </Link>
                <a
                  href="https://instagram.com/botecodaestacao"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 h-10 px-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  @botecodaestacao
                </a>
              </div>
            </div>

            {/* Galeria editorial — 3 colunas, grid assimétrico */}
            <div className="lg:col-span-3 grid grid-cols-2 gap-2">
              {galeria.map((foto) => (
                <div
                  key={foto.src}
                  className={`relative rounded-xl overflow-hidden ${foto.span} ${
                    foto.span.includes("row-span-2") ? "aspect-square" : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={foto.src}
                    alt={foto.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 30vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────── */}
      {/* CTA FINAL — Limpo, direto                       */}
      {/* ─────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 py-14 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Bateu a fome?</h2>
        <p className="mt-2 text-muted-foreground text-sm">
          Faca seu pedido online ou venha nos visitar
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/cardapio"
            className="inline-flex items-center justify-center h-12 px-8 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-90 transition-opacity"
          >
            Pedir agora
          </Link>
          <a
            href="https://maps.google.com/?q=Boteco+da+Estacao+Ponta+Grossa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-12 px-8 bg-secondary text-secondary-foreground font-semibold text-sm rounded-xl hover:bg-secondary/80 transition-colors"
          >
            Como chegar
          </a>
        </div>
      </section>
    </div>
  );
}
