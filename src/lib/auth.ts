import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { authConfig } from "@/lib/auth.config";
import type { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      loyaltyPoints: number;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db) as ReturnType<typeof PrismaAdapter>,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        const dbUser = await db.user.findUnique({
          where: { id: user.id! },
          select: { role: true, loyaltyPoints: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.loyaltyPoints = dbUser.loyaltyPoints;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = (token.role as UserRole) ?? "CUSTOMER";
      session.user.loyaltyPoints = (token.loyaltyPoints as number) ?? 0;
      return session;
    },
  },
});
