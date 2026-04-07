import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BotecoSystem — Sistema de Pedidos para Bares e Restaurantes",
  description:
    "WebApp completo de pedidos online com IA. Sem comissão, sem instalar nada. Cardápio digital, fidelidade, marketing inteligente.",
  robots: { index: true, follow: true },
};

function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-16 sm:py-20 px-4 ${className}`}>
      <div className="max-w-4xl mx-auto">{children}</div>
    </section>
  );
}

function SectionTitle({
  children,
  sub,
}: {
  children: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="mb-10 sm:mb-12">
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
        {children}
      </h2>
      {sub && (
        <p className="mt-2 text-base sm:text-lg text-neutral-500">{sub}</p>
      )}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  highlight,
}: {
  icon: string;
  title: string;
  desc: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-5 rounded-2xl border bg-white ${highlight ? "border-red-200 ring-1 ring-red-100" : "border-neutral-200"}`}
    >
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="font-bold text-sm mb-1">
        {title}
        {highlight && (
          <span className="ml-2 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full uppercase">
            IA
          </span>
        )}
      </h3>
      <p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function CompareRow({
  label,
  ifood,
  sistema,
}: {
  label: string;
  ifood: string;
  sistema: string;
}) {
  return (
    <tr className="border-b border-neutral-100 last:border-0">
      <td className="py-3 pr-4 text-sm font-medium">{label}</td>
      <td className="py-3 px-4 text-sm text-neutral-400 text-center">
        {ifood}
      </td>
      <td className="py-3 pl-4 text-sm font-semibold text-emerald-700 text-center">
        {sistema}
      </td>
    </tr>
  );
}

