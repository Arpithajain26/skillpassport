import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

type FirebaseLookupResponse = {
  users?: Array<{
    email?: string;
    emailVerified?: boolean;
    displayName?: string;
    photoUrl?: string;
  }>;
};

async function verifyFirebaseToken(idToken: string) {
  // Firebase web API keys are intentionally public identifiers. Keep this
  // fallback in sync with the browser Firebase configuration so token
  // verification also works when Vercel environment variables are absent.
  const apiKey = process.env.FIREBASE_WEB_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCloSzqVIVIXl6YKQyAGG0yQ_nY4DG7TXY";
  if (!apiKey) return null;

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
    cache: "no-store",
  });
  if (!response.ok) return null;

  const payload = (await response.json()) as FirebaseLookupResponse;
  const user = payload.users?.[0];
  return user?.email && user.emailVerified ? user : null;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "skillpassport-production-secret-key-998877665544332211",
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
        firebaseToken: { label: "Firebase token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || (!credentials?.password && !credentials?.firebaseToken)) return null;
        const emailStr = credentials.email as string;
        const passwordStr = credentials.password as string;

        try {
          const firebaseToken = credentials.firebaseToken as string | undefined;
          if (firebaseToken) {
            const firebaseUser = await verifyFirebaseToken(firebaseToken);
            if (!firebaseUser) return null;

            const email = firebaseUser.email!;
            const user = await prisma.user.upsert({
              where: { email },
              update: {
                name: firebaseUser.displayName || undefined,
                image: firebaseUser.photoUrl || undefined,
              },
              create: {
                name: firebaseUser.displayName || "Google User",
                email,
                image: firebaseUser.photoUrl,
                username: `${email.split("@")[0].replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${Date.now().toString(36)}`,
              },
            });

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              username: user.username,
              onboardingComplete: user.onboardingComplete,
            };
          }

          const user = await prisma.user.findUnique({
            where: { email: emailStr },
          });

          if (user) {
            if (user.password) {
              const isValid = await bcrypt.compare(passwordStr, user.password);
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
          }
        } catch (dbError) {
          // Never authenticate a user when the identity store is unavailable.
          console.error("Unable to verify credentials:", dbError);
        }

        return null;
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
