"use client";

import { useState } from "react";
import { createCampaign, sendCampaignNow } from "@/lib/actions/campaigns";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface EventData {
  id: string;
  title: string;
  artistName: string | null;
  date: string;
  startTime: string;
  coverCharge: number;
  isCoverFree: boolean;
}

interface Props {
  segmentCounts: { segment: string; count: number }[];
  products: Product[];
  events: EventData[];
  template?: string; // pre-filled from quick campaign
  templateName?: string;
  templateSegment?: string;
  templateOccasion?: string;
  imageUrl?: string; // from criativo editor
}

const segmentLabels: Record<string, string> = {
  ALL: "Todos os clientes",
  NEW: "Novos",
  RECURRING: "Recorrentes",
  VIP: "VIP",
  INACTIVE: "Inativos",
};

const templates = [
  { id: "happy_hour", label: "Happy Hour", icon: "M8 2v4M16 2v4M3 10h18", occasion: "Happy hour com descontos em drinks e chopp", tone: "festivo", segment: "ALL" },
  { id: "promo_flash", label: "Promo Flash", icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8", occasion: "Promocao relampago por tempo limitado", tone: "urgente", segment: "ALL" },
  { id: "fim_semana", label: "Fim de Semana", icon: "M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z", occasion: "Programacao especial de fim de semana", tone: "casual", segment: "ALL" },
  { id: "reativar", label: "Reativar Inativos", icon: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", occasion: "Trazer de volta clientes que sumiram com oferta especial", tone: "casual", segment: "INACTIVE" },
  { id: "vip_reward", label: "Recompensa VIP", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", occasion: "Recompensa exclusiva para clientes fieis", tone: "casual", segment: "VIP" },
  { id: "evento", label: "Divulgar Evento", icon: "M9 18V5l12-2v13", occasion: "Divulgacao de show/evento no bar", tone: "festivo", segment: "ALL" },
];

const tones = [
  { value: "casual", label: "Casual" },
  { value: "festivo", label: "Festivo" },
  { value: "urgente", label: "Urgente" },
  { value: "informativo", label: "Informativo" },
];

export function CampaignForm({ segmentCounts, products, events, template, templateName, templateSegment, templateOccasion, imageUrl: initialImageUrl }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(template ? 2 : 1);
  const [name, setName] = useState(templateName || "");
  const [segment, setSegment] = useState(templateSegment || "ALL");
  const [message, setMessage] = useState(template || "");
  const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [occasion, setOccasion] = useState(templateOccasion || "");
  const [tone, setTone] = useState("casual");
  const [showProducts, setShowProducts] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);

  const segmentCount =
    segment === "ALL"
      ? segmentCounts.reduce((sum, s) => sum + s.count, 0)
      : segmentCounts.find((s) => s.segment === segment)?.count || 0;

  function handleTemplate(t: typeof templates[0]) {
    setName(t.label);
    setSegment(t.segment);
    setOccasion(t.occasion);
    setTone(t.id === "promo_flash" ? "urgente" : t.id === "reativar" ? "casual" : "festivo");
    if (t.id === "evento" && events.length > 0) {
      setSelectedEvent(events[0].id);
    }
    setStep(2);
  }

  function toggleProduct(id: string) {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  async function handleGenerateAi() {
    setAiLoading(true);
    try {
      const selProducts = products
        .filter((p) => selectedProducts.includes(p.id))
        .map((p) => ({ name: p.name, price: p.price }));

      const event = events.find((e) => e.id === selectedEvent);
      const eventData = event
        ? {
            title: event.title,
            artist: event.artistName || undefined,
            date: event.date,
            coverCharge: event.isCoverFree ? 0 : event.coverCharge,
          }
        : undefined;

      const res = await fetch("/api/ai/campaign-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          segment,
          segmentDescription: segmentLabels[segment],
          products: selProducts.length > 0 ? selProducts : undefined,
          occasion: occasion || undefined,
          tone,
          event: eventData,
        }),
      });
      const data = await res.json();
      if (data.text) setMessage(data.text);
    } catch {
      // silently fail
    }
    setAiLoading(false);
  }

  async function handleCreate() {
    if (!name || !message) return;
    setLoading(true);

    const result = await createCampaign({
      name,
      targetSegment: segment,
      messageTemplate: message,
      scheduledAt: scheduleType === "later" ? scheduledAt : undefined,
      imageUrl: imageUrl || undefined,
    });

    if (scheduleType === "now" && result.id) {
      await sendCampaignNow(result.id);
    }

    setLoading(false);
    router.push("/dashboard/marketing/campanhas");
  }

  // Preview: replace {nome} with example
  const previewMessage = message.replace(/\{nome\}/gi, "Joao");

  return (
    <div className="space-y-6">
      {/* Steps indicator */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              s <= step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Template + Segment */}
      {step === 1 && (
        <div className="space-y-5">
          {/* Quick templates */}
          <div>
            <h2 className="text-sm font-semibold mb-2">Comecar com template</h2>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTemplate(t)}
                  className="flex items-center gap-2 p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0">
                    <path d={t.icon} />
                  </svg>
                  <span className="text-xs font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <hr className="flex-1 border-border" />
            <span className="text-[10px] text-muted-foreground">ou personalizar</span>
            <hr className="flex-1 border-border" />
          </div>

          {/* Segment picker */}
          <div>
            <h2 className="text-sm font-semibold mb-2">Publico</h2>
            <div className="space-y-1.5">
              {["ALL", "NEW", "RECURRING", "VIP", "INACTIVE"].map((seg) => {
                const count =
                  seg === "ALL"
                    ? segmentCounts.reduce((s, c) => s + c.count, 0)
                    : segmentCounts.find((s) => s.segment === seg)?.count || 0;
                return (
                  <button
                    key={seg}
                    onClick={() => setSegment(seg)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                      segment === seg
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-xs font-medium">{segmentLabels[seg]}</span>
                    <span className="text-xs text-muted-foreground">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Nome da campanha</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Promo sexta-feira"
              className="w-full h-9 px-3 text-xs bg-background border border-border rounded-lg"
            />
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!name}
            className="w-full h-10 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            Proximo
          </button>
        </div>
      )}

      {/* Step 2: Configure + Generate */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold">2. Configure a mensagem</h2>

          {/* Tone */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Tom</label>
            <div className="flex gap-1.5">
              {tones.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={`flex-1 py-1.5 text-[10px] font-medium rounded-lg border transition-colors ${
                    tone === t.value ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Occasion */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Ocasiao (opcional)</label>
            <input
              type="text"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="Ex: Black Friday, Dia dos Namorados, jogo do Brasil..."
              className="w-full h-9 px-3 text-xs bg-background border border-border rounded-lg"
            />
          </div>

          {/* Event picker */}
          {events.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Vincular evento da agenda</label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full h-9 px-2 text-xs bg-background border border-border rounded-lg"
              >
                <option value="">Nenhum</option>
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title} — {e.date}{e.artistName ? ` (${e.artistName})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Product picker */}
          <div className="space-y-1.5">
            <button
              onClick={() => setShowProducts(!showProducts)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${showProducts ? "rotate-90" : ""}`}>
                <path d="m9 18 6-6-6-6" />
              </svg>
              Destacar produtos ({selectedProducts.length} selecionados)
            </button>
            {showProducts && (
              <div className="max-h-40 overflow-y-auto space-y-1 p-2 bg-muted/30 rounded-lg">
                {products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => toggleProduct(p.id)}
                    className={`w-full flex items-center justify-between p-1.5 rounded-lg text-xs transition-colors ${
                      selectedProducts.includes(p.id) ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className="text-muted-foreground">R$ {p.price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerateAi}
            disabled={aiLoading}
            className="w-full h-9 text-xs font-medium border border-primary text-primary rounded-lg hover:bg-primary/5 disabled:opacity-50"
          >
            {aiLoading ? "Gerando com IA..." : "Gerar mensagem com IA"}
          </button>

          {/* Message editor */}
          <div className="space-y-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder="Escreva a mensagem ou gere com IA... Use {nome} pra personalizar."
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-lg resize-none"
            />
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  if (!message.includes("{nome}")) {
                    setMessage((prev) => `Opa {nome}! ${prev}`);
                  }
                }}
                className="text-[10px] text-primary hover:underline"
              >
                + Inserir {"{nome}"}
              </button>
              <span className={`text-[10px] ${message.length > 300 ? "text-red-500" : "text-muted-foreground"}`}>
                {message.length}/300
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="flex-1 h-10 text-xs font-medium border border-border rounded-lg hover:bg-muted">
              Voltar
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!message}
              className="flex-1 h-10 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              Preview
            </button>
          </div>
        </div>
      )}

      {/* Step 3: WhatsApp Preview */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold">3. Preview no WhatsApp</h2>

          {/* WhatsApp-style preview */}
          <div className="bg-[#ECE5DD] rounded-2xl p-4 min-h-[200px] flex flex-col justify-end">
            <div className="max-w-[85%] ml-auto">
              <div className="bg-[#DCF8C6] rounded-xl rounded-tr-sm p-3 shadow-sm">
                {imageUrl && (
                  <img src={imageUrl} alt="Arte" className="w-full rounded-lg mb-2" />
                )}
                <p className="text-xs leading-relaxed whitespace-pre-line text-[#111]">
                  {previewMessage || "..."}
                </p>
                <p className="text-[9px] text-[#999] text-right mt-1">
                  {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          </div>

          {message.includes("{nome}") && (
            <p className="text-[10px] text-muted-foreground text-center">
              {"{nome}"} sera substituido pelo nome de cada cliente
            </p>
          )}

          <div className="flex gap-2">
            <button onClick={() => setStep(2)} className="flex-1 h-10 text-xs font-medium border border-border rounded-lg hover:bg-muted">
              Editar
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex-1 h-10 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm + Send */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold">4. Confirmar e enviar</h2>

          <div className="p-4 bg-muted/30 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Campanha</span>
              <span className="font-medium">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Publico</span>
              <span className="font-medium">{segmentLabels[segment]} ({segmentCount})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Personalizacao</span>
              <span className="font-medium">{message.includes("{nome}") ? "Sim ({nome})" : "Nao"}</span>
            </div>
            {imageUrl && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Arte visual</span>
                <span className="font-medium text-green-600">Anexada</span>
              </div>
            )}
            {selectedProducts.length > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Produtos</span>
                <span className="font-medium">{selectedProducts.length} selecionados</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Quando enviar?</label>
            <div className="flex gap-2">
              <button
                onClick={() => setScheduleType("now")}
                className={`flex-1 h-9 text-xs font-medium rounded-lg border transition-colors ${
                  scheduleType === "now" ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                Agora
              </button>
              <button
                onClick={() => setScheduleType("later")}
                className={`flex-1 h-9 text-xs font-medium rounded-lg border transition-colors ${
                  scheduleType === "later" ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                Agendar
              </button>
            </div>
            {scheduleType === "later" && (
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full h-9 px-3 text-xs bg-background border border-border rounded-lg"
              />
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep(3)} className="flex-1 h-10 text-xs font-medium border border-border rounded-lg hover:bg-muted">
              Voltar
            </button>
            <button
              onClick={handleCreate}
              disabled={loading || (scheduleType === "later" && !scheduledAt)}
              className="flex-1 h-10 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {loading
                ? "Enviando..."
                : scheduleType === "now"
                  ? `Enviar para ${segmentCount} clientes`
                  : "Agendar campanha"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
