import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="pb-20 md:pb-0">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] max-h-[600px] overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="Boteco da Estacao — ambiente com luzinhas"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Boteco da Estacao
          </h1>
          <p className="mt-2 text-base sm:text-lg text-white/80 max-w-md leading-relaxed">
            Hamburgueres artesanais, porcoes e cervejas geladas. Desde 2016 em
            Ponta Grossa.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/cardapio"
              className="inline-flex items-center justify-center h-12 px-8 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:opacity-90 transition-opacity"
            >
              Ver cardapio
            </Link>
            <a
              href="https://wa.me/5542999327823"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-12 px-8 bg-white/15 backdrop-blur-sm text-white font-semibold text-sm rounded-xl border border-white/20 hover:bg-white/25 transition-colors"
            >
              Chamar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Info strip */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between text-sm text-muted-foreground overflow-x-auto gap-6 scrollbar-hide">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>Aberto agora</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-amber-500"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="font-medium text-foreground">4.7</span>
            <span>Google</span>
          </div>
          <div className="shrink-0">R. Ermelino de Leao, 1565</div>
          <div className="shrink-0">Seg-Sab 17h-00h</div>
        </div>
      </section>

      {/* Quick categories */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-lg font-bold tracking-tight">O que voce quer?</h2>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { name: "Hamburgueres", emoji: "🍔" },
            { name: "Porcoes", emoji: "🍟" },
            { name: "Cervejas", emoji: "🍺" },
            { name: "Drinks", emoji: "🍹" },
            { name: "Refrigerantes", emoji: "🥤" },
            { name: "Combos", emoji: "⭐" },
          ].map((cat) => (
            <Link
              key={cat.name}
              href={`/cardapio?categoria=${cat.name.toLowerCase()}`}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-sm font-medium">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured - placeholder for Fase 1.4 */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Destaques</h2>
          <Link
            href="/cardapio"
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver tudo
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Os produtos em destaque aparecerao aqui quando o cardapio estiver
          configurado.
        </p>
      </section>
    </div>
  );
}
