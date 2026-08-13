"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STEPS = [
  { id: 1, title: "About You", icon: "👤", desc: "Tell us about yourself" },
  { id: 2, title: "Your Skills", icon: "⚡", desc: "What are you good at?" },
  { id: 3, title: "Career Goal", icon: "🎯", desc: "Where do you want to go?" },
];

const COMMON_SKILLS = [
  "Python", "JavaScript", "TypeScript", "React", "Node.js", "SQL", "Java", "Go",
  "Machine Learning", "Docker", "AWS", "Git", "CSS", "HTML", "Vue.js", "Next.js",
  "FastAPI", "Django", "PostgreSQL", "MongoDB",
];

const ROLES = ["Full Stack Developer", "Frontend Developer", "Backend Developer", "Data Scientist", "ML Engineer", "DevOps Engineer", "Mobile Developer"];
const STATUSES = ["Student", "Recent Graduate", "Employed", "Freelancer", "Career Switcher", "Job Seeker"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    bio: "",
    location: "",
    currentStatus: "Student",
    skills: [] as string[],
    customSkills: "",
    targetRole: "",
    customRole: "",
    targetIndustry: "",
  });

  const toggleSkill = (skill: string) => {
    setForm((f) => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter((s) => s !== skill)
        : [...f.skills, skill],
    }));
  };

  async function finish() {
    setLoading(true); setError("");
    try {
      const allSkills = [
        ...form.skills,
        ...form.customSkills.split(",").map((s) => s.trim()).filter(Boolean),
      ];
      const finalRole = form.customRole.trim() || form.targetRole;

      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: {
            bio: form.bio,
            location: form.location,
            currentStatus: form.currentStatus,
          },
          skills: allSkills,
          careerGoal: finalRole ? { targetRole: finalRole, targetIndustry: form.targetIndustry } : null,
          isComplete: true,
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const d = await res.json();
        setError(d.error ?? "Failed to save");
      }
    } finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 30%, rgba(99,102,241,0.1) 0%, transparent 60%)" }} />

      <div style={{ width: "100%", maxWidth: 560, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div className="sidebar-logo-icon">🎓</div>
            <span style={{ fontWeight: 800, fontSize: 20 }}>Skill<span style={{ color: "#818cf8" }}>Passport</span></span>
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 28, marginBottom: 6 }}>
            Let&apos;s build your passport
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>3 quick steps to get started</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, justifyContent: "center" }}>
          {STEPS.map((s) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: s.id === step ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : s.id < step ? "#10b981" : "var(--bg-card)",
                border: `1px solid ${s.id === step ? "transparent" : s.id < step ? "#10b981" : "var(--border)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: s.id < step ? 14 : 12,
                fontWeight: 700, color: "white", cursor: "pointer",
                transition: "all 0.3s",
              }}
                onClick={() => s.id < step && setStep(s.id)}
              >
                {s.id < step ? "✓" : s.id}
              </div>
              <span style={{ fontSize: 13, color: s.id === step ? "var(--text-primary)" : "var(--text-muted)", fontWeight: s.id === step ? 600 : 400 }}>
                {s.title}
              </span>
              {s.id < STEPS.length && (
                <div style={{ width: 24, height: 1, background: s.id < step ? "#10b981" : "var(--border)", margin: "0 4px" }} />
              )}
            </div>
          ))}
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>⚠ {error}</div>}

        {/* Step 1 — About */}
        {step === 1 && (
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 28 }}>👤</div>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: 18 }}>About You</h2>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Help employers understand who you are</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="input-group">
                <label className="input-label">Current Status</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      className={`btn btn-sm ${form.currentStatus === s ? "btn-primary" : "btn-secondary"}`}
                      onClick={() => setForm((f) => ({ ...f, currentStatus: s }))}
                    >{s}</button>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="ob-bio">Short bio</label>
                <textarea
                  id="ob-bio"
                  className="input"
                  placeholder="I&apos;m a CS student passionate about building scalable web applications…"
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  rows={3}
                  style={{ resize: "vertical" }}
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="ob-location">Location</label>
                <input
                  id="ob-location"
                  className="input"
                  placeholder="San Francisco, CA"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
              <button className="btn btn-primary" onClick={() => setStep(2)}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 2 — Skills */}
        {step === 2 && (
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 28 }}>⚡</div>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: 18 }}>Your Skills</h2>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Select skills you know (we&apos;ll verify later with AI)</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8, marginBottom: 16 }}>
              {COMMON_SKILLS.map((s) => (
                <button
                  key={s}
                  className={`btn btn-sm ${form.skills.includes(s) ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => toggleSkill(s)}
                  style={{ justifyContent: "center" }}
                >
                  {form.skills.includes(s) && "✓ "}{s}
                </button>
              ))}
            </div>

            <div className="input-group" style={{ marginBottom: 16 }}>
              <label className="input-label">Other skills (comma-separated)</label>
              <input
                className="input"
                placeholder="Figma, Jira, Kubernetes…"
                value={form.customSkills}
                onChange={(e) => setForm((f) => ({ ...f, customSkills: e.target.value }))}
              />
            </div>

            {form.skills.length > 0 && (
              <p style={{ fontSize: 13, color: "var(--primary-light)", marginBottom: 16 }}>
                ✓ {form.skills.length} skills selected
              </p>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 3 — Career Goal */}
        {step === 3 && (
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 28 }}>🎯</div>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: 18 }}>Career Goal</h2>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>What role are you targeting? (optional)</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              {ROLES.map((r) => (
                <button
                  key={r}
                  className={`btn btn-sm ${form.targetRole === r ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setForm((f) => ({ ...f, targetRole: r, customRole: "" }))}
                >{r}</button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="input-group">
                <label className="input-label">Or custom role</label>
                <input className="input" placeholder="e.g. iOS Developer, Product Manager" value={form.customRole} onChange={(e) => setForm((f) => ({ ...f, customRole: e.target.value, targetRole: "" }))} />
              </div>
              <div className="input-group">
                <label className="input-label">Industry (optional)</label>
                <input className="input" placeholder="e.g. FinTech, HealthTech, SaaS" value={form.targetIndustry} onChange={(e) => setForm((f) => ({ ...f, targetIndustry: e.target.value }))} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "space-between", marginTop: 24 }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn-primary" onClick={finish} disabled={loading}>
                {loading ? "Setting up…" : "🚀 Launch My Passport"}
              </button>
            </div>
          </div>
        )}

        <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "var(--text-muted)" }}>
          You can update all of this later in your profile.
        </p>
      </div>
    </div>
  );
}
