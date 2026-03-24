import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts, getCategories } from "@/lib/queries/menu";
import { serialize } from "@/lib/utils";
import { ProductCard } from "@/components/storefront/product-card";
import { AgendaBanner } from "@/components/storefront/agenda-banner";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  const featuredData = serialize(featured);
  const categoriesData = serialize(categories);

  return (
    <div className="pb-20 md:pb-0">
      {/* ─────────────────────────────────────────────── */}
      {/* HERO — Compacto. Vende o ambiente + CTA claro.  */}
      {/* No mobile, o usuario ja ve conteudo abaixo.     */}
      {/* ─────────────────────────────────────────────── */}
      <section className="relative h-[52vh] min-h-[320px] max-h-[480px] overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="Boteco da Estacao — noite com luzinhas e publico"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Top pills */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[11px] text-white/80 font-medium">Aberto agora</span>
          </div>
          <a
            href="#agenda"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/80 backdrop-blur-md rounded-full border border-purple-300/20 hover:bg-purple-500/90 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="18" r="4" /><path d="M16 18V2" />
            </svg>
            <span className="text-[11px] text-white font-medium">Agenda</span>
          </a>
        </div>

        {/* Content — posicionado mais acima pra dar respiro pro banner */}
        <div className="absolute bottom-16 inset-x-0 px-5 sm:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2.5 mb-2">
              <Image src="/logo.png" alt="" width={44} height={44} className="rounded-full border-2 border-white/20" />
              <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Desde 2016</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Boteco da Estacao
            </h1>
            <p className="mt-1 text-sm text-white/50">
              Olarias, Ponta Grossa · Seg-Sab 17h · Dom 16h
            </p>
            <div className="mt-4 flex gap-2.5">
              <Link
                href="/cardapio"
                className="inline-flex items-center justify-center h-11 px-6 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-90 transition-opacity"
              >
                Pedir agora
              </Link>
              <a
                href="https://wa.me/5542999327823"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-11 px-5 bg-white/10 backdrop-blur-sm text-white font-medium text-sm rounded-xl border border-white/15 hover:bg-white/20 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────── */}
      {/* PROMO BANNER — Visivel sem scroll no mobile.    */}
      {/* Apelo de venda imediato.                        */}
      {/* ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 mb-2">
        <Link
          href="/cardapio/house-burguer"
          className="block p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
              <Image
                src="/hero.jpg"
                alt="House Burguer"
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-block px-2 py-0.5 bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[10px] font-bold rounded-full uppercase tracking-wide">
                Mais pedido da casa
              </span>
              <h3 className="mt-1.5 text-base font-bold leading-tight">House Burguer</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Costela 160g, cheddar cremoso, maionese da casa</p>
            </div>
            <div className="shrink-0 text-right">
              <span className="text-lg font-bold text-foreground">R$ 46,99</span>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">Ver detalhes</p>
            </div>
          </div>
        </Link>
      </section>

      {/* ─────────────────────────────────────────────── */}
      {/* CATEGORIAS — Navegacao rapida                   */}
      {/* ─────────────────────────────────────────────── */}
      {categoriesData.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pt-6 pb-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {categoriesData.map((cat: { id: string; name: string; slug: string }) => (
              <Link
                key={cat.id}
                href={`/cardapio?categoria=${cat.slug}`}
                className="shrink-0 px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────── */}
      {/* DESTAQUES — O cardapio comeca a vender aqui     */}
      {/* ─────────────────────────────────────────────── */}
      {featuredData.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight">Mais pedidos</h2>
            <Link
              href="/cardapio"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Ver cardapio
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {featuredData.map((product: {
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
                id={product.id}
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
      {/* AGENDA — Compacta, complementar                 */}
      {/* ─────────────────────────────────────────────── */}
      <AgendaBanner />

      {/* ─────────────────────────────────────────────── */}
      {/* O BOTECO — Contexto rapido + social proof       */}
      {/* ─────────────────────────────────────────────── */}
      <section className="bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
                Desde 2016
              </span>
              <h2 className="mt-1 text-xl font-bold tracking-tight">
                Mais que um bar. O point de Ponta Grossa.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Predio historico, cerveja gelada, lanche artesanal e musica ao vivo.
                O Boteco da Estacao e onde todo mundo se encontra.
              </p>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-amber-500">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span className="font-semibold">4.7</span>
                  <span className="text-muted-foreground">Google</span>
                </div>
                <span className="text-border">|</span>
                <div>
                  <span className="font-semibold">10K+</span>
                  <span className="text-muted-foreground ml-1">seguidores</span>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Link
                  href="/sobre"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Conhecer o Boteco
                </Link>
                <a
                  href="https://instagram.com/botecodaestacao"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  @botecodaestacao
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                <Image src="/fachada.jpg" alt="Fachada" fill className="object-cover" sizes="25vw" />
              </div>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                <Image src="/musica.jpg" alt="Musica ao vivo" fill className="object-cover" sizes="25vw" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────── */}
      {/* CTA FINAL                                       */}
      {/* ─────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-bold tracking-tight">Bateu a fome?</h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Faca seu pedido online ou venha nos visitar
        </p>
        <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/cardapio"
            className="inline-flex items-center justify-center h-11 px-7 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-90 transition-opacity"
          >
            Pedir agora
          </Link>
          <a
            href="https://maps.google.com/?q=Boteco+da+Estacao+Ponta+Grossa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-11 px-7 bg-secondary text-secondary-foreground font-semibold text-sm rounded-xl hover:bg-secondary/80 transition-colors"
          >
            Como chegar
          </a>
        </div>
      </section>
    </div>
  );
}
