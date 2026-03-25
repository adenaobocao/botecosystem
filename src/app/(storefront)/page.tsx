import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts, getCategories } from "@/lib/queries/menu";
import { serialize } from "@/lib/utils";
import { ProductCard } from "@/components/storefront/product-card";
import { AgendaBanner } from "@/components/storefront/agenda-banner";
import { ReservationWrapper } from "@/components/storefront/reservation-wrapper";
// Hero uses video background

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
      <section className="relative h-[52vh] min-h-[320px] max-h-[480px] overflow-hidden bg-black">
        {/* Poster instantaneo enquanto video carrega */}
        <Image
          src="/hero.jpg"
          alt="Boteco da Estacao"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={75}
        />
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster="/hero.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Top pill */}
        <div className="absolute top-4 inset-x-4 flex items-center">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[11px] text-white/80 font-medium">Aberto agora</span>
          </div>
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
              <a
                href="#agenda"
                className="inline-flex items-center justify-center w-11 h-11 bg-white/10 backdrop-blur-sm text-white rounded-xl border border-white/15 hover:bg-purple-500/30 hover:border-purple-300/20 transition-colors"
                title="Agenda"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────── */}
      {/* PROMO CARROSSEL — Top 3, cores contrastantes    */}
      {/* ─────────────────────────────────────────────── */}
      {featuredData.length > 0 && (
        <section className="max-w-7xl mx-auto -mt-8 relative z-10 mb-2">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1 snap-x snap-mandatory">
            {featuredData.slice(0, 3).map((product: {
              id: string;
              name: string;
              slug: string;
              description: string | null;
              image: string | null;
              basePrice: number;
              promoPrice?: number | null;
              category: { name: string; slug: string };
            }, idx: number) => {
              const colors = [
                { bg: "bg-red-50 dark:bg-red-950/20", border: "border-red-200/60 dark:border-red-800/30", tagBg: "bg-red-500/15", tagText: "text-red-700 dark:text-red-400", accent: "text-red-600 dark:text-red-400", label: "#1 da semana" },
                { bg: "bg-amber-50 dark:bg-amber-950/20", border: "border-amber-200/60 dark:border-amber-800/30", tagBg: "bg-amber-500/15", tagText: "text-amber-700 dark:text-amber-400", accent: "text-amber-600 dark:text-amber-400", label: "#2 da semana" },
                { bg: "bg-violet-50 dark:bg-violet-950/20", border: "border-violet-200/60 dark:border-violet-800/30", tagBg: "bg-violet-500/15", tagText: "text-violet-700 dark:text-violet-400", accent: "text-violet-600 dark:text-violet-400", label: "#3 da semana" },
              ][idx];

              return (
                <Link
                  key={product.id}
                  href={`/cardapio/${product.slug}`}
                  className={`shrink-0 w-[85vw] max-w-[340px] snap-start p-4 rounded-2xl border shadow-lg hover:shadow-xl transition-shadow ${colors.bg} ${colors.border}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                      {product.image ? (
                        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="80px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl text-muted-foreground">🍽️</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`inline-block px-2 py-0.5 ${colors.tagBg} ${colors.tagText} text-[10px] font-bold rounded-full uppercase tracking-wide`}>
                        {colors.label}
                      </span>
                      <h3 className="mt-1.5 text-base font-bold leading-tight truncate">{product.name}</h3>
                      {product.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{product.description}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      {product.promoPrice ? (
                        <>
                          <span className="text-lg font-bold text-foreground">
                            {Number(product.promoPrice).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </span>
                          <p className="text-[10px] text-muted-foreground line-through">
                            {Number(product.basePrice).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </p>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-foreground">
                          {Number(product.basePrice).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                      )}
                      <p className={`text-[10px] ${colors.accent} font-medium mt-0.5`}>Ver detalhes</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

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
              promoPrice?: number | null;
              preparationTime: number | null;
              _count?: { optionGroups: number; variants: number };
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
                promoPrice={product.promoPrice}
                isFeatured={true}
                _count={product._count}
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
      {/* MESA ESPECIAL — Reserva discreta                */}
      {/* ─────────────────────────────────────────────── */}
      <ReservationWrapper />

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
