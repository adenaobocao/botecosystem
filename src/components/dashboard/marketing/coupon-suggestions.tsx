"use client";

import { useState } from "react";
import { approveCouponSuggestion, rejectCouponSuggestion, sendCouponToCustomer } from "@/lib/actions/coupons";

interface Suggestion {
  id: string;
  user_id: string;
  user_name: string;
  phone: string;
  reason: string;
  coupon_type: string;
  suggested_value: number;
  status: string;
  created_at: string;
}

interface Props {
  suggestions: Suggestion[];
}

export function CouponSuggestions({ suggestions }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [approvedCodes, setApprovedCodes] = useState<Record<string, string>>({});

  async function handleApprove(id: string) {
    setLoading(id);
    const result = await approveCouponSuggestion(id);
    setApprovedCodes((prev) => ({ ...prev, [id]: result.code }));
    setLoading(null);
  }

  async function handleReject(id: string) {
    setLoading(id);
    await rejectCouponSuggestion(id);
    setLoading(null);
  }

  async function handleSend(id: string) {
    const code = approvedCodes[id];
    if (!code) return;
    setLoading(id);
    try {
      await sendCouponToCustomer(id, code);
      alert("Cupom enviado via WhatsApp!");
    } catch {
      alert("Erro ao enviar");
    }
    setLoading(null);
  }

  if (suggestions.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Nenhuma sugestao de cupom pendente
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {suggestions.map((s) => {
        const isLoading = loading === s.id;
        const approved = approvedCodes[s.id];

        return (
          <div key={s.id} className="p-4 bg-card border border-border rounded-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{s.user_name || "Cliente"}</p>
                <p className="text-[10px] text-muted-foreground">{s.phone}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.reason}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-primary">
                  {s.coupon_type === "PERCENTAGE" ? `${s.suggested_value}%` : `R$${s.suggested_value}`}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {s.coupon_type === "PERCENTAGE" ? "desconto" : "off"}
                </p>
              </div>
            </div>

            {approved ? (
              <div className="mt-3 flex items-center justify-between p-2 bg-green-50 rounded-lg">
                <div>
                  <p className="text-[10px] text-green-700">Cupom criado:</p>
                  <p className="text-sm font-bold text-green-800">{approved}</p>
                </div>
                <button
                  onClick={() => handleSend(s.id)}
                  disabled={isLoading}
                  className="h-8 px-3 text-[10px] font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isLoading ? "Enviando..." : "Enviar WhatsApp"}
                </button>
              </div>
            ) : (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleApprove(s.id)}
                  disabled={isLoading}
                  className="flex-1 h-8 text-[10px] font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {isLoading ? "..." : "Aprovar e criar cupom"}
                </button>
                <button
                  onClick={() => handleReject(s.id)}
                  disabled={isLoading}
                  className="h-8 px-3 text-[10px] font-medium border border-border rounded-lg hover:bg-red-50 text-red-600 disabled:opacity-50"
                >
                  Rejeitar
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
