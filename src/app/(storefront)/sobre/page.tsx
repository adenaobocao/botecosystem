import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheca o Boteco da Estacao. Desde 2016, referencia em lanches, porcoes e boa musica em Ponta Grossa.",
};

export default function SobrePage() {
  return (
    <div className="pb-20 md:pb-0">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[300px] max-h-[500px] overflow-hidden">
        <Image
          src="/fachada.jpg"
          alt="Fachada historica do Boteco da Estacao"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10">
          <span className="text-xs font-bold uppercase tracking-wider text-white/60">
            Desde 2016
          </span>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Sobre o Boteco
          </h1>
        </div>
      </section>

      {/* Historia */}
      <section className="max-w-3xl mx-auto px-4 py-10">
        <div className="prose prose-neutral max-w-none">
          <p className="text-lg leading-relaxed text-muted-foreground">
            O Boteco da Estacao e referencia em hamburgueres, lanches, porcoes e
            bons momentos em Ponta Grossa. Instalado em um predio historico no
            bairro Olarias, a casa une sabor, tradicao e um ambiente
            descontraido para quem quer comer bem e curtir.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Mais do que uma hamburgueria, o Boteco da Estacao e um ponto de
            encontro. Com musica ao vivo, roda de samba nas segundas-feiras e
            atracoes ao longo da semana, o espaco convida a relaxar com os
            amigos, saborear um lanche artesanal e tomar uma cerveja gelada.
          </p>
        </div>
      </section>

      {/* Numeros */}
      <section className="bg-card border-y border-border">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-extrabold tracking-tight text-primary">2016</p>
              <p className="mt-1 text-sm text-muted-foreground">Fundacao</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold tracking-tight">4.7</p>
              <p className="mt-1 text-sm text-muted-foreground">Nota no Google</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold tracking-tight">10K+</p>
              <p className="mt-1 text-sm text-muted-foreground">Seguidores</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold tracking-tight">40+</p>
              <p className="mt-1 text-sm text-muted-foreground">Itens no cardapio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold tracking-tight mb-6">O ambiente</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
            <Image
              src="/ambiente.jpg"
              alt="Publico curtindo a noite no Boteco"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
            <Image
              src="/hero.jpg"
              alt="Ambiente com luzinhas"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
            <Image
              src="/musica.jpg"
              alt="Musica ao vivo"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
            <Image
              src="/mesas.jpg"
              alt="Mesas ao ar livre"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="bg-card border-y border-border">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Horarios */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Horario
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Segunda a Sabado</span>
                  <span className="font-medium">17h - 23h30</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingo</span>
                  <span className="font-medium">16h - 23h</span>
                </div>
              </div>
            </div>

            {/* Endereco */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Endereco
              </h3>
              <p className="text-sm leading-relaxed">
                Rua Ermelino de Leao, 1565
                <br />
                Olarias — Ponta Grossa, PR
                <br />
                CEP 84035-000
              </p>
              <a
                href="https://maps.google.com/?q=Boteco+da+Estacao+Ponta+Grossa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm font-medium text-primary hover:underline"
              >
                Abrir no Google Maps
              </a>
            </div>

            {/* Contato */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Contato
              </h3>
              <div className="space-y-2 text-sm">
                <a
                  href="https://wa.me/5542999327823"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-primary transition-colors"
                >
                  (42) 99932-7823
                </a>
                <a
                  href="https://instagram.com/botecodaestacao"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-primary transition-colors"
                >
                  @botecodaestacao
                </a>
                <a
                  href="mailto:botecoestacao.pg@gmail.com"
                  className="block hover:text-primary transition-colors"
                >
                  botecoestacao.pg@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Vem pro Boteco</h2>
        <p className="mt-2 text-muted-foreground">
          Faca seu pedido ou reserve sua mesa
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/cardapio"
            className="inline-flex items-center justify-center h-12 px-8 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-90 transition-opacity"
          >
            Pedir agora
          </Link>
          <a
            href="https://wa.me/5542999327823"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-12 px-8 bg-secondary text-secondary-foreground font-semibold text-sm rounded-xl hover:bg-secondary/80 transition-colors"
          >
            Falar no WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
