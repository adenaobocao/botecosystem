"use client";

import { useState } from "react";
import { createCampaign, sendCampaignNow } from "@/lib/actions/campaigns";
import { useRouter } from "next/navigation";

interface Props {
  segmentCounts: { segment: string; count: number }[];
}

const segmentLabels: Record<string, string> = {
  ALL: "Todos os clientes",
  NEW: "Novos",
  RECURRING: "Recorrentes",
  VIP: "VIP",
  INACTIVE: "Inativos",
};

export function CampaignForm({ segmentCounts }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [segment, setSegment] = useState("ALL");
  const [message, setMessage] = useState("");
  const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const segmentCount =
    segment === "ALL"
      ? segmentCounts.reduce((sum, s) => sum + s.count, 0)
      : segmentCounts.find((s) => s.segment === segment)?.count || 0;

  async function handleGenerateAi() {
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/campaign-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segment, segmentDescription: segmentLabels[segment] }),
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
    });

    // Se enviar agora, dispara
    if (scheduleType === "now" && result.id) {
      await sendCampaignNow(result.id);
    }

    setLoading(false);
    router.push("/dashboard/marketing/campanhas");
  }

  return (
    <div className="space-y-6">
      {/* Steps indicator */}
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              s <= step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Segment */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold">1. Escolha o publico</h2>
          <div className="space-y-2">
            {["ALL", "NEW", "RECURRING", "VIP", "INACTIVE"].map((seg) => {
              const count =
                seg === "ALL"
                  ? segmentCounts.reduce((s, c) => s + c.count, 0)
                  : segmentCounts.find((s) => s.segment === seg)?.count || 0;
              return (
                <button
                  key={seg}
                  onClick={() => setSegment(seg)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-colors ${
                    segment === seg
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <span className="text-xs font-medium">{segmentLabels[seg]}</span>
                  <span className="text-xs text-muted-foreground">{count} clientes</span>
                </button>
              );
            })}
          </div>
          <div className="space-y-2">
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

      {/* Step 2: Message */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold">2. Mensagem</h2>
          <p className="text-[10px] text-muted-foreground">
            Sera enviada via WhatsApp para {segmentCount} clientes do segmento &quot;{segmentLabels[segment]}&quot;
          </p>
          <button
            onClick={handleGenerateAi}
            disabled={aiLoading}
            className="w-full h-9 text-xs font-medium border border-primary text-primary rounded-lg hover:bg-primary/5 disabled:opacity-50"
          >
            {aiLoading ? "Gerando com IA..." : "Gerar mensagem com IA"}
          </button>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            placeholder="Escreva a mensagem ou clique em gerar com IA..."
            className="w-full px-3 py-2 text-xs bg-background border border-border rounded-lg resize-none"
          />
          <p className="text-[10px] text-muted-foreground text-right">
            {message.length}/300 caracteres
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="flex-1 h-10 text-xs font-medium border border-border rounded-lg hover:bg-muted"
            >
              Voltar
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!message}
              className="flex-1 h-10 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              Proximo
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold">3. Confirmar e enviar</h2>

          <div className="p-4 bg-muted/30 rounded-xl space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Campanha</span>
              <span className="font-medium">{name}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Publico</span>
              <span className="font-medium">{segmentLabels[segment]} ({segmentCount})</span>
            </div>
            <hr className="border-border" />
            <p className="text-xs bg-background p-2 rounded-lg whitespace-pre-line">{message}</p>
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
            <button
              onClick={() => setStep(2)}
              className="flex-1 h-10 text-xs font-medium border border-border rounded-lg hover:bg-muted"
            >
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
