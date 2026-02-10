import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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

        // Temporary demo auth (no password) for now.
        // We'll swap to Prisma-backed users next.
        return { id: email, email };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
};
