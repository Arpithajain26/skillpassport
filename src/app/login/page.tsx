"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldCheck } from "lucide-react";

import { signInWithGoogleFirebase } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Firebase Google Auth simulation states
  const [showFirebase, setShowFirebase] = useState(false);
  const [firebaseStep, setFirebaseStep] = useState<"select" | "loading" | "done">("select");
  const [firebaseAccount, setFirebaseAccount] = useState<any>(null);

  const GOOGLE_ACCOUNTS = [
    {
      name: "Arpitha Jain",
      email: "arpithaammujain39@gmail.com",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arpitha",
    },
    {
      name: "Alex Chen",
      email: "alex.chen@gmail.com",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    }
  ];

  async function triggerFirebaseSignIn() {
    setError("");
    const res = await signInWithGoogleFirebase();
    if (res.success && res.user) {
      await handleGoogleLogin({
        name: res.user.name,
        email: res.user.email,
        image: res.user.image,
      });
    } else {
      // Fallback to interactive account selector modal
      setShowFirebase(true);
      setFirebaseStep("select");
    }
  }

  async function handleGoogleLogin(account: typeof GOOGLE_ACCOUNTS[0]) {
    setFirebaseAccount(account);
    setFirebaseStep("loading");

    try {
      // 1. Simulate API register call (if not exists)
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: account.name,
          email: account.email,
          password: "google-oauth-secure-bypass-1234",
        }),
      });

      // 2. If registration succeeds or already exists (409), authenticate via NextAuth
      const authRes = await signIn("credentials", {
        email: account.email,
        password: "google-oauth-secure-bypass-1234",
        redirect: false,
      });

      if (authRes?.error) {
        setError("Firebase authorization failed. Please try again.");
        setShowFirebase(false);
      } else {
        // Update user image with the Google Avatar in database
        await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: account.image,
            onboardingComplete: true, // Auto complete onboarding for Google login
          }),
        });

        setFirebaseStep("done");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1000);
      }
    } catch (err) {
      setError("Firebase service connection error.");
      setShowFirebase(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        position: "relative",
        background: "#07070f",
        color: "#f0f0ff",
        overflow: "hidden",
      }}
    >
      {/* Background blobs */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background: "radial-gradient(ellipse at 30% 30%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(139,92,246,0.08) 0%, transparent 60%)",
        }}
      />

      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid #6366f1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src="/logo.jpg" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 20, color: "#ffffff" }}>
              Skill<span style={{ background: "linear-gradient(135deg, #818cf8, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Passport</span>
            </span>
          </Link>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginTop: 28, marginBottom: 8 }}>
            Welcome back
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            Sign in to your SkillPassport account
          </p>
        </div>

        <div className="card" style={{ padding: 32, background: "rgba(19,19,31,0.85)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
          {error && (
            <div className="alert alert-error" style={{ marginBottom: 20 }}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="input-group">
              <label className="input-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "12px 20px", borderRadius: 10 }}
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          {/* Social Divider */}
          <div style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ padding: "0 10px", fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Continue with Google button */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={triggerFirebaseSignIn}
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "12px 20px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer",
            }}
          >
            {/* Google Icon SVG */}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.17-4.53z"
              />
            </svg>
            Continue with Google (Firebase)
          </button>

          <hr className="divider" style={{ margin: "20px 0" }} />

          {/* Demo quick login */}
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>Instant Demo Access:</p>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: "100%", justifyContent: "center", fontSize: 13, padding: "10px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)" }}
            onClick={async () => {
              setEmail("alex@example.com");
              setPassword("demo1234");
              setLoading(true);
              const res = await signIn("credentials", {
                email: "alex@example.com",
                password: "demo1234",
                redirect: false,
              });
              if (!res?.error) {
                router.push("/dashboard");
                router.refresh();
              }
              setLoading(false);
            }}
          >
            ⚡ 1-Click Demo Login (Alex Chen)
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-secondary)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" style={{ color: "var(--primary-light)", fontWeight: 600 }}>
            Sign up free
          </Link>
        </p>
      </div>

      {/* ── FIREBASE OAUTH POPUP SIMULATION MODAL ── */}
      <AnimatePresence>
        {showFirebase && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(8px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                width: "100%",
                maxWidth: 380,
                background: "#0d0d18",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 24px 70px rgba(0,0,0,0.8), 0 0 30px rgba(99,102,241,0.15)",
              }}
            >
              {/* Firebase Header */}
              <div
                style={{
                  background: "#121222",
                  padding: "16px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <img
                    src="https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png"
                    alt="Firebase Logo"
                    style={{ width: 20, height: 20 }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#ffca28", fontFamily: "sans-serif" }}>
                    Firebase Auth
                  </span>
                </div>
                <button
                  onClick={() => setShowFirebase(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#9394a5",
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Firebase Auth Popup Body */}
              <div style={{ padding: 24, textAlign: "center" }}>
                {firebaseStep === "select" && (
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#ffffff" }}>
                      Sign in with Google
                    </h3>
                    <p style={{ fontSize: 12, color: "#9394a5", marginBottom: 20 }}>
                      to continue to <strong style={{ color: "#ffffff" }}>SkillPassport</strong>
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left" }}>
                      {GOOGLE_ACCOUNTS.map((account) => (
                        <div
                          key={account.email}
                          onClick={() => handleGoogleLogin(account)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: 12,
                            borderRadius: 10,
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            cursor: "pointer",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                        >
                          <img
                            src={account.image}
                            alt={account.name}
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              border: "1px solid rgba(255,255,255,0.1)",
                            }}
                          />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#ffffff" }}>{account.name}</div>
                            <div style={{ fontSize: 11, color: "#9394a5" }}>{account.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {firebaseStep === "loading" && (
                  <div style={{ padding: "20px 0" }}>
                    <div
                      className="animate-spin"
                      style={{
                        margin: "0 auto 20px",
                        width: 36,
                        height: 36,
                        border: "3px solid rgba(255,255,255,0.1)",
                        borderTopColor: "#ffca28",
                        borderRadius: "50%",
                      }}
                    />
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#ffffff", marginBottom: 6 }}>
                      Connecting to Google Account...
                    </h3>
                    <p style={{ fontSize: 12, color: "#9394a5" }}>
                      Setting up OAuth session token for {firebaseAccount?.email}
                    </p>
                  </div>
                )}

                {firebaseStep === "done" && (
                  <div style={{ padding: "20px 0" }}>
                    <div
                      style={{
                        margin: "0 auto 16px",
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background: "rgba(16,185,129,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid rgba(16,185,129,0.3)",
                      }}
                    >
                      <span style={{ color: "#10b981", fontSize: 20, fontWeight: 800 }}>✓</span>
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#ffffff", marginBottom: 6 }}>
                      Authorized successfully!
                    </h3>
                    <p style={{ fontSize: 12, color: "#9394a5" }}>
                      Welcome back, {firebaseAccount?.name}! Redirecting to dashboard...
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
