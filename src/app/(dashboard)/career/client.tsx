"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Search, Star, Award, CheckCircle2, AlertTriangle, ArrowRight, BookOpen } from "lucide-react";

const ROLES = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Data Scientist",
  "ML Engineer",
  "DevOps Engineer",
  "Mobile Developer",
  "Cloud Architect",
];

const PRIORITY_COLOR: Record<string, string> = {
  Critical: "#f43f5e",
  High: "#f59e0b",
  Medium: "#6366f1",
  Low: "#64748b",
};

export function CareerClient({
  careerGoals,
  userSkills,
  skillGaps,
}: {
  careerGoals: any[];
  userSkills: any[];
  skillGaps: any[];
}) {
  const router = useRouter();
  const [_, startTransition] = useTransition();
  const [targetRole, setTargetRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const finalRole = customRole.trim() || targetRole;

  async function analyzeGap() {
    if (!finalRole) {
      setMsg({ type: "error", text: "Select or enter a target role first" });
      return;
    }
    setLoading("gap");
    setMsg(null);
    try {
      const res = await fetch("/api/ai/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole: finalRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setResults({ type: "gap", data });
        setMsg({ type: "success", text: `Skill gap analysis complete! Found ${data.gaps?.length ?? 0} skill gaps.` });
        startTransition(() => router.refresh());
      } else {
        setMsg({ type: "error", text: data.error ?? "AI service unavailable" });
      }
    } catch (e: any) {
      setMsg({ type: "error", text: "Failed to connect to AI skill gap service." });
    } finally {
      setLoading(null);
    }
  }

  async function matchCareer() {
    if (!finalRole) {
      setMsg({ type: "error", text: "Select or enter a target role first" });
      return;
    }
    setLoading("match");
    setMsg(null);
    try {
      const res = await fetch("/api/ai/career-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole: finalRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setResults({ type: "match", data });
        startTransition(() => router.refresh());
      } else {
        setMsg({ type: "error", text: data.error ?? "AI service unavailable" });
      }
    } catch (e: any) {
      setMsg({ type: "error", text: "Failed to connect to AI career match service." });
    } finally {
      setLoading(null);
    }
  }

  async function setGoal() {
    if (!finalRole) {
      setMsg({ type: "error", text: "Select or enter a target role first" });
      return;
    }
    const res = await fetch("/api/ai/career-match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetRole: finalRole }),
    });
    if (res.ok) {
      setMsg({ type: "success", text: `Career goal updated: ${finalRole}` });
      startTransition(() => router.refresh());
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Alert Notifications */}
      <AnimatePresence>
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`alert alert-${msg.type}`}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            {msg.type === "success" ? <CheckCircle2 size={18} color="#10b981" /> : <AlertTriangle size={18} color="#f43f5e" />}
            <span>{msg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Target Role Selector Header */}
      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Target size={22} color="#818cf8" />
          </div>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: 20, margin: 0 }}>Target Career Role</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: "2px 0 0" }}>
              Select or type your desired target role to trigger real-time AI skill gap analysis & match score.
            </p>
          </div>
        </div>

        {/* Quick Role Badges */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {ROLES.map((r) => {
            const isSelected = targetRole === r;
            return (
              <button
                key={r}
                onClick={() => {
                  setTargetRole(r);
                  setCustomRole("");
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  border: isSelected ? "1px solid #6366f1" : "1px solid rgba(255,255,255,0.08)",
                  background: isSelected ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.04)",
                  color: isSelected ? "#ffffff" : "#9394a5",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {r}
              </button>
            );
          })}
        </div>

        {/* Custom Input */}
        <input
          className="input"
          placeholder="Or type a custom role (e.g. Lead AI Product Engineer)…"
          value={customRole}
          onChange={(e) => {
            setCustomRole(e.target.value);
            setTargetRole("");
          }}
          style={{ marginBottom: 20, width: "100%" }}
        />

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            className="btn btn-primary"
            onClick={analyzeGap}
            disabled={!!loading || !finalRole}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px" }}
          >
            <Search size={18} />
            {loading === "gap" ? "Analyzing Skill Gaps…" : "🔍 Analyze Skill Gaps"}
          </button>

          <button
            className="btn btn-secondary"
            onClick={matchCareer}
            disabled={!!loading || !finalRole}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px" }}
          >
            <Target size={18} />
            {loading === "match" ? "Matching Career…" : "🎯 Match Career Score"}
          </button>

          <button
            className="btn btn-ghost"
            onClick={setGoal}
            disabled={!!loading || !finalRole}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px" }}
          >
            <Star size={18} color="#f59e0b" />
            Set as Active Career Goal
          </button>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {results?.type === "gap" && (
          <motion.div
            key="gap-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="card"
            style={{ padding: 28 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <span className="badge badge-indigo" style={{ marginBottom: 8, display: "inline-flex" }}>
                  AI SKILL GAP ANALYSIS REPORT
                </span>
                <h2 style={{ fontWeight: 800, fontSize: 22, margin: 0 }}>Required Skills & Gaps for {finalRole}</h2>
              </div>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#6366f1" }}>
                {results.data.match_percentage}% Match
              </span>
            </div>

            <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
              {results.data.analysis_summary}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {results.data.gaps?.map((gap: any, idx: number) => {
                const priorityColor = PRIORITY_COLOR[gap.priority] || "#6366f1";
                return (
                  <motion.div
                    key={gap.skill}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="card"
                    style={{
                      padding: 20,
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontWeight: 700, fontSize: 16 }}>{gap.skill}</span>
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          padding: "3px 12px",
                          borderRadius: 99,
                          background: `${priorityColor}20`,
                          color: priorityColor,
                          border: `1px solid ${priorityColor}40`,
                        }}
                      >
                        {gap.priority} Priority
                      </span>
                    </div>

                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 10, display: "flex", gap: 16 }}>
                      <span>Current Level: <strong style={{ color: "#f0f0ff" }}>{gap.current_level || "Not yet demonstrated"}</strong></span>
                      <span>Target Requirement: <strong style={{ color: "#818cf8" }}>{gap.required_level}</strong></span>
                    </div>

                    <div className="progress-track" style={{ height: 8, borderRadius: 99, overflow: "hidden", marginBottom: 12 }}>
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${100 - gap.gap_score}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg, #6366f1, ${priorityColor})` }}
                      />
                    </div>

                    {gap.resources?.length > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                        <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                          <BookOpen size={13} /> Recommended:
                        </span>
                        {gap.resources.map((res: string) => (
                          <span key={res} className="badge badge-slate" style={{ fontSize: 11 }}>
                            {res}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {results?.type === "match" && (
          <motion.div
            key="match-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="card"
            style={{ padding: 28 }}
          >
            <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 20 }}>Career Alignment: {finalRole}</h2>
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 900,
                  lineHeight: 1,
                  background: "linear-gradient(135deg, #6366f1, #22d3ee)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {results.data.match_percentage}%
              </div>
              <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8, fontWeight: 600 }}>Overall Match Score</div>
            </div>

            <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
              {results.data.assessment}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {results.data.matching_skills?.length > 0 && (
                <div style={{ background: "rgba(16,185,129,0.06)", padding: 20, borderRadius: 14, border: "1px solid rgba(16,185,129,0.2)" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#10b981", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <CheckCircle2 size={16} /> Matching Verified Skills
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {results.data.matching_skills.map((s: string) => (
                      <span key={s} className="badge badge-emerald">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {results.data.missing_skills?.length > 0 && (
                <div style={{ background: "rgba(244,63,94,0.06)", padding: 20, borderRadius: 14, border: "1px solid rgba(244,63,94,0.2)" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#f43f5e", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <AlertTriangle size={16} /> Missing / Target Skills
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {results.data.missing_skills.map((s: string) => (
                      <span key={s} className="badge badge-rose">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {results.data.next_steps?.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Recommended Next Action Items</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {results.data.next_steps.map((step: string, i: number) => (
                    <div key={i} style={{ fontSize: 14, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(99,102,241,0.2)", color: "#818cf8", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Existing Career Goals */}
      {careerGoals.length > 0 && (
        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>Your Active Career Goals</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {careerGoals.map((goal) => (
              <div key={goal.id} className="stat-card" style={{ padding: 20, borderRadius: 14 }}>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{goal.targetRole}</div>
                {goal.targetIndustry && <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>{goal.targetIndustry}</div>}
                {goal.matchPercentage !== null ? (
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#6366f1" }}>{goal.matchPercentage}% Match</div>
                ) : (
                  <span className="badge badge-amber">Awaiting AI Match</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
