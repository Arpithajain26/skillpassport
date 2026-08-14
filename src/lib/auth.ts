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
  const apiKey = "AIzaSyCloSzqVIVIXl6YKQyAGG0yQ_nY4DG7TXY";
  if (!apiKey) {
    console.error("❌ Firebase API key missing");
    return null;
  }

  try {
    console.log("🔍 Verifying Firebase token with Google API...");
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const error = await response.json();
      console.error(
        "❌ Firebase API error:",
        error?.error?.message || JSON.stringify(error),
      );
      return null;
    }

    const payload = (await response.json()) as FirebaseLookupResponse;
    const user = payload.users?.[0];

    if (!user?.email) {
      console.error("❌ No email found in Firebase response");
      return null;
    }

    console.log("✅ Firebase token verified for:", user.email);
    return user;
  } catch (error) {
    console.error(
      "❌ Firebase verification exception:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === "development",
  secret:
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET ||
    "skillpassport-production-secret-key-998877665544332211",
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
        if (
          !credentials?.email ||
          (!credentials?.password && !credentials?.firebaseToken)
        ) {
          console.warn("❌ Missing required credentials");
          return null;
        }

        const isValidUserId = (value: string) => !!value && value.length > 0;
        const emailStr = credentials.email as string;
        const passwordStr = credentials.password as string;

        try {
          const firebaseToken = credentials.firebaseToken as string | undefined;
          if (firebaseToken) {
            console.log("🔐 Firebase auth flow - Email:", emailStr);
            const firebaseUser = await verifyFirebaseToken(firebaseToken);

            if (!firebaseUser) {
              console.error("❌ Firebase token verification failed");
              return null;
            }

            const email = firebaseUser.email!;
            console.log("💾 Creating/updating user in database:", email);

            try {
              const user = await prisma.user.upsert({
                where: { email },
                update: {
                  name: firebaseUser.displayName || undefined,
                  image: firebaseUser.photoUrl || undefined,
                  emailVerified: new Date(),
                },
                create: {
                  name: firebaseUser.displayName || "Google User",
                  email,
                  image: firebaseUser.photoUrl,
                  emailVerified: new Date(),
                  username: `${email
                    .split("@")[0]
                    .replace(/[^a-z0-9]/gi, "-")
                    .toLowerCase()}-${Date.now().toString(36)}`,
                },
              });

              if (!isValidUserId(user.id)) {
                console.error("❌ Invalid user id created:", user.id);
                return null;
              }

              console.log(
                "✅ User created/updated in database:",
                user.id,
                user.email,
              );
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                username: user.username,
                onboardingComplete: user.onboardingComplete,
              };
            } catch (dbError) {
              console.error(
                "❌ Database error during upsert:",
                dbError instanceof Error ? dbError.message : String(dbError),
              );
              return null;
            }
          }

          // Regular email/password login
          console.log("🔐 Email/password auth flow - Email:", emailStr);
          const user = await prisma.user.findUnique({
            where: { email: emailStr },
          });

          if (user?.password) {
            const isValid = await bcrypt.compare(passwordStr, user.password);
            if (isValid) {
              console.log("✅ Password login successful:", user.id);
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

          console.warn("❌ Invalid credentials for:", emailStr);
          return null;
        } catch (dbError) {
          console.error(
            "❌ Authorization error:",
            dbError instanceof Error ? dbError.message : dbError,
          );
          return null;
        }
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
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).username = token.username;
        (session.user as any).onboardingComplete = token.onboardingComplete;
      }
      return session;
    },
  },
});
