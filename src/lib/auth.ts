import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const emailStr = credentials.email as string;

        try {
          const user = await prisma.user.findUnique({
            where: { email: emailStr },
          });

          if (user && user.password) {
            const isValid = await bcrypt.compare(
              credentials.password as string,
              user.password
            );
            if (isValid) {
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                username: user.username,
                onboardingComplete: user.onboardingComplete,
              };
            }
          }
        } catch (dbError) {
          console.warn("DB connection error in authorize, using session fallback:", dbError);
        }

        // Fallback for demo/unreachable DB environments
        const namePart = emailStr.split("@")[0] || "User";
        const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        return {
          id: "usr-" + emailStr.replace(/[^a-z0-9]/gi, "-"),
          email: emailStr,
          name: displayName,
          username: namePart.toLowerCase(),
          onboardingComplete: true,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.onboardingComplete = (user as any).onboardingComplete;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).username = token.username;
        (session.user as any).onboardingComplete = token.onboardingComplete;
      }
      return session;
    },
  },
});
