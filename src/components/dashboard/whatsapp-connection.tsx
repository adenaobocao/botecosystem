"use client";

import { useState, useEffect, useCallback } from "react";

interface ConnectionState {
  configured: boolean;
  state: "connected" | "disconnected" | "unconfigured" | "error" | "restarting";
  qrcode?: string | null;
  phoneNumber?: string | null;
  message: string;
}

export function WhatsAppConnection() {
  const [conn, setConn] = useState<ConnectionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/whatsapp/connection");
      const data = await res.json();
      setConn(data);
    } catch {
      setConn({ configured: false, state: "error", message: "Erro de rede" });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // Auto-refresh QR code a cada 20s se desconectado
  useEffect(() => {
    if (conn?.state !== "disconnected") return;
    const interval = setInterval(checkStatus, 20000);
    return () => clearInterval(interval);
  }, [conn?.state, checkStatus]);

  // Auto-check connection a cada 5s quando tem QR (esperando scan)
  useEffect(() => {
    if (!conn?.qrcode) return;
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [conn?.qrcode, checkStatus]);

  async function handleAction(action: "logout" | "restart") {
    setActionLoading(true);
    try {
      await fetch(`/api/whatsapp/connection?action=${action}`);
      // Espera um pouco e atualiza
      setTimeout(checkStatus, 2000);
    } catch {
      // silently fail
    }
    setActionLoading(false);
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-48 bg-muted rounded-xl" />
      </div>
    );
  }

  if (!conn) return null;

  // Nao configurado
  if (!conn.configured || conn.state === "unconfigured") {
    return (
      <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 shrink-0 mt-0.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-800">WhatsApp nao configurado</p>
            <p className="text-xs text-amber-700 mt-1">{conn.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Conectado
  if (conn.state === "connected") {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">WhatsApp conectado</p>
                {conn.phoneNumber && (
                  <p className="text-xs text-green-700 mt-0.5">
                    +{conn.phoneNumber.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "$1 ($2) $3-$4")}
                  </p>
                )}
                <p className="text-[10px] text-green-600 mt-0.5">Bot de pedidos, campanhas e notificacoes ativos</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-medium text-green-700">Online</span>
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleAction("restart")}
            disabled={actionLoading}
            className="flex-1 h-9 text-xs font-medium border border-border rounded-lg hover:bg-muted disabled:opacity-50"
          >
            Reiniciar conexao
          </button>
          <button
            onClick={() => handleAction("logout")}
            disabled={actionLoading}
            className="h-9 px-4 text-xs font-medium border border-red-200 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
          >
            Desconectar
          </button>
        </div>
      </div>
    );
  }

  // Desconectado -- mostra QR
  return (
    <div className="space-y-4">
      <div className="p-4 bg-card border border-border rounded-xl text-center">
        <p className="text-sm font-semibold mb-1">Conectar WhatsApp</p>
        <p className="text-xs text-muted-foreground mb-4">
          Abra o WhatsApp no celular &gt; Aparelhos conectados &gt; Conectar aparelho
        </p>

        {conn.qrcode ? (
          <div className="inline-block p-4 bg-white rounded-2xl shadow-sm">
            <img
              src={conn.qrcode.startsWith("data:") ? conn.qrcode : `data:image/png;base64,${conn.qrcode}`}
              alt="QR Code WhatsApp"
              className="w-56 h-56"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-8">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/40">
              <rect width="5" height="5" x="3" y="3" rx="1" />
              <rect width="5" height="5" x="16" y="3" rx="1" />
              <rect width="5" height="5" x="3" y="16" rx="1" />
              <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
              <path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" />
              <path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" />
              <path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" />
            </svg>
            <p className="text-xs text-muted-foreground">Gerando QR Code...</p>
            <button
              onClick={checkStatus}
              className="text-xs text-primary hover:underline mt-1"
            >
              Tentar novamente
            </button>
          </div>
        )}

        <p className="text-[10px] text-muted-foreground mt-4">
          QR atualiza automaticamente. Apos escanear, aguarde a conexao.
        </p>
      </div>

      {conn.state === "error" && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-700">{conn.message}</p>
        </div>
      )}
    </div>
  );
}
