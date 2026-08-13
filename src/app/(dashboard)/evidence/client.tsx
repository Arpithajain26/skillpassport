"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const EVIDENCE_TYPES = [
  { value: "project", label: "Project", icon: "🗂️" },
  { value: "github_repository", label: "GitHub Repo", icon: "🐙" },
  { value: "certificate", label: "Certificate", icon: "🏅" },
  { value: "coursework", label: "Coursework", icon: "📚" },
  { value: "internship", label: "Internship", icon: "💼" },
  { value: "hackathon", label: "Hackathon", icon: "⚡" },
  { value: "coding_challenge", label: "Coding Challenge", icon: "💻" },
  { value: "assessment", label: "Assessment", icon: "📝" },
  { value: "work_sample", label: "Work Sample", icon: "📄" },
];

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "var(--amber)" },
  analyzed: { label: "AI Analyzed", color: "var(--emerald)" },
  verified: { label: "Verified", color: "#6366f1" },
};

export function EvidenceClient({ evidence }: { evidence: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showAdd, setShowAdd] = useState(false);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [form, setForm] = useState({
    type: "project",
    title: "",
    description: "",
    url: "",
    technologies: "",
  });

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function addEvidence() {
    if (!form.title.trim()) { setMsg({ type: "error", text: "Title is required" }); return; }

    const res = await fetch("/api/evidence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });

    if (res.ok) {
      setMsg({ type: "success", text: "Evidence added!" });
      setShowAdd(false);
      setForm({ type: "project", title: "", description: "", url: "", technologies: "" });
      startTransition(() => router.refresh());
    } else {
      const d = await res.json();
      setMsg({ type: "error", text: d.error ?? "Failed to add" });
    }
  }

  async function analyzeEvidence(ev: any) {
    setAnalyzing(ev.id);
    setMsg(null);
    try {
      const res = await fetch("/api/ai/analyze-evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evidenceId: ev.id,
          title: ev.title,
          description: ev.description ?? "",
          type: ev.type,
          technologies: ev.technologies ?? [],
          url: ev.url,
        }),
      });
      if (res.ok) {
        const result = await res.json();
        setMsg({ type: "success", text: `AI found ${result.skills?.length ?? 0} skills! Score: ${result.overall_quality}/100` });
        startTransition(() => router.refresh());
      } else {
        setMsg({ type: "error", text: "AI service unavailable. Make sure the AI service is running." });
      }
    } finally {
      setAnalyzing(null);
    }
  }

  async function deleteEvidence(id: string) {
    await fetch(`/api/evidence/${id}`, { method: "DELETE" });
    startTransition(() => router.refresh());
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {msg && (
        <div className={`alert alert-${msg.type}`}>
          {msg.type === "success" ? "✓" : "⚠"} {msg.text}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, flex: 1 }}>Evidence Vault</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(!showAdd)}>+ Add Evidence</button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Add New Evidence</h3>

          {/* Type selector */}
          <div style={{ marginBottom: 16 }}>
            <div className="input-label" style={{ marginBottom: 8 }}>Evidence Type</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8 }}>
              {EVIDENCE_TYPES.map((t) => (
                <button
                  key={t.value}
                  className={`btn btn-sm ${form.type === t.value ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                  style={{ justifyContent: "center", gap: 6 }}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="input-group">
              <label className="input-label">Title *</label>
              <input className="input" placeholder="e.g. E-commerce React App" value={form.title} onChange={update("title")} />
            </div>
            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea
                className="input"
                placeholder="Describe what you built, learned, or accomplished…"
                value={form.description}
                onChange={update("description") as any}
                rows={3}
                style={{ resize: "vertical" }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="input-group">
                <label className="input-label">URL (optional)</label>
                <input className="input" placeholder="https://github.com/…" value={form.url} onChange={update("url")} />
              </div>
              <div className="input-group">
                <label className="input-label">Technologies (comma-separated)</label>
                <input className="input" placeholder="React, TypeScript, Node.js" value={form.technologies} onChange={update("technologies")} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button className="btn btn-primary" onClick={addEvidence}>Add Evidence →</button>
            <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Evidence Grid */}
      {evidence.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No evidence yet</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>
            Add GitHub repos, certificates, projects, internships — anything that proves your skills.
          </p>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add First Evidence</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {evidence.map((ev) => {
            const typeInfo = EVIDENCE_TYPES.find((t) => t.value === ev.type) ?? { icon: "📄", label: ev.type };
            const status = STATUS_BADGE[ev.verificationStatus ?? "pending"] ?? STATUS_BADGE.pending;
            return (
              <div key={ev.id} className="evidence-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 24 }}>{typeInfo.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{ev.title}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{typeInfo.label}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteEvidence(ev.id)}
                    style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 16, padding: 4 }}
                  >×</button>
                </div>

                {ev.description && (
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12, lineHeight: 1.6 }} className="truncate-2">
                    {ev.description}
                  </p>
                )}

                {ev.technologies?.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                    {ev.technologies.slice(0, 5).map((t: string) => (
                      <span key={t} className="badge badge-slate" style={{ fontSize: 10 }}>{t}</span>
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
                      background: `${status.color}20`, color: status.color,
                    }}
                  >
                    {ev.verificationStatus === "analyzed" && ev.aiScore ? `AI Score: ${ev.aiScore}/100` : status.label}
                  </span>

                  {ev.verificationStatus === "pending" && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => analyzeEvidence(ev)}
                      disabled={analyzing === ev.id}
                    >
                      {analyzing === ev.id ? "Analyzing…" : "🤖 AI Analyze"}
                    </button>
                  )}
                  {ev.url && (
                    <a href={ev.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                      🔗 View
                    </a>
                  )}
                </div>

                {ev.aiSummary && (
                  <div style={{ marginTop: 12, padding: 10, background: "rgba(99,102,241,0.08)", borderRadius: 8, border: "1px solid rgba(99,102,241,0.15)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#a5b4fc", marginBottom: 4 }}>AI Summary</div>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{ev.aiSummary}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
