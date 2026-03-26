import { NextResponse } from "next/server";

const EVOLUTION_URL = process.env.EVOLUTION_API_URL || "";
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY || "";
const INSTANCE = process.env.EVOLUTION_INSTANCE || "boteco";

async function evoApi(path: string, method: string = "GET", body?: unknown) {
  const res = await fetch(`${EVOLUTION_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json", apikey: EVOLUTION_KEY },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    return { error: true, status: res.status, message: text };
  }
  return res.json();
}

// GET: status da conexao + QR code se desconectado
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (!EVOLUTION_URL || !EVOLUTION_KEY) {
    return NextResponse.json({
      configured: false,
      state: "unconfigured",
      message: "Evolution API nao configurada. Defina EVOLUTION_API_URL e EVOLUTION_API_KEY nas variaveis de ambiente.",
    });
  }

  try {
    // Acao: desconectar
    if (action === "logout") {
      await evoApi(`/instance/logout/${INSTANCE}`, "DELETE");
      return NextResponse.json({ state: "disconnected", message: "Desconectado" });
    }

    // Acao: reiniciar
    if (action === "restart") {
      await evoApi(`/instance/restart/${INSTANCE}`, "PUT");
      return NextResponse.json({ state: "restarting", message: "Reiniciando..." });
    }

    // Checa status da instancia
    const stateResult = await evoApi(`/instance/connectionState/${INSTANCE}`);

    if (stateResult.error) {
      // Instancia nao existe - tenta criar
      if (stateResult.status === 404) {
        const webhookUrl = process.env.NEXT_PUBLIC_APP_URL
          ? `${process.env.NEXT_PUBLIC_APP_URL}/api/whatsapp/webhook`
          : "";

        await evoApi(`/instance/create`, "POST", {
          instanceName: INSTANCE,
          qrcode: true,
          integration: "WHATSAPP-BAILEYS",
          webhook: webhookUrl
            ? {
                url: webhookUrl,
                byEvents: false,
                base64: false,
                events: ["MESSAGES_UPSERT"],
              }
            : undefined,
        });

        // Busca QR depois de criar
        const connectResult = await evoApi(`/instance/connect/${INSTANCE}`);
        return NextResponse.json({
          configured: true,
          state: "disconnected",
          qrcode: connectResult.base64 || connectResult.code || null,
          message: "Instancia criada. Escaneie o QR Code com seu WhatsApp.",
        });
      }

      return NextResponse.json({
        configured: true,
        state: "error",
        message: stateResult.message || "Erro ao conectar com Evolution API",
      });
    }

    const state = stateResult.state || stateResult.instance?.state || "unknown";

    // Se conectado, retorna info
    if (state === "open" || state === "connected") {
      // Tenta pegar info do numero conectado
      let phoneNumber = null;
      try {
        const instanceInfo = await evoApi(`/instance/fetchInstances?instanceName=${INSTANCE}`);
        if (Array.isArray(instanceInfo) && instanceInfo[0]?.instance?.owner) {
          phoneNumber = instanceInfo[0].instance.owner.replace("@s.whatsapp.net", "");
        }
      } catch {
        // silently fail
      }

      return NextResponse.json({
        configured: true,
        state: "connected",
        phoneNumber,
        message: "WhatsApp conectado e funcionando",
      });
    }

    // Se desconectado, gera QR code
    const connectResult = await evoApi(`/instance/connect/${INSTANCE}`);
    return NextResponse.json({
      configured: true,
      state: "disconnected",
      qrcode: connectResult.base64 || connectResult.code || null,
      message: "Escaneie o QR Code com seu WhatsApp",
    });
  } catch (error) {
    console.error("[whatsapp/connection] Error:", error);
    return NextResponse.json({
      configured: true,
      state: "error",
      message: "Erro ao se comunicar com Evolution API",
    });
  }
}
