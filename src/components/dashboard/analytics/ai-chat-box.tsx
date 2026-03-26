"use client";

import { useState } from "react";
import { askAboutBusiness } from "@/lib/actions/ai-insights";

export function AiChatBox() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || loading) return;
    setLoading(true);
    setAnswer("");
    const result = await askAboutBusiness(question.trim());
    setAnswer(result);
    setLoading(false);
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h2 className="text-sm font-semibold mb-2">Pergunte a IA</h2>
      <p className="text-[10px] text-muted-foreground mb-3">
        Ex: &quot;Como foram as vendas essa semana?&quot; ou &quot;Qual produto devo promover?&quot;
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Sua pergunta..."
          className="flex-1 h-9 px-3 text-xs bg-background border border-border rounded-lg"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="h-9 px-4 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 shrink-0"
        >
          {loading ? "Pensando..." : "Perguntar"}
        </button>
      </form>

      {answer && (
        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs leading-relaxed whitespace-pre-line">{answer}</p>
        </div>
      )}
    </div>
  );
}
