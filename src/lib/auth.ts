import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { authConfig } from "@/lib/auth.config";
import type { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      phone?: string | null;
      image?: string | null;
      role: UserRole;
      loyaltyPoints: number;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db) as ReturnType<typeof PrismaAdapter>,
  providers: [
    ...authConfig.providers,

    // Login por telefone — sem senha, cria conta automatico
    Credentials({
      id: "phone",
      name: "phone",
      credentials: {
        phone: { label: "Telefone", type: "text" },
        name: { label: "Nome", type: "text" },
      },
      async authorize(credentials) {
        const phone = (credentials?.phone as string)?.replace(/\D/g, "");
        const name = (credentials?.name as string)?.trim();

        if (!phone || phone.length < 10 || !name || name.length < 2) return null;

        // Busca ou cria usuario pelo telefone
        let user = await db.user.findFirst({
          where: { phone },
          select: { id: true, name: true, email: true, phone: true, image: true },
        });

        if (!user) {
          user = await db.user.create({
            data: {
              phone,
              name,
              email: `${phone}@boteco.local`,
              role: "CUSTOMER",
            },
            select: { id: true, name: true, email: true, phone: true, image: true },
          });
        } else if (name && name !== user.name) {
          // Atualiza nome se mudou
          await db.user.update({
            where: { id: user.id },
            data: { name },
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),

    // Login admin — email + senha (pra dashboard)
    Credentials({
      id: "admin",
      name: "admin",
      credentials: {
        email: { label: "Login", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            passwordHash: true,
            role: true,
          },
        });

        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        const dbUser = await db.user.findUnique({
          where: { id: user.id! },
          select: { role: true, loyaltyPoints: true, phone: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.loyaltyPoints = dbUser.loyaltyPoints;
          token.phone = dbUser.phone;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = (token.role as UserRole) ?? "CUSTOMER";
      session.user.loyaltyPoints = (token.loyaltyPoints as number) ?? 0;
      session.user.phone = (token.phone as string) ?? null;
      return session;
    },
  },
});
