import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { PWARegister } from "@/components/pwa-register";
import { Providers } from "@/components/providers";
import { PushPrompt } from "@/components/storefront/push-prompt";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Boteco da Estacao",
    template: "%s | Boteco da Estacao",
  },
  description:
    "Hamburgueres artesanais, porcoes e cervejas geladas em Ponta Grossa. Faca seu pedido online!",
  keywords: [
    "boteco",
    "hamburgueria",
    "ponta grossa",
    "delivery",
    "cerveja",
    "bar",
  ],
  authors: [{ name: "Boteco da Estacao" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Boteco da Estacao",
    title: "Boteco da Estacao",
    description:
      "Hamburgueres artesanais, porcoes e cervejas geladas em Ponta Grossa.",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Boteco da Estacao",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#B91C1C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <PWARegister />
          <PushPrompt />
        </Providers>
      </body>
    </html>
  );
}
