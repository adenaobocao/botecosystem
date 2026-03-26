import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // TODO: reativar auth da dashboard
  // if (pathname.startsWith("/dashboard")) {
  //   if (!isLoggedIn) {
  //     return NextResponse.redirect(new URL("/login", req.url));
  //   }
  // }

  // Minha conta — requer autenticacao
  if (pathname.startsWith("/minha-conta")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Pedidos — requer autenticacao
  if (pathname.startsWith("/pedidos")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Meus pedidos — requer autenticacao
  if (pathname.startsWith("/meus-pedidos")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/minha-conta/:path*", "/pedidos/:path*", "/meus-pedidos/:path*"],
};
