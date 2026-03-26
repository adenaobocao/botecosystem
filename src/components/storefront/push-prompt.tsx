"use client";

import { useState, useEffect } from "react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from(rawData, (char) => char.charCodeAt(0));
}

export function PushPrompt() {
  const [show, setShow] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    // So mostra se browser suporta e nao ta subscribed
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    if (!VAPID_PUBLIC_KEY) return;

    const dismissed = localStorage.getItem("push-dismissed");
    if (dismissed) return;

    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        if (sub) {
          setSubscribed(true);
        } else {
          // Mostra prompt depois de 5s
          setTimeout(() => setShow(true), 5000);
        }
      });
    });
  }, []);

  async function handleSubscribe() {
    try {
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });

      setSubscribed(true);
      setShow(false);
    } catch {
      setShow(false);
    }
  }

  function handleDismiss() {
    setShow(false);
    localStorage.setItem("push-dismissed", "1");
  }

  if (!show || subscribed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-sm animate-in slide-in-from-bottom-4">
      <div className="bg-card border border-border rounded-2xl shadow-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Fica por dentro!</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Receba promos exclusivas e novidades do Boteco direto no celular
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSubscribe}
                className="h-8 px-4 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Quero receber
              </button>
              <button
                onClick={handleDismiss}
                className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground"
              >
                Agora nao
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
