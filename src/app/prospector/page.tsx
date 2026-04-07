import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Area do Prospector | BotecoSystem",
  description: "Roteiro e materiais para prospectar clientes.",
  robots: { index: false, follow: false },
};

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`p-5 rounded-2xl border border-neutral-200 bg-white ${className}`}
    >
      {children}
    </div>
  );
}

export default function ProspectorPage() {
  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between h-14 px-4">
          <span className="font-extrabold text-lg tracking-tight">
            Boteco<span className="text-red-600">System</span>
            <span className="text-xs font-normal text-neutral-400 ml-2">
              Prospector
            </span>
          </span>
          <Link
            href="/comercial"
            className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Ver pagina comercial
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Roteiro do Prospector
          </h1>
          <p className="text-sm text-neutral-500">
            Guia completo pra prospectar clientes em cidades do interior. Leia
            antes de ir a campo.
          </p>
        </div>

        {/* Perfil ideal */}
        <section>
          <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-black">
              1
            </span>
            Perfil do cliente ideal
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <h3 className="font-bold text-sm mb-3 text-emerald-700">
                Procure
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                  "Bar/restaurante/hamburgueria com publico fiel",
                  "Posta no Instagram e tem engajamento",
                  "Reclama do iFood (comissao, repasse, controle)",
                  "Recebe pedido por WhatsApp (caos)",
                  "Faturamento estimado R$ 8.000+/mes",
                  "Cardapio com 15+ itens",
                  "Fila no balcao ou delivery movimentado",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <h3 className="font-bold text-sm mb-3 text-red-600">Evite</h3>
              <ul className="space-y-2 text-sm">
                {[
                  "Negocio que acabou de abrir (sem base de clientes)",
                  "Lugar que vende 1-2 itens simples",
                  "Dono que nao usa celular direito",
                  "Negocio sem presenca online nenhuma",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">&#10007;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </section>

        {/* Abordagem */}
        <section>
          <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-black">
              2
            </span>
            Abordagem
          </h2>
          <div className="space-y-4">
            <Card>
              <h3 className="font-bold text-sm mb-2">
                Presencial (melhor conversao)
              </h3>
              <p className="text-xs text-neutral-500 mb-3">
                Va no horario calmo (14h-16h). Peca algo, observe a operacao.
                Depois:
              </p>
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                <p className="text-sm italic">
                  &ldquo;Cara, eu trabalho com sistema de pedidos pra bares e
                  restaurantes. Tipo um iFood proprio, mas sem comissao. Posso
                  te mostrar em 2 minutos?&rdquo;
                </p>
              </div>
            </Card>
            <Card>
              <h3 className="font-bold text-sm mb-2">WhatsApp / Instagram</h3>
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                <p className="text-sm italic">
                  &ldquo;Oi [NOME], tudo bem? Vi que voce tem bastante movimento
                  no [BAR]. Eu monto sistema de pedidos online pra bares —
                  tipo iFood mas sem comissao, com a marca do seu negocio. Posso
                  te mostrar um exemplo funcionando? Leva 2 min.&rdquo;
                </p>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Se responder, mande o link do demo + 3 prints (cardapio, pedido,
                cozinha).
              </p>
            </Card>
          </div>
        </section>

        {/* Objecoes */}
        <section>
          <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-black">
              3
            </span>
            Respostas para objecoes
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "Ja uso iFood, nao preciso",
                a: 'Nao e pra trocar o iFood. O iFood traz cliente novo e ta otimo pra isso. Mas o cliente que ja te conhece, que mora perto — esse nao precisa do iFood pra te achar. Se ele pedir pelo seu sistema, voce economiza 27% de comissao. Em R$ 15 mil, sao R$ 4 mil/mes que ficam no seu bolso.',
              },
              {
                q: "Nao tenho grana agora",
                a: "E R$ 600 de entrada e 3x de R$ 400. Em 2 meses de economia no iFood voce ja pagou. Depois e so R$ 300/ano — menos de R$ 1 por dia.",
              },
              {
                q: "Meus clientes nao vao usar",
                a: "Voce posta no Instagram? Entao coloca o link na bio. O cliente que ja te segue clica e pede. E tipo pedir no iFood, so que sem comissao pra voce.",
              },
              {
                q: "Recebo pelo WhatsApp e ta bom",
                a: "Quanto tempo voce gasta por dia respondendo WhatsApp, confirmando endereco, corrigindo pedido? Com o sistema o cliente faz tudo sozinho. Voce so ve o pedido pronto na tela da cozinha.",
              },
              {
                q: "Ja tentei site e nao deu certo",
                a: "Provavelmente era site vitrine com telefone. Isso nao funciona. Aqui o cliente FAZ o pedido completo, com opcoes, pagamento e tudo. E diferente.",
              },
              {
                q: "E a nota fiscal?",
                a: "O sistema nao substitui seu caixa. Se usa Bling, Stone ou qualquer PDV, continua. O sistema cuida do pedido online e manda pra cozinha.",
              },
            ].map((obj) => (
              <Card key={obj.q}>
                <p className="font-bold text-sm text-red-600 mb-2">
                  &ldquo;{obj.q}&rdquo;
                </p>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {obj.a}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Demo script */}
        <section>
          <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-black">
              4
            </span>
            Demo em 2 minutos
          </h2>
          <Card>
            <p className="text-xs text-neutral-500 mb-4">
              Tenha o demo aberto no celular. Sequencia rapida:
            </p>
            <ol className="space-y-3 text-sm">
              {[
                "Abre o site — mostra o cardapio com categorias e fotos",
                "Clica num produto — mostra opcoes (ponto, molho, pao)",
                "Adiciona ao carrinho — mostra checkout rapido",
                "Troca pro painel admin — mostra pedido chegando",
                "Mostra KDS da cozinha — \"Aqui o cozinheiro ve e avanca\"",
                "Mostra botao imprimir — \"Se preferir papel, imprime aqui\"",
                "Mostra marketing — \"Push pro celular do cliente\"",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-6 p-4 rounded-xl bg-purple-50 border border-purple-200">
              <p className="text-sm font-semibold text-purple-800">
                Frase de fechamento: &ldquo;Imagina isso com a cara do [NOME DO
                BAR], com o seu cardapio, no seu dominio. Em 5 dias ta no
                ar.&rdquo;
              </p>
            </div>
          </Card>
        </section>

        {/* Fechamento */}
        <section>
          <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-sm font-black">
              5
            </span>
            Fechamento
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <h3 className="font-bold text-sm mb-3">Se o cliente topar</h3>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li>Anote: nome do negocio, dono, WhatsApp, Instagram</li>
                <li>Pergunte quantos itens tem no cardapio</li>
                <li>Pergunte se ja tem fotos dos produtos</li>
                <li>
                  Explique os planos (Essencial R$ 1.800 / Completo R$ 2.400)
                </li>
                <li>Peca o sinal: R$ 600 ou R$ 800 (PIX na hora)</li>
              </ol>
            </Card>
            <Card>
              <h3 className="font-bold text-sm mb-3">
                Se pedir pra pensar
              </h3>
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 mb-3">
                <p className="text-sm italic">
                  &ldquo;Tranquilo. Vou te mandar o link do demo e a proposta
                  por WhatsApp. Qualquer duvida me chama.&rdquo;
                </p>
              </div>
              <p className="text-xs text-neutral-500">
                Mande a proposta + link do demo + seu contato.
                <br />
                <strong>Follow-up em 3 dias</strong> se nao responder.
              </p>
            </Card>
          </div>
        </section>

        {/* Cidades */}
        <section>
          <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center text-sm font-black">
              6
            </span>
            Cidades prioritarias
          </h2>
          <Card>
            <ul className="space-y-2 text-sm">
              {[
                "20.000 a 200.000 habitantes (mercado suficiente, pouca concorrencia tech)",
                "Cidades universitarias (publico jovem, acostumado a pedir online)",
                "Cidades turisticas (bares e restaurantes movimentados)",
                "Regioes onde iFood ja opera mas o servico e ruim",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-neutral-400 mt-0.5">&#9679;</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-sm font-semibold text-amber-800">
                Em cidade pequena, 1 case de sucesso gera 3-5 indicacoes. O
                primeiro cliente e o mais importante.
              </p>
            </div>
          </Card>
        </section>

        {/* Links uteis */}
        <section>
          <h2 className="text-lg font-extrabold mb-4">Links uteis</h2>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://adenaobocao-boteco-da-estacao-1c8n.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-5 text-sm font-bold bg-red-600 text-white rounded-full inline-flex items-center hover:bg-red-700 transition-colors"
            >
              Demo ao vivo
            </a>
            <Link
              href="/comercial"
              className="h-10 px-5 text-sm font-bold border-2 border-neutral-200 text-neutral-700 rounded-full inline-flex items-center hover:border-neutral-300 transition-colors"
            >
              Pagina comercial
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-neutral-200 text-neutral-400 text-xs">
        BotecoSystem &mdash; Area restrita do prospector. Nao compartilhe este
        link com clientes.
      </footer>
    </div>
  );
}
