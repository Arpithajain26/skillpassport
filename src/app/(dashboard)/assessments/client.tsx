"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function AssessmentsClient({ userSkills, assessments }: { userSkills: any[]; assessments: any[] }) {
  const router = useRouter();
  const [_, startTransition] = useTransition();
  const [selectedSkill, setSelectedSkill] = useState("");
  const [customSkill, setCustomSkill] = useState("");
  const [generating, setGenerating] = useState(false);
  const [activeAssessment, setActiveAssessment] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const finalSkill = customSkill.trim() || selectedSkill;
  const currentLevel = userSkills.find((s) => (s.skill?.name ?? s.customSkillName) === finalSkill)?.proficiencyLevel ?? "Intermediate";

  async function generateAssessment() {
    if (!finalSkill) { setMsg({ type: "error", text: "Select a skill" }); return; }
    setGenerating(true); setMsg(null);
    try {
      const res = await fetch("/api/assessment/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: finalSkill, currentLevel }),
      });
      const data = await res.json();
      if (res.ok) {
        setActiveAssessment(data);
        setAnswers({});
        setSubmitted(false);
        setResult(null);
      } else {
        setMsg({ type: "error", text: data.error ?? "AI service unavailable" });
      }
    } finally { setGenerating(false); }
  }

  async function submitAssessment() {
    if (!activeAssessment) return;
    const userAnswers = activeAssessment.questions.map((_: any, i: number) => answers[i] ?? -1);
    const res = await fetch("/api/assessment/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assessmentId: activeAssessment.assessmentId,
        userAnswers,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setResult(data);
      setSubmitted(true);
      setMsg({ type: "success", text: `Score: ${data.score}% — Level: ${data.level_achieved}` });
      startTransition(() => router.refresh());
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {msg && <div className={`alert alert-${msg.type}`}>{msg.type === "success" ? "✓" : "⚠"} {msg.text}</div>}

      {/* Skill selector */}
      {!activeAssessment && (
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Take a Skill Assessment</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 16 }}>
            AI generates 5 questions tailored to your current level. Your confidence score updates based on results.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {userSkills.slice(0, 12).map((s) => {
              const name = s.skill?.name ?? s.customSkillName ?? "";
              return (
                <button
                  key={s.id}
                  className={`btn btn-sm ${selectedSkill === name ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => { setSelectedSkill(name); setCustomSkill(""); }}
                >
                  {name}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Or type any skill</label>
              <input className="input" placeholder="e.g. GraphQL, Docker, SQL…" value={customSkill} onChange={(e) => { setCustomSkill(e.target.value); setSelectedSkill(""); }} />
            </div>
            <button className="btn btn-primary" onClick={generateAssessment} disabled={generating || !finalSkill}>
              {generating ? "Generating…" : "🤖 Start Assessment"}
            </button>
          </div>
        </div>
      )}

      {/* Active Assessment */}
      {activeAssessment && !submitted && (
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: 20 }}>{activeAssessment.skill} Assessment</h2>
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Level: {activeAssessment.level} · {activeAssessment.time_limit_minutes} min limit</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setActiveAssessment(null)}>✕ Cancel</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {activeAssessment.questions?.map((q: any, qi: number) => (
              <div key={q.id} style={{ borderLeft: "3px solid rgba(99,102,241,0.4)", paddingLeft: 20 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14, color: "var(--text-primary)", lineHeight: 1.5 }}>
                  Q{qi + 1}. {q.question}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {q.options?.map((opt: string, oi: number) => (
                    <button
                      key={oi}
                      onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                      style={{
                        padding: "12px 16px",
                        borderRadius: 8,
                        border: `1px solid ${answers[qi] === oi ? "#6366f1" : "var(--border)"}`,
                        background: answers[qi] === oi ? "rgba(99,102,241,0.15)" : "var(--bg-surface)",
                        color: answers[qi] === oi ? "var(--primary-light)" : "var(--text-secondary)",
                        textAlign: "left",
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: answers[qi] === oi ? 600 : 400,
                        transition: "all 0.15s",
                      }}
                    >
                      <span style={{ opacity: 0.6, marginRight: 8 }}>{String.fromCharCode(65 + oi)}.</span> {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
            <button
              className="btn btn-primary"
              onClick={submitAssessment}
              disabled={Object.keys(answers).length < (activeAssessment.questions?.length ?? 0)}
            >
              Submit Assessment →
            </button>
            <span style={{ fontSize: 13, color: "var(--text-muted)", alignSelf: "center" }}>
              {Object.keys(answers).length}/{activeAssessment.questions?.length ?? 0} answered
            </span>
          </div>
        </div>
      )}

      {/* Result */}
      {submitted && result && (
        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 20 }}>Assessment Results</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Score", value: `${result.score}%`, color: result.score >= 70 ? "#10b981" : "#f59e0b" },
              { label: "Correct", value: `${result.correct_count}/${result.total_questions}`, color: "#6366f1" },
              { label: "Level Achieved", value: result.level_achieved, color: "#8b5cf6" },
              { label: "New Confidence", value: `${result.new_confidence}%`, color: "#22d3ee" },
            ].map((stat) => (
              <div key={stat.label} className="stat-card">
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>{stat.label}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: 14, background: "rgba(99,102,241,0.08)", borderRadius: 8, border: "1px solid rgba(99,102,241,0.15)", marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#a5b4fc", marginBottom: 6 }}>AI Feedback</div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{result.feedback}</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary" onClick={() => { setActiveAssessment(null); setSubmitted(false); setResult(null); }}>
              Take Another Assessment
            </button>
          </div>
        </div>
      )}

      {/* Past Assessments */}
      {assessments.length > 0 && (
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Past Assessments</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Level</th>
                  <th>Score</th>
                  <th>Confidence</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((a) => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{a.skill}</td>
                    <td>{a.levelAchieved ?? a.level}</td>
                    <td>{a.score != null ? `${a.score}%` : "—"}</td>
                    <td style={{ color: "#22d3ee" }}>{a.newConfidence != null ? `${a.newConfidence}%` : "—"}</td>
                    <td style={{ fontSize: 12 }}>
                      {a.completedAt ? new Date(a.completedAt).toLocaleDateString() : new Date(a.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
