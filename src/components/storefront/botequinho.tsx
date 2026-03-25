"use client";

import { useState, useRef, useEffect } from "react";

const FAQ = [
  { q: "Qual o horario?", a: "Seg a Sab a partir das 17h, Domingo a partir das 16h. Te esperamos!" },
  { q: "Tem estacionamento?", a: "Temos estacionamento proprio logo ao lado do predio. Tranquilo!" },
  { q: "Aceitam reserva?", a: "Reservas pelo WhatsApp! Clica em 'Falar com atendente' que a gente resolve." },
  { q: "Tem musica ao vivo?", a: "Sim! Confere nossa agenda na home. Segunda sempre tem Roda de Samba!" },
  { q: "Fazem entrega?", a: "Sim! Faz seu pedido pelo cardapio aqui no site e escolhe 'Entrega'." },
];

interface Message {
  from: "bot" | "user";
  text: string;
}

// Pixel art beer cup — 16-bit style SVG
function BeerIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: "pixelated" }}>
      {/* Glass body */}
      <rect x="3" y="4" width="8" height="10" rx="1" fill="#F59E0B" />
      {/* Beer liquid */}
      <rect x="4" y="6" width="6" height="7" fill="#FBBF24" />
      {/* Foam */}
      <rect x="3" y="3" width="8" height="2" rx="1" fill="white" />
      <rect x="2" y="3" width="1" height="1" rx="0.5" fill="white" />
      <rect x="11" y="3" width="1" height="1" rx="0.5" fill="white" />
      {/* Handle */}
      <rect x="11" y="5" width="2" height="1" fill="#D97706" />
      <rect x="13" y="5" width="1" height="5" fill="#D97706" />
      <rect x="11" y="9" width="2" height="1" fill="#D97706" />
      {/* Foam bubbles */}
      <rect x="5" y="4" width="1" height="1" fill="#FEF3C7" opacity="0.6" />
      <rect x="8" y="3" width="1" height="1" fill="#FEF3C7" opacity="0.6" />
      {/* Glass shine */}
      <rect x="4" y="7" width="1" height="4" fill="white" opacity="0.2" />
    </svg>
  );
}

export function Botequinho() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [started, setStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function handleOpen() {
    setOpen(true);
    if (!started) {
      setStarted(true);
      setMessages([
        { from: "bot", text: "E ai! Sou o Botequinho 🍺 Posso te ajudar com alguma duvida?" },
      ]);
    }
  }

  function handleFaq(faq: typeof FAQ[0]) {
    setMessages((prev) => [
      ...prev,
      { from: "user", text: faq.q },
    ]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: faq.a },
      ]);
    }, 600);
  }

  function handleWhatsApp() {
    const msg = encodeURIComponent("Oi! Vim pelo site do Boteco, preciso de ajuda.");
    window.open(`https://wa.me/5542999327823?text=${msg}`, "_blank");
  }

  // Perguntas que ainda nao foram feitas
  const askedQuestions = new Set(messages.filter((m) => m.from === "user").map((m) => m.text));
  const availableFaqs = FAQ.filter((f) => !askedQuestions.has(f.q));

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 left-3 z-[65] w-[300px] max-h-[420px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-toast-slide md:bottom-4 md:left-4">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-amber-50 dark:bg-amber-950/20">
            <BeerIcon size={24} />
            <div className="flex-1">
              <p className="text-sm font-bold">Botequinho</p>
              <p className="text-[10px] text-muted-foreground">Assistente do Boteco</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[180px] max-h-[260px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    msg.from === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary text-secondary-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="border-t border-border p-3 space-y-2">
            {availableFaqs.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {availableFaqs.slice(0, 3).map((faq) => (
                  <button
                    key={faq.q}
                    onClick={() => handleFaq(faq)}
                    className="px-2.5 py-1 bg-secondary text-secondary-foreground text-[11px] font-medium rounded-full hover:bg-secondary/80 transition-colors"
                  >
                    {faq.q}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-1.5 w-full py-2 bg-green-500 text-white text-xs font-semibold rounded-xl hover:bg-green-600 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Falar com atendente
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={open ? () => setOpen(false) : handleOpen}
        className="fixed bottom-20 left-3 z-[65] w-12 h-12 bg-amber-500 hover:bg-amber-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all active:scale-95 md:bottom-4 md:left-4"
        aria-label="Abrir Botequinho"
        style={{ display: open ? "none" : "flex" }}
      >
        <BeerIcon size={28} />
      </button>
    </>
  );
}
