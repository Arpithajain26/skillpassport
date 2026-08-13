"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { signInWithGoogleFirebase } from "@/lib/firebase";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        setLoading(false);
        return;
      }
      // Auto sign in
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      router.push("/onboarding");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setGoogleLoading(true);

    try {
      const res = await signInWithGoogleFirebase();
      if (!res.success || !res.user) {
        let msg = res.error || "Google Sign-In failed.";
        if (msg.includes("unauthorized-domain")) {
          msg = "Domain unauthorized in Firebase. Please add your Vercel URL in Firebase Console -> Authentication -> Settings -> Authorized domains.";
        }
        setError(msg);
        setGoogleLoading(false);
        return;
      }

      const googleUser = res.user;

      // 1. Register user
      await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: googleUser.name,
          email: googleUser.email,
          password: "google-oauth-secure-bypass-1234",
        }),
      });

      // 2. Authenticate
      const authRes = await signIn("credentials", {
        email: googleUser.email,
        password: "google-oauth-secure-bypass-1234",
        redirect: false,
      });

      if (authRes?.error) {
        setError("Sign up authorization failed.");
      } else {
        // Sync profile picture
        await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: googleUser.image,
            onboardingComplete: true,
          }),
        });

        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError("Firebase Google Sign-In error: " + (err?.message || "Connection failed"));
    } finally {
      setGoogleLoading(false);
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
          background: "radial-gradient(ellipse at 70% 30%, rgba(139,92,246,0.12) 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, rgba(99,102,241,0.08) 0%, transparent 60%)",
        }}
      />

      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        {/* Header / Logo */}
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
            Create your passport
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            Build your AI-verified skill identity in minutes
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
              <label className="input-label" htmlFor="reg-name">Full name</label>
              <input
                id="reg-name"
                type="text"
                className="input"
                placeholder="Alex Chen"
                value={form.name}
                onChange={update("name")}
                required
                autoComplete="name"
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="reg-email">Email address</label>
              <input
                id="reg-email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={update("email")}
                required
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                className="input"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={update("password")}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <button
              id="register-submit"
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "12px 20px", borderRadius: 10 }}
              disabled={loading || googleLoading}
            >
              {loading ? "Creating account…" : "🚀 Create SkillPassport"}
            </button>
          </form>

          {/* Social Divider */}
          <div style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ padding: "0 10px", fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Continue with Google (Firebase) */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
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
            {googleLoading ? "Connecting to Google..." : "Continue with Google"}
          </button>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "var(--text-muted)" }}>
            By registering you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--primary-light)", fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
