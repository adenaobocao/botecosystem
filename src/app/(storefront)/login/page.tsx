import { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/storefront/login-form";

export const metadata: Metadata = {
  title: "Entrar",
};

interface Props {
  searchParams: Promise<{ admin?: string; callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const isAdmin = params.admin === "true";

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-8rem)] px-4 pb-20 md:pb-0">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/logo.png"
            alt="Boteco da Estacao"
            width={64}
            height={64}
            className="rounded-full"
          />
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight">
              {isAdmin ? "Acesso administrativo" : "Entrar no Boteco"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isAdmin
                ? "Acesse o painel de gerenciamento"
                : "Seu nome e telefone pra fazer pedidos e acompanhar entregas"}
            </p>
          </div>
        </div>

        <LoginForm />

        {!isAdmin && (
          <p className="text-center text-[11px] text-muted-foreground leading-relaxed">
            Ao continuar, voce concorda com nossos{" "}
            <a href="/termos" className="underline hover:text-foreground">
              Termos de Uso
            </a>{" "}
            e{" "}
            <a href="/privacidade" className="underline hover:text-foreground">
              Politica de Privacidade
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}
