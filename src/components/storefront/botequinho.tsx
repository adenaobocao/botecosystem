"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

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

export function Botequinho() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [started, setStarted] = useState(false);
  const [pulse, setPulse] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Pulsa por 8s depois para
  useEffect(() => {
    const timer = setTimeout(() => setPulse(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  function handleOpen() {
    setOpen(true);
    setPulse(false);
    if (!started) {
      setStarted(true);
      setMessages([
        { from: "bot", text: "Opa! Sou o assistente do Boteco da Estacao. Como posso te ajudar?" },
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
        <div className="fixed bottom-20 left-3 z-[65] w-[320px] max-h-[460px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-toast-slide md:bottom-4 md:left-4">
          {/* Header — brand red gradient */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary to-primary/85 text-primary-foreground">
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/30 shrink-0">
              <Image src="/logo.png" alt="Boteco" fill className="object-cover" sizes="36px" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-tight">Boteco da Estacao</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <p className="text-[10px] opacity-80">Online agora</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[200px] max-h-[280px] bg-gradient-to-b from-muted/30 to-transparent">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.from === "bot" && (
                  <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 mr-1.5 mt-1 ring-1 ring-border">
                    <Image src="/logo.png" alt="" fill className="object-cover" sizes="24px" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                    msg.from === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border border-border text-card-foreground rounded-bl-sm shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="border-t border-border p-3 space-y-2.5 bg-card">
            {availableFaqs.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {availableFaqs.slice(0, 3).map((faq) => (
                  <button
                    key={faq.q}
                    onClick={() => handleFaq(faq)}
                    className="px-2.5 py-1.5 bg-secondary text-secondary-foreground text-[11px] font-medium rounded-full hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all"
                  >
                    {faq.q}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] text-white text-xs font-semibold rounded-xl hover:bg-[#20BD5A] transition-colors shadow-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Falar com atendente
            </button>
          </div>
        </div>
      )}

      {/* Floating button — logo do boteco com indicador online */}
      <button
        onClick={open ? () => setOpen(false) : handleOpen}
        className="fixed bottom-20 left-3 z-[65] w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 md:bottom-4 md:left-4 group"
        aria-label="Abrir atendimento"
        style={{ display: open ? "none" : "flex" }}
      >
        {/* Pulse ring */}
        {pulse && (
          <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
        )}
        {/* Button body */}
        <span className="relative w-full h-full rounded-full bg-primary flex items-center justify-center ring-2 ring-primary/20 group-hover:ring-primary/40 overflow-hidden">
          <Image src="/logo.png" alt="Atendimento" fill className="object-cover scale-[0.85] rounded-full" sizes="56px" />
        </span>
        {/* Online dot */}
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-white rounded-full" />
        </span>
      </button>
    </>
  );
}
