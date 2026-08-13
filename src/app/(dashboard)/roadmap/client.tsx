"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ROLES = ["Full Stack Developer", "Frontend Developer", "Backend Developer", "Data Scientist", "ML Engineer", "DevOps Engineer"];

export function RoadmapClient({ roadmaps, careerGoals, skillGaps }: {
  roadmaps: any[]; careerGoals: any[]; skillGaps: any[];
}) {
  const router = useRouter();
  const [targetRole, setTargetRole] = useState(careerGoals[0]?.targetRole ?? "");
  const [customRole, setCustomRole] = useState("");
  const [durationWeeks, setDurationWeeks] = useState(12);
  const [loading, setLoading] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState<any>(null);
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(roadmaps[0]);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const finalRole = customRole.trim() || targetRole;

  async function generateRoadmap() {
    if (!finalRole) { setMsg({ type: "error", text: "Select a target role first" }); return; }
    setLoading(true); setMsg(null);
    try {
      const res = await fetch("/api/ai/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole: finalRole, durationWeeks }),
      });
      const data = await res.json();
      if (res.ok) {
        setGeneratedRoadmap(data);
        setMsg({ type: "success", text: "Roadmap generated!" });
        router.refresh();
      } else {
        setMsg({ type: "error", text: data.error ?? "AI service unavailable" });
      }
    } finally { setLoading(false); }
  }

  const displayRoadmap = generatedRoadmap ?? (selectedRoadmap ? { ...selectedRoadmap, weeks: selectedRoadmap.steps } : null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {msg && <div className={`alert alert-${msg.type}`}>{msg.type === "success" ? "✓" : "⚠"} {msg.text}</div>}

      {/* Generator */}
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Generate AI Learning Roadmap</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {ROLES.map((r) => (
            <button key={r} className={`btn btn-sm ${targetRole === r ? "btn-primary" : "btn-secondary"}`} onClick={() => { setTargetRole(r); setCustomRole(""); }}>{r}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div className="input-group" style={{ flex: 1 }}>
            <label className="input-label">Or custom role</label>
            <input className="input" placeholder="e.g. iOS Developer" value={customRole} onChange={(e) => { setCustomRole(e.target.value); setTargetRole(""); }} />
          </div>
          <div className="input-group" style={{ minWidth: 120 }}>
            <label className="input-label">Duration (weeks)</label>
            <select className="input" value={durationWeeks} onChange={(e) => setDurationWeeks(Number(e.target.value))}>
              {[4, 8, 12, 16, 24].map((w) => <option key={w} value={w}>{w} weeks</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={generateRoadmap} disabled={loading || !finalRole}>
            {loading ? "Generating…" : "🗺️ Generate Roadmap"}
          </button>
        </div>
      </div>

      {/* Saved roadmaps selector */}
      {roadmaps.length > 0 && !generatedRoadmap && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {roadmaps.map((r) => (
            <button
              key={r.id}
              className={`btn btn-sm ${selectedRoadmap?.id === r.id ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setSelectedRoadmap(r)}
            >
              {r.title}
            </button>
          ))}
        </div>
      )}

      {/* Roadmap Display */}
      {displayRoadmap ? (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 6 }}>{displayRoadmap.title}</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>{displayRoadmap.overview}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              <span className="badge badge-indigo">⏱ {displayRoadmap.total_duration_weeks ?? displayRoadmap.totalDurationWeeks} weeks</span>
              {displayRoadmap.weeks?.length > 0 && <span className="badge badge-cyan">{displayRoadmap.weeks.length} modules</span>}
            </div>
          </div>

          {/* Milestones */}
          {displayRoadmap.milestones?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: "var(--text-muted)" }}>🏆 KEY MILESTONES</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {displayRoadmap.milestones.map((m: string, i: number) => (
                  <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                    <span style={{ color: "#6366f1", fontWeight: 700, flexShrink: 0 }}>→</span> {m}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weekly modules */}
          {displayRoadmap.weeks?.map((week: any) => (
            <div key={week.week} style={{ marginBottom: 16, borderLeft: "2px solid rgba(99,102,241,0.3)", paddingLeft: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, color: "white", flexShrink: 0,
                }}>
                  {week.week}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 14 }}>{week.title}</h3>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8, lineHeight: 1.6 }}>{week.description}</p>
              {week.skills_targeted?.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                  {week.skills_targeted.map((s: string) => <span key={s} className="badge badge-indigo" style={{ fontSize: 10 }}>{s}</span>)}
                </div>
              )}
              {week.tasks?.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {week.tasks.map((t: string, i: number) => (
                    <div key={i} style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", gap: 8 }}>
                      <span style={{ color: "#22d3ee" }}>•</span> {t}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No roadmap yet</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>
            First run a <a href="/career" style={{ color: "var(--primary-light)" }}>career gap analysis</a>, then generate your personalized roadmap above.
          </p>
        </div>
      )}
    </div>
  );
}
