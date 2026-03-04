import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        if (!email) return null;

        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            username: email.split("@")[0],
            avatar: "🔥",
          },
        });

        return {
          id: user.id,
          email: user.email ?? undefined,
          name: user.name ?? user.username ?? undefined,
          avatar: user.avatar ?? "🔥",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // On sign-in, seed token from user object
      if (user) {
        token.sub = user.id;
        token.avatar = (user as any).avatar ?? "🔥";
      }
      // On session update (called from useSession().update()), sync avatar
      if (trigger === "update" && session?.avatar) {
        token.avatar = session.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).avatar = token.avatar ?? "🔥";
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
};