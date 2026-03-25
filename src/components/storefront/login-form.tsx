"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useRef } from "react";

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function LoginFormInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const isCheckout = callbackUrl.includes("checkout");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const phoneRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setError("Telefone invalido");
      return;
    }
    if (name.trim().length < 2) {
      setError("Informe seu nome");
      return;
    }

    setLoading(true);

    const result = await signIn("phone", {
      phone: cleanPhone,
      name: name.trim(),
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Erro ao entrar. Tente novamente.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhone(formatPhone(e.target.value));
  }

  return (
    <div className="space-y-5">
      {isCheckout && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30 rounded-xl">
          <p className="text-xs text-amber-800 dark:text-amber-300 font-medium text-center">
            Faca login pra finalizar seu pedido e acompanhar a entrega
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Seu nome</label>
          <input
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Como quer ser chamado?"
            required
            autoFocus
            autoComplete="name"
            className="flex h-12 w-full rounded-xl border border-border bg-card px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Telefone (WhatsApp)</label>
          <input
            ref={phoneRef}
            name="phone"
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="(42) 99999-9999"
            required
            autoComplete="tel"
            inputMode="numeric"
            className="flex h-12 w-full rounded-xl border border-border bg-card px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 font-medium">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Entrando...
            </span>
          ) : (
            "Continuar"
          )}
        </button>
      </form>

      <p className="text-[11px] text-center text-muted-foreground leading-relaxed">
        Usamos seu telefone pra enviar atualizacoes do pedido via WhatsApp.
        Sem spam, prometido.
      </p>
    </div>
  );
}

// Login admin separado — so aparece em /login?admin=true
function AdminLoginInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await signIn("admin", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Login ou senha incorretos");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        name="email"
        type="text"
        placeholder="Login"
        required
        className="flex h-12 w-full rounded-xl border border-border bg-card px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
      />
      <input
        name="password"
        type="password"
        placeholder="Senha"
        required
        className="flex h-12 w-full rounded-xl border border-border bg-card px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
      />
      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

export function LoginForm() {
  return (
    <Suspense>
      <LoginFormContent />
    </Suspense>
  );
}

function LoginFormContent() {
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true";

  if (isAdmin) {
    return <AdminLoginInner />;
  }

  return <LoginFormInner />;
}
