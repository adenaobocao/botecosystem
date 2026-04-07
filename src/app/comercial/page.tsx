import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BotecoSystem — Sistema de Pedidos para Bares e Restaurantes",
  description:
    "Sistema completo de pedidos online. Sem comissao por pedido. Cardapio digital, KDS, fidelidade, marketing com IA.",
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
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-5 rounded-2xl border border-neutral-200 bg-white">
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="font-bold text-sm mb-1">{title}</h3>
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
            Sistema proprio, zero comissao
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            Seu bar merece mais do que{" "}
            <span className="text-red-600">30% de comissao</span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-500 max-w-2xl mx-auto mb-10">
            Sistema completo de pedidos online com a cara do seu negocio.
            Cardapio digital, pagamento, cozinha, fidelidade e marketing — tudo
            sem pagar comissao por pedido.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#planos"
              className="h-12 px-8 text-base font-bold bg-red-600 text-white rounded-full inline-flex items-center justify-center hover:bg-red-700 transition-colors"
            >
              Quero pra meu negocio
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
        </div>
      </section>

      {/* Problema */}
      <Section className="bg-neutral-900 text-white">
        <SectionTitle sub="O que voce perde hoje sem perceber">
          <span className="text-red-400">O problema</span> que ninguem fala
        </SectionTitle>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              n: "27%",
              t: "Comissao do iFood",
              d: "A cada R$ 100 em vendas, R$ 27 vao pro iFood. Em R$ 15 mil/mes, sao R$ 4.050 embora.",
            },
            {
              n: "0",
              t: "Dados dos seus clientes",
              d: "No iFood, o cliente e do iFood. Voce nao tem nome, telefone, historico. Nao pode falar com ele.",
            },
            {
              n: "5 min",
              t: "Push do concorrente",
              d: "O cliente pede de voce e 5 minutos depois recebe notificacao do concorrente. O iFood faz isso.",
            },
            {
              n: "30+",
              t: "Minutos perdidos por dia",
              d: "Respondendo WhatsApp, confirmando endereco, corrigindo pedido. Tempo que podia estar produzindo.",
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

      {/* Features cliente */}
      <Section className="bg-white">
        <SectionTitle sub="O que seu cliente vai ver e usar">
          Site do seu negocio
        </SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard
            icon="🍔"
            title="Cardapio digital completo"
            desc="Fotos, descricoes, opcoes (ponto da carne, molho, tamanho), precos promocionais."
          />
          <FeatureCard
            icon="📱"
            title="Pedido online fluido"
            desc="Delivery, retirada ou mesa. Checkout rapido com PIX, cartao ou dinheiro."
          />
          <FeatureCard
            icon="📍"
            title="Rastreio em tempo real"
            desc="Cliente acompanha: confirmado, preparando, pronto, saiu pra entrega."
          />
          <FeatureCard
            icon="⭐"
            title="Programa de fidelidade"
            desc="Pontos por pedido, niveis Bronze a Diamante. Cliente volta mais."
          />
          <FeatureCard
            icon="📅"
            title="Agenda e reservas"
            desc="Eventos, shows, reserva de mesa especial. Tudo pelo site."
          />
          <FeatureCard
            icon="📲"
            title="Instala como app"
            desc="PWA: o cliente instala no celular sem App Store. Abre direto da tela inicial."
          />
        </div>
      </Section>

      {/* Features admin */}
      <Section>
        <SectionTitle sub="Tudo que voce precisa pra gerenciar num so lugar">
          Painel do dono
        </SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard
            icon="📊"
            title="Dashboard com KPIs"
            desc="Vendas do dia, ticket medio, pedidos por origem. Visao completa do negocio."
          />
          <FeatureCard
            icon="🍳"
            title="Tela da Cozinha (KDS)"
            desc="Kanban visual: Novos > Preparando > Prontos. Funciona em qualquer celular."
          />
          <FeatureCard
            icon="🖨️"
            title="Impressao termica"
            desc="Botao de imprimir direto no pedido. Impressora 80mm USB comum."
          />
          <FeatureCard
            icon="📣"
            title="Marketing inteligente"
            desc="Push pro celular do cliente, cupons, campanhas automaticas."
          />
          <FeatureCard
            icon="🤖"
            title="Analytics com IA"
            desc="Insights sobre vendas, horario de pico, produtos em queda. IA analisa pra voce."
          />
          <FeatureCard
            icon="🗺️"
            title="Zonas de entrega"
            desc="Configure bairros e taxas. Cada regiao com seu preco de delivery."
          />
        </div>
      </Section>

      {/* Comparacao */}
      <Section className="bg-white">
        <SectionTitle sub="Nao e pra trocar o iFood — e pra lucrar mais">
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
                label="Comissao por pedido"
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
                sistema="So voce manda"
              />
              <CompareRow
                label="Fidelidade / pontos"
                ifood="Nao tem"
                sistema="Integrado"
              />
              <CompareRow
                label="Cardapio personalizado"
                ifood="Limitado"
                sistema="Total"
              />
              <CompareRow
                label="Identidade visual"
                ifood="Pagina generica"
                sistema="Sua marca"
              />
              <CompareRow
                label="KDS cozinha"
                ifood="Basico"
                sistema="Kanban + impressao"
              />
              <CompareRow
                label="Marketing direto"
                ifood="Nao"
                sistema="Campanhas + IA"
              />
            </tbody>
          </table>
        </div>
        <div className="mt-8 p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
          <p className="text-sm font-semibold text-emerald-800">
            O iFood continua captando cliente novo. Mas todo cliente que ja te
            conhece, manda pro SEU sistema. Sem comissao, com fidelidade, com
            marketing direto. Em 6 meses, 30-40% dos seus pedidos podem vir
            direto.
          </p>
        </div>
      </Section>

      {/* Economia */}
      <Section className="bg-neutral-900 text-white">
        <SectionTitle>
          Quanto voce <span className="text-emerald-400">economiza</span>
        </SectionTitle>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <p className="text-sm text-neutral-400">
            Exemplo: bar que faz R$ 15.000/mes pelo iFood
          </p>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Comissao iFood (27%)</span>
              <span className="text-lg font-bold text-red-400">
                -R$ 4.050/mes
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Se 30% migrar pro sistema</span>
              <span className="text-lg font-bold text-emerald-400">
                +R$ 1.215/mes
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-white/10 pt-3">
              <span className="text-sm font-bold">Economia liquida/mes</span>
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
        <SectionTitle sub="Escolha o que faz sentido pro seu negocio">
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
                "Site com cardapio digital",
                "Pedidos online (delivery + retirada + mesa)",
                "Checkout com pagamento",
                "KDS cozinha (tela + impressao)",
                "1 ano de dominio incluso",
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
                Renovacao: R$ 300/ano (dominio + servidor + correcoes)
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
              Pra competir de verdade com o iFood
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
                "Push notifications pro cliente",
                "Programa de fidelidade",
                "Monitoramento de mercado",
                "Analytics com IA",
                "Editor de campanhas",
                "2h/mes de ajustes inclusos",
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
                Renovacao: R$ 500/ano
              </p>
            </div>
          </div>

          {/* Plus */}
          <div className="p-6 rounded-2xl border-2 border-neutral-200 bg-white flex flex-col sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-extrabold mb-1">Plus</h3>
            <p className="text-xs text-neutral-500 mb-6">
              Desenvolvimento continuo sob demanda
            </p>
            <div className="mb-6">
              <span className="text-3xl font-black">R$ 200</span>
              <span className="text-sm text-neutral-400 ml-1">/mes</span>
            </div>
            <ul className="space-y-2.5 text-sm flex-1 mb-6">
              {[
                "Ate 8h/mes de desenvolvimento",
                "Features novas sob demanda",
                "Integracoes customizadas",
                "Prioridade no suporte",
                "Seu negocio sempre evoluindo",
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
                Add-on: contrate junto com qualquer plano
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
              t: "Reuniao inicial (30 min)",
              d: "Entendemos seu negocio, cardapio e operacao.",
            },
            {
              n: "2",
              t: "Setup (3-5 dias uteis)",
              d: "Configuramos o sistema com sua marca, cardapio e opcoes.",
            },
            {
              n: "3",
              t: "Treinamento (1h)",
              d: "Ensinamos voce e sua equipe a usar o painel e a cozinha.",
            },
            {
              n: "4",
              t: "Go-live",
              d: "Sistema no ar, com seu dominio, pronto pra receber pedidos.",
            },
            {
              n: "5",
              t: "Acompanhamento (30 dias)",
              d: "Suporte prioritario no primeiro mes.",
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
              a: "Nao. O iFood continua captando cliente novo. O sistema e pra cliente que ja te conhece pedir direto — sem comissao.",
            },
            {
              q: "Funciona no celular?",
              a: "Sim. O site e otimizado pra celular e pode ser instalado como app (PWA). Nao precisa de App Store.",
            },
            {
              q: "Preciso de impressora especial?",
              a: "Nao obrigatorio. O KDS funciona em qualquer celular/tablet. Se quiser imprimir, qualquer termica USB 80mm funciona (a partir de R$ 150).",
            },
            {
              q: "E a nota fiscal?",
              a: "O sistema nao emite NF. Se voce ja usa Bling, Stone ou outro PDV, continua usando pra parte fiscal. O BotecoSystem cuida do pedido online.",
            },
            {
              q: "Posso mudar o cardapio depois?",
              a: "Sim. No Plano Completo voce tem 2h/mes de ajustes. No Essencial, alteracoes maiores sao cobradas a parte. No Plus, sob demanda.",
            },
            {
              q: "Meus dados ficam seguros?",
              a: "Servidor profissional com backup automatico, HTTPS e dados criptografados. Infraestrutura de nivel empresarial.",
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
            Pronto pra ter seu proprio sistema?
          </h2>
          <p className="text-base sm:text-lg text-red-100 mb-8">
            Em 5 dias seu negocio pode estar recebendo pedidos diretos, sem
            comissao, com a sua marca.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/55SEUNUMERO?text=Oi%2C%20quero%20saber%20mais%20sobre%20o%20BotecoSystem"
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
          BotecoSystem &mdash; Sistema de pedidos para bares e restaurantes.
        </p>
        <p className="mt-1">
          <Link href="/prospector" className="underline hover:text-neutral-300">
            Area do prospector
          </Link>
        </p>
      </footer>
    </div>
  );
}
