import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts } from "@/lib/queries/menu";
import { serialize } from "@/lib/utils";
import { ProductCard } from "@/components/storefront/product-card";

export const dynamic = "force-dynamic";

const agenda = [
  { dia: "Segunda", atracao: "Roda de Samba", destaque: true },
  { dia: "Terca", atracao: "Em breve", destaque: false },
  { dia: "Quarta", atracao: "Em breve", destaque: false },
  { dia: "Quinta", atracao: "Em breve", destaque: false },
  { dia: "Sexta", atracao: "Em breve", destaque: false },
  { dia: "Sabado", atracao: "Em breve", destaque: false },
  { dia: "Domingo", atracao: "Em breve", destaque: false },
];

const galeria = [
  { src: "/fachada.jpg", alt: "Fachada historica do Boteco da Estacao" },
  { src: "/ambiente.jpg", alt: "Publico curtindo a noite" },
  { src: "/hero.jpg", alt: "Ambiente com luzinhas" },
  { src: "/musica.jpg", alt: "Musica ao vivo" },
  { src: "/mesas.jpg", alt: "Mesas ao ar livre" },
];

export default async function HomePage() {
  const featured = serialize(await getFeaturedProducts());

  return (
    <div className="pb-20 md:pb-0">
      {/* ============================================= */}
      {/* HERO — Full viewport, imersivo               */}
      {/* ============================================= */}
      <section className="relative h-[85vh] min-h-[500px] max-h-[800px] overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="Boteco da Estacao — noite com luzinhas e publico"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-16 max-w-5xl">
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/logo.png"
              alt="Logo"
              width={48}
              height={48}
              className="rounded-full border-2 border-white/20"
            />
            <span className="text-white/60 text-sm font-medium tracking-wide uppercase">
              Desde 2016
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Boteco da Estacao
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-white/75 max-w-lg leading-relaxed">
            Lanches artesanais, porcoes generosas, cervejas geladas e musica ao vivo. O point de Ponta Grossa.
          </p>

          {/* Stats */}
          <div className="mt-5 flex items-center gap-5 text-sm text-white/60">
            <div className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-white font-semibold">4.7</span>
              <span>no Google</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div>
              <span className="text-white font-semibold">10K+</span> seguidores
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div>Olarias, PG</div>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/cardapio"
              className="inline-flex items-center justify-center h-13 px-8 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-90 transition-opacity"
            >
              Pedir agora
            </Link>
            <a
              href="https://wa.me/5542999327823"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-13 px-8 bg-white/10 backdrop-blur-sm text-white font-semibold text-sm rounded-xl border border-white/15 hover:bg-white/20 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* BARRA DE INFO — Horario + Status              */}
      {/* ============================================= */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-6 overflow-x-auto scrollbar-hide text-sm">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-medium">Aberto agora</span>
          </div>
          <div className="w-px h-5 bg-border shrink-0" />
          <div className="shrink-0 text-muted-foreground">
            <span className="font-medium text-foreground">Seg-Sab</span> 17h-23h30
          </div>
          <div className="w-px h-5 bg-border shrink-0" />
          <div className="shrink-0 text-muted-foreground">
            <span className="font-medium text-foreground">Dom</span> 16h-23h
          </div>
          <div className="w-px h-5 bg-border shrink-0" />
          <div className="shrink-0 text-muted-foreground">
            R. Ermelino de Leao, 1565 — Olarias
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* AGENDA DA SEMANA                              */}
      {/* ============================================= */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Agenda da semana</h2>
            <p className="text-sm text-muted-foreground mt-1">O que rola no Boteco</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {agenda.map((item) => (
            <div
              key={item.dia}
              className={`relative p-4 rounded-xl border text-center transition-all ${
                item.destaque
                  ? "bg-primary/5 border-primary/30 ring-1 ring-primary/20"
                  : "bg-card border-border"
              }`}
            >
              <span className={`text-xs font-bold uppercase tracking-wider ${
                item.destaque ? "text-primary" : "text-muted-foreground"
              }`}>
                {item.dia}
              </span>
              <p className={`mt-2 text-sm font-medium leading-tight ${
                item.destaque ? "text-foreground" : "text-muted-foreground"
              }`}>
                {item.atracao}
              </p>
              {item.destaque && (
                <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full uppercase">
                  Ao vivo
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================= */}
      {/* DESTAQUES DO CARDAPIO                         */}
      {/* ============================================= */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Destaques da casa</h2>
              <p className="text-sm text-muted-foreground mt-1">Os mais pedidos</p>
            </div>
            <Link
              href="/cardapio"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Ver cardapio completo
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

      {/* ============================================= */}
      {/* O BOTECO — Preview do Sobre                   */}
      {/* ============================================= */}
      <section className="bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Desde 2016
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                Mais que um bar. Um ponto de encontro.
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Instalado em um predio historico no coracao de Olarias, o Boteco da Estacao
                une boa comida, cerveja gelada e musica ao vivo. Um ambiente descontraido
                pra quem quer comer bem e curtir com os amigos.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/sobre"
                  className="inline-flex items-center justify-center h-11 px-6 bg-secondary text-secondary-foreground font-semibold text-sm rounded-xl hover:bg-secondary/80 transition-colors"
                >
                  Conhecer o Boteco
                </Link>
                <a
                  href="https://instagram.com/botecodaestacao"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-11 px-6 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  @botecodaestacao
                </a>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/fachada.jpg"
                alt="Fachada historica do Boteco da Estacao"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* GALERIA                                       */}
      {/* ============================================= */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold tracking-tight mb-6">A experiencia</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {galeria.map((foto) => (
            <div key={foto.src} className="relative aspect-square rounded-xl overflow-hidden">
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ============================================= */}
      {/* CTA FINAL                                     */}
      {/* ============================================= */}
      <section className="bg-primary">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground tracking-tight">
            Bateu a fome?
          </h2>
          <p className="mt-2 text-primary-foreground/70">
            Faca seu pedido online ou venha nos visitar
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/cardapio"
              className="inline-flex items-center justify-center h-12 px-8 bg-white text-primary font-bold text-sm rounded-xl hover:bg-white/90 transition-colors"
            >
              Ver cardapio
            </Link>
            <a
              href="https://maps.google.com/?q=Boteco+da+Estacao+Ponta+Grossa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-12 px-8 bg-primary-foreground/10 text-primary-foreground font-semibold text-sm rounded-xl border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-colors"
            >
              Como chegar
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