export default function ComercialPage() {
  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between h-14 px-4">
          <span className="font-extrabold text-lg tracking-tight">
            Boteco<span className="text-red-600">System</span>
          </span>
          <a
            href="#planos"
            className="h-9 px-5 text-sm font-bold bg-red-600 text-white rounded-full inline-flex items-center hover:bg-red-700 transition-colors"
          >
            Ver planos
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 text-center bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-6">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            WebApp com IA integrada &middot; Zero comissão
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            Seu bar merece mais do que{" "}
            <span className="text-red-600">30% de comissão</span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-500 max-w-2xl mx-auto mb-4">
            Um app completo que funciona direto no navegador — seu cliente não
            precisa instalar nada. Mas recebe notificações, acumula pontos,
            ganha recompensas e pede com um toque.
          </p>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto mb-10">
            Inteligência Artificial cuida do marketing, cria textos, analisa
            vendas e gera insights pro seu negócio. Você foca no que importa:
            atender bem.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#planos"
              className="h-12 px-8 text-base font-bold bg-red-600 text-white rounded-full inline-flex items-center justify-center hover:bg-red-700 transition-colors"
            >
              Quero pra meu negócio
            </a>
            <a
              href="https://adenaobocao-boteco-da-estacao-1c8n.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-8 text-base font-bold border-2 border-neutral-200 text-neutral-700 rounded-full inline-flex items-center justify-center hover:border-neutral-300 transition-colors"
            >
              Ver demo ao vivo
            </a>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {[
              "WebApp (sem instalar)",
              "Push Notifications",
              "IA integrada",
              "Fidelidade e recompensas",
            ].map((badge) => (
              <span
                key={badge}
                className="px-3 py-1 text-xs font-semibold rounded-full bg-neutral-100 text-neutral-600"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* WebApp destaque */}
      <Section className="bg-gradient-to-b from-neutral-900 to-neutral-800 text-white">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-bold mb-4">
            Tecnologia de ponta
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Um app sem precisar de <span className="text-red-400">App Store</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto">
            O BotecoSystem é um WebApp (PWA) — funciona como aplicativo no
            celular do cliente, mas sem baixar nada. Abre pelo link, salva na
            tela inicial, e pronto.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: "📲",
              t: "Instala em 1 toque",
              d: "O cliente acessa o link e salva na tela inicial. Sem App Store, sem Play Store, sem fricção.",
            },
            {
              icon: "🔔",
              t: "Notificações reais",
              d: "Push notifications direto no celular — igual app nativo. Avise sobre promoções, status do pedido, novidades.",
            },
            {
              icon: "⚡",
              t: "Rápido como app",
              d: "Carrega instantâneo, funciona offline parcial, e ocupa zero espaço no celular do cliente.",
            },
          ].map((item) => (
            <div
              key={item.t}
              className="p-5 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-sm mb-1">{item.t}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {item.d}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Problema */}
      <Section className="bg-neutral-900 text-white">
        <SectionTitle sub="O que você perde hoje sem perceber">
          <span className="text-red-400">O problema</span> que ninguém fala
        </SectionTitle>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              n: "27%",
              t: "Comissão do iFood",
              d: "A cada R$ 100 em vendas, R$ 27 vão pro iFood. Em R$ 15 mil/mês, são R$ 4.050 embora.",
            },
            {
              n: "0",
              t: "Dados dos seus clientes",
              d: "No iFood, o cliente é do iFood. Você não tem nome, telefone, histórico. Não pode falar com ele.",
            },
            {
              n: "5 min",
              t: "Push do concorrente",
              d: "O cliente pede de você e 5 minutos depois recebe notificação do concorrente. O iFood faz isso.",
            },
            {
              n: "30+",
              t: "Minutos perdidos por dia",
              d: "Respondendo WhatsApp, confirmando endereço, corrigindo pedido. Tempo que podia estar produzindo.",
            },
          ].map((item) => (
            <div
              key={item.t}
              className="p-5 rounded-2xl bg-white/5 border border-white/10"
            >
              <span className="text-3xl font-black text-red-400">
                {item.n}
              </span>
              <h3 className="font-bold text-sm mt-2 mb-1">{item.t}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {item.d}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* IA Section */}
      <Section className="bg-gradient-to-b from-violet-50 to-white">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-xs font-bold mb-4">
            Inteligência Artificial
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            IA que trabalha <span className="text-violet-600">por você</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-500 max-w-2xl mx-auto">
            Não é só automação. A IA do BotecoSystem pensa, analisa e age.
            Ela entende seu negócio e faz o que um analista de marketing +
            gerente de dados faria — mas 24 horas por dia.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              icon: "✍️",
              t: "Cria textos de campanhas",
              d: "A IA escreve os textos das suas push notifications e campanhas de marketing. Textos criativos, com a voz do seu bar, prontos pra disparar.",
            },
            {
              icon: "📊",
              t: "Analisa suas vendas",
              d: "Identifica o que vende mais, horários de pico, ticket médio, produtos em queda. Gera insights que você não teria tempo de descobrir sozinho.",
            },
            {
              icon: "🔍",
              t: "Monitora a concorrência",
              d: "Acompanha avaliações e posicionamento dos concorrentes na região. Você sabe como está posicionado sem precisar pesquisar.",
            },
            {
              icon: "🎯",
              t: "Sugere cupons inteligentes",
              d: "Baseado no histórico dos clientes, a IA sugere qual desconto dar, pra quem, e quando. Reativa cliente inativo automaticamente.",
            },
            {
              icon: "🔔",
              t: "Dispara push com texto por IA",
              d: "Cria notificações com tom descontraído, memético ou promocional — você escolhe o estilo e a IA gera 6 opções na hora.",
            },
            {
              icon: "🚨",
              t: "Alertas automáticos",
              d: "Se algo muda no padrão (queda de vendas, pico inesperado, avaliação ruim), a IA te avisa antes que vire problema.",
            },
          ].map((item) => (
            <div
              key={item.t}
              className="p-5 rounded-2xl border border-violet-200 bg-white"
            >
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-sm mb-1 flex items-center gap-2">
                {item.t}
                <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded-full">
                  IA
                </span>
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {item.d}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Gamificação e Fidelidade */}
      <Section className="bg-amber-50">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold mb-4">
            Gamificação
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Cliente que <span className="text-amber-600">joga, volta</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-500 max-w-2xl mx-auto">
            Sistema de fidelidade com gamificação integrada. Seu cliente acumula
            pontos, sobe de nível e ganha recompensas. Quanto mais pede, mais
            ganha.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              level: "Bronze",
              color: "bg-amber-700",
              desc: "Começou a pedir",
              perk: "Acumula pontos a cada pedido",
            },
            {
              level: "Prata",
              color: "bg-neutral-400",
              desc: "Cliente frequente",
              perk: "Cupons exclusivos + frete grátis",
            },
            {
              level: "Ouro",
              color: "bg-yellow-500",
              desc: "Fã do bar",
              perk: "Descontos maiores + prioridade",
            },
            {
              level: "Diamante",
              color: "bg-sky-400",
              desc: "VIP da casa",
              perk: "Recompensas especiais + surpresas",
            },
          ].map((tier) => (
            <div
              key={tier.level}
              className="p-5 rounded-2xl border border-amber-200 bg-white text-center"
            >
              <div
                className={`w-10 h-10 rounded-full ${tier.color} mx-auto mb-3`}
              />
              <h3 className="font-extrabold text-sm">{tier.level}</h3>
              <p className="text-xs text-neutral-400 mt-1">{tier.desc}</p>
              <p className="text-xs font-medium text-amber-700 mt-2">
                {tier.perk}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 p-5 rounded-2xl bg-white border border-amber-200">
          <p className="text-sm text-neutral-600 leading-relaxed">
            <strong>Por que funciona:</strong> O cliente sabe que está perto do
            próximo nível e pede de novo pra chegar lá. É o mesmo princípio dos
            programas de milhas, mas pro seu bar. A IA identifica quem está
            próximo de subir de nível e envia push automático incentivando.
          </p>
        </div>
      </Section>

      {/* Features cliente */}
      <Section className="bg-white">
        <SectionTitle sub="O que seu cliente vê e usa no WebApp">
          App do seu negócio
        </SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard
            icon="🍔"
            title="Cardápio digital completo"
            desc="Fotos, descrições, opções (ponto da carne, molho, tamanho), preços promocionais e combos."
          />
          <FeatureCard
            icon="📱"
            title="Pedido online fluido"
            desc="Delivery, retirada ou mesa. Checkout rápido com PIX, cartão ou dinheiro na entrega."
          />
          <FeatureCard
            icon="📍"
            title="Rastreio em tempo real"
            desc="Cliente acompanha o status: confirmado, preparando, pronto, saiu pra entrega."
          />
          <FeatureCard
            icon="⭐"
            title="Fidelidade e recompensas"
            desc="Pontos por pedido, níveis Bronze a Diamante, cupons exclusivos. Cliente volta mais."
          />
          <FeatureCard
            icon="📅"
            title="Agenda e reservas"
            desc="Eventos, shows, reserva de mesa especial. Tudo pelo app, sem ligar."
          />
          <FeatureCard
            icon="🔔"
            title="Push igual app nativo"
            desc="Notificações no celular do cliente — promoções, status do pedido, novidades. Sem precisar instalar nada."
          />
        </div>
      </Section>

      {/* Features admin */}
      <Section>
        <SectionTitle sub="Painel completo com IA que trabalha por você">
          Painel do dono
        </SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard
            icon="📊"
            title="Dashboard com KPIs"
            desc="Vendas do dia, ticket médio, pedidos por origem. Visão completa do negócio em tempo real."
          />
          <FeatureCard
            icon="🍳"
            title="Tela da Cozinha (KDS)"
            desc="Kanban visual: Novos → Preparando → Prontos. Funciona em qualquer celular ou tablet."
          />
          <FeatureCard
            icon="🖨️"
            title="Impressão térmica"
            desc="Botão de imprimir direto no pedido. Qualquer impressora 80mm USB — a partir de R$ 150."
          />
          <FeatureCard
            icon="📣"
            title="Disparador de push com IA"
            desc="A IA cria 6 opções de texto por campanha. Escolha o tom (promocional, memético, sério) e dispare em um clique."
            highlight
          />
          <FeatureCard
            icon="🤖"
            title="Analytics inteligente"
            desc="IA analisa vendas, horário de pico, produtos em queda e gera insights automaticamente. Sem você precisar fazer nada."
            highlight
          />
          <FeatureCard
            icon="🎨"
            title="Editor de campanhas"
            desc="Crie artes para promoções com logo, fotos dos produtos e textos gerados por IA. Sem precisar de designer."
            highlight
          />
          <FeatureCard
            icon="🗺️"
            title="Zonas de entrega"
            desc="Configure bairros e taxas de delivery. Cada região com seu preço. Estilo iFood."
          />
          <FeatureCard
            icon="🔍"
            title="Monitoramento de mercado"
            desc="Acompanhe avaliações dos concorrentes, nota no Google e posicionamento. IA gera relatórios comparativos."
            highlight
          />
          <FeatureCard
            icon="🎯"
            title="Cupons inteligentes"
            desc="IA sugere cupons personalizados: qual desconto, pra quem, quando. Reativa clientes inativos automaticamente."
            highlight
          />
        </div>
      </Section>

      {/* Comparação */}
      <Section className="bg-white">
        <SectionTitle sub="Não é pra trocar o iFood — é pra lucrar mais">
          BotecoSystem vs iFood
        </SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-neutral-200">
                <th className="text-left py-3 pr-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Recurso
                </th>
                <th className="py-3 px-4 text-xs font-bold text-neutral-400 uppercase tracking-wider text-center">
                  iFood
                </th>
                <th className="py-3 pl-4 text-xs font-bold text-red-600 uppercase tracking-wider text-center">
                  BotecoSystem
                </th>
              </tr>
            </thead>
            <tbody>
              <CompareRow
                label="Comissão por pedido"
                ifood="12-30%"
                sistema="0%"
              />
              <CompareRow
                label="Dados dos clientes"
                ifood="Do iFood"
                sistema="Seus"
              />
              <CompareRow
                label="Push notification"
                ifood="Manda do concorrente"
                sistema="Só você manda"
              />
              <CompareRow
                label="Fidelidade / gamificação"
                ifood="Não tem"
                sistema="4 níveis + recompensas"
              />
              <CompareRow
                label="Cardápio personalizado"
                ifood="Limitado"
                sistema="Total (opções, combos, promos)"
              />
              <CompareRow
                label="Identidade visual"
                ifood="Página genérica"
                sistema="Sua marca, seu domínio"
              />
              <CompareRow
                label="KDS cozinha"
                ifood="Básico"
                sistema="Kanban + impressão térmica"
              />
              <CompareRow
                label="Marketing com IA"
                ifood="Não"
                sistema="Textos, campanhas, insights"
              />
              <CompareRow
                label="Instalar app"
                ifood="Precisa baixar iFood"
                sistema="WebApp — sem instalar nada"
              />
            </tbody>
          </table>
        </div>
        <div className="mt-8 p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
          <p className="text-sm font-semibold text-emerald-800">
            O iFood continua captando cliente novo. Mas todo cliente que já te
            conhece, manda pro SEU sistema. Sem comissão, com fidelidade, com
            marketing direto por IA. Em 6 meses, 30-40% dos seus pedidos podem
            vir direto — e esse dinheiro é todo seu.
          </p>
        </div>
      </Section>

      {/* Economia */}
      <Section className="bg-neutral-900 text-white">
        <SectionTitle>
          Quanto você <span className="text-emerald-400">economiza</span>
        </SectionTitle>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <p className="text-sm text-neutral-400">
            Exemplo: bar que faz R$ 15.000/mês pelo iFood
          </p>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Comissão iFood (27%)</span>
              <span className="text-lg font-bold text-red-400">
                -R$ 4.050/mês
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Se 30% migrar pro sistema</span>
              <span className="text-lg font-bold text-emerald-400">
                +R$ 1.215/mês
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-white/10 pt-3">
              <span className="text-sm font-bold">Economia líquida/mês</span>
              <span className="text-2xl font-black text-emerald-400">
                ~R$ 1.100
              </span>
            </div>
          </div>
          <p className="text-xs text-neutral-500 pt-2">
            O sistema se paga em menos de 2 meses.
          </p>
        </div>
      </Section>

      {/* Planos */}
      <Section className="bg-white" id="planos">
        <SectionTitle sub="Escolha o que faz sentido pro seu negócio">
          Planos
        </SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Essencial */}
          <div className="p-6 rounded-2xl border-2 border-neutral-200 bg-white flex flex-col">
            <h3 className="text-lg font-extrabold mb-1">Essencial</h3>
            <p className="text-xs text-neutral-500 mb-6">
              Pra sair do WhatsApp e ter seu sistema
            </p>
            <div className="mb-6">
              <span className="text-3xl font-black">R$ 1.800</span>
              <p className="text-xs text-neutral-400 mt-1">
                R$ 600 entrada + 3x R$ 400
              </p>
            </div>
            <ul className="space-y-2.5 text-sm flex-1 mb-6">
              {[
                "WebApp com a cara do seu negócio",
                "Cardápio digital completo",
                "Pedidos online (delivery + retirada + mesa)",
                "Checkout com pagamento (PIX, cartão)",
                "KDS cozinha (tela + impressão térmica)",
                "1 ano de domínio incluso",
                "1 ano de servidor incluso",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold mt-0.5">
                    &#10003;
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-neutral-100">
              <p className="text-xs text-neutral-400">
                Renovação: R$ 300/ano (domínio + servidor + correções)
              </p>
            </div>
          </div>

          {/* Completo */}
          <div className="p-6 rounded-2xl border-2 border-red-500 bg-white flex flex-col relative">
            <div className="absolute -top-3 left-6 px-3 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full uppercase">
              Mais popular
            </div>
            <h3 className="text-lg font-extrabold mb-1">Completo</h3>
            <p className="text-xs text-neutral-500 mb-6">
              Tudo do Essencial + IA + fidelidade
            </p>
            <div className="mb-6">
              <span className="text-3xl font-black">R$ 2.400</span>
              <p className="text-xs text-neutral-400 mt-1">
                R$ 800 entrada + 3x R$ 533
              </p>
            </div>
            <ul className="space-y-2.5 text-sm flex-1 mb-6">
              {[
                "Tudo do Essencial",
                "Push notifications (igual app nativo)",
                "Fidelidade com gamificação (4 níveis)",
                "Disparador de push com textos por IA",
                "Analytics e insights por IA",
                "Monitoramento de concorrentes",
                "Editor de campanhas com IA",
                "Cupons inteligentes automáticos",
                "2h/mês de ajustes inclusos",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-red-500 font-bold mt-0.5">
                    &#10003;
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-neutral-100">
              <p className="text-xs text-neutral-400">
                Renovação: R$ 500/ano
              </p>
            </div>
          </div>

          {/* Plus */}
          <div className="p-6 rounded-2xl border-2 border-neutral-200 bg-white flex flex-col sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-extrabold mb-1">Plus</h3>
            <p className="text-xs text-neutral-500 mb-6">
              Desenvolvimento exclusivo pro seu negócio
            </p>
            <div className="mb-6">
              <span className="text-3xl font-black">R$ 2.000</span>
              <span className="text-sm text-neutral-400 ml-1">/mês</span>
            </div>
            <ul className="space-y-2.5 text-sm flex-1 mb-6">
              {[
                "Desenvolvedor dedicado ao seu projeto",
                "Features exclusivas sob demanda",
                "Integrações customizadas (ERP, fiscal, delivery)",
                "Novas páginas, fluxos e automações",
                "Prioridade total no suporte",
                "Reunião mensal de alinhamento",
                "Seu sistema evolui todo mês",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold mt-0.5">
                    &#10003;
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-neutral-100">
              <p className="text-xs text-neutral-400">
                Add-on: contrate junto com qualquer plano. Ideal pra quem quer um sistema que cresce junto com o negócio.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Como funciona */}
      <Section>
        <SectionTitle sub="Do primeiro contato ao sistema no ar">
          Como funciona
        </SectionTitle>
        <div className="space-y-6">
          {[
            {
              n: "1",
              t: "Reunião inicial (30 min)",
              d: "Entendemos seu negócio, cardápio e operação.",
            },
            {
              n: "2",
              t: "Setup (3-5 dias úteis)",
              d: "Configuramos o WebApp com sua marca, cardápio, opções e zonas de entrega.",
            },
            {
              n: "3",
              t: "Treinamento (1h)",
              d: "Ensinamos você e sua equipe a usar o painel, a cozinha e o marketing.",
            },
            {
              n: "4",
              t: "Go-live",
              d: "Sistema no ar, com seu domínio, pronto pra receber pedidos.",
            },
            {
              n: "5",
              t: "Acompanhamento (30 dias)",
              d: "Suporte prioritário no primeiro mês. A IA já começa a gerar insights.",
            },
          ].map((step) => (
            <div key={step.n} className="flex gap-4 items-start">
              <div className="shrink-0 w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-sm">
                {step.n}
              </div>
              <div>
                <h3 className="font-bold text-sm">{step.t}</h3>
                <p className="text-xs text-neutral-500 mt-0.5">{step.d}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-white">
        <SectionTitle>Perguntas frequentes</SectionTitle>
        <div className="space-y-4">
          {[
            {
              q: "Preciso largar o iFood?",
              a: "Não. O iFood continua captando cliente novo. O sistema é pra cliente que já te conhece pedir direto — sem comissão.",
            },
            {
              q: "O cliente precisa baixar algum app?",
              a: "Não. É um WebApp — funciona direto no navegador. O cliente pode salvar na tela inicial do celular como atalho, mas não precisa baixar nada. Mesmo assim, recebe push notifications normalmente.",
            },
            {
              q: "A IA faz o quê exatamente?",
              a: "Ela cria textos para campanhas e push notifications, analisa suas vendas e gera insights, monitora concorrentes, sugere cupons personalizados e envia alertas automáticos. Tudo sem você precisar fazer nada.",
            },
            {
              q: "Como funciona a fidelidade?",
              a: "O cliente acumula pontos a cada pedido e sobe de nível (Bronze, Prata, Ouro, Diamante). Cada nível desbloqueia recompensas maiores. A IA identifica quem está perto de subir e manda push incentivando.",
            },
            {
              q: "Preciso de impressora especial?",
              a: "Não é obrigatório. O KDS funciona em qualquer celular ou tablet. Se quiser imprimir, qualquer térmica USB 80mm funciona (a partir de R$ 150).",
            },
            {
              q: "E a nota fiscal?",
              a: "O sistema não emite NF. Se você já usa Bling, Stone ou outro PDV, continua usando pra parte fiscal. O BotecoSystem cuida do pedido online.",
            },
            {
              q: "Posso mudar o cardápio depois?",
              a: "Sim. No Plano Completo você tem 2h/mês de ajustes. No Essencial, alterações maiores são cobradas à parte. No Plus, sob demanda.",
            },
            {
              q: "Meus dados ficam seguros?",
              a: "Servidor profissional com backup automático, HTTPS e dados criptografados. Infraestrutura de nível empresarial.",
            },
          ].map((faq) => (
            <details
              key={faq.q}
              className="group p-4 rounded-xl border border-neutral-200"
            >
              <summary className="font-bold text-sm cursor-pointer list-none flex items-center justify-between">
                {faq.q}
                <span className="text-neutral-400 group-open:rotate-45 transition-transform text-lg">
                  +
                </span>
              </summary>
              <p className="text-sm text-neutral-500 mt-3 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </Section>

      {/* CTA final */}
      <section className="py-20 sm:py-28 px-4 text-center bg-red-600 text-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">
            Pronto pra ter seu próprio sistema?
          </h2>
          <p className="text-base sm:text-lg text-red-100 mb-8">
            Em 5 dias seu negócio pode estar recebendo pedidos diretos, sem
            comissão, com IA trabalhando por você.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/5542984399135?text=Oi%2C%20quero%20saber%20mais%20sobre%20o%20BotecoSystem"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-8 text-base font-bold bg-white text-red-600 rounded-full inline-flex items-center justify-center hover:bg-red-50 transition-colors"
            >
              Falar no WhatsApp
            </a>
            <a
              href="https://adenaobocao-boteco-da-estacao-1c8n.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-8 text-base font-bold border-2 border-white/30 text-white rounded-full inline-flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              Ver demo ao vivo
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center bg-neutral-900 text-neutral-500 text-xs">
        <p>
          BotecoSystem &mdash; WebApp inteligente para bares e restaurantes.
        </p>
        <p className="mt-1">
          <Link href="/prospector" className="underline hover:text-neutral-300">
            Área do prospector
          </Link>
        </p>
      </footer>
    </div>
  );
}
