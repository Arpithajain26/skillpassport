"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts";

const LEVEL_COLOR: Record<string, string> = {
  Expert: "#8b5cf6", Advanced: "#6366f1", Intermediate: "#22d3ee",
  Elementary: "#f59e0b", Beginner: "#64748b",
};

export function PassportView({ user }: { user: any }) {
  const [animated, setAnimated] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => { const t = setTimeout(() => setAnimated(true), 300); return () => clearTimeout(t); }, []);

  const skills = user.skills ?? [];
  const evidenceCount = user.evidence?.length ?? 0;
  const careerGoal = user.careerGoals?.[0];
  const passportScore = skills.length > 0
    ? Math.round(skills.reduce((sum: number, s: any) => sum + s.confidenceScore, 0) / skills.length)
    : 0;

  const radarData = skills.slice(0, 7).map((s: any) => ({
    skill: (s.skill?.name ?? s.customSkillName ?? "").slice(0, 10),
    score: s.confidenceScore,
    fullMark: 100,
  }));

  const evidenceTypes = user.evidence?.reduce((acc: Record<string, number>, e: any) => {
    acc[e.type] = (acc[e.type] ?? 0) + 1;
    return acc;
  }, {}) ?? {};

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const initials = user.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(7,7,15,0.9)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
        height: 60, display: "flex", alignItems: "center", padding: "0 32px",
        justifyContent: "space-between",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div className="sidebar-logo-icon" style={{ width: 28, height: 28 }}>🎓</div>
          <span style={{ fontWeight: 800, fontSize: 15 }}>SkillPassport</span>
        </Link>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={copyLink}>
            {copied ? "✓ Copied!" : "🔗 Share"}
          </button>
          <Link href="/login" className="btn btn-primary btn-sm">Get Your Passport</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
        {/* Passport Card */}
        <div className="passport-card" style={{ marginBottom: 32 }}>
          <div className="passport-header">
            <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
              {/* Avatar */}
              <div style={{
                width: 80, height: 80, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 30, fontWeight: 700, border: "3px solid rgba(255,255,255,0.1)",
              }}>
                {user.image ? <img src={user.image} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%" }} /> : initials}
              </div>

              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>{user.name}</h1>
                {user.headline && <p style={{ color: "var(--text-secondary)", fontSize: 15, marginBottom: 8 }}>{user.headline}</p>}
                {user.location && (
                  <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 10 }}>📍 {user.location}</p>
                )}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span className="badge badge-emerald">✓ AI-Verified Profile</span>
                  {careerGoal && <span className="badge badge-indigo">🎯 {careerGoal.targetRole}</span>}
                  {evidenceCount > 0 && <span className="badge badge-cyan">{evidenceCount} Evidence Items</span>}
                  {skills.length > 0 && <span className="badge badge-violet">{skills.length} Skills Verified</span>}
                </div>
              </div>

              {/* Passport Score */}
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{
                  width: 88, height: 88, borderRadius: "50%",
                  border: "3px solid rgba(99,102,241,0.4)",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  background: "rgba(99,102,241,0.1)",
                }}>
                  <div style={{
                    fontSize: 28, fontWeight: 900,
                    background: "linear-gradient(135deg, #6366f1, #22d3ee)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  }}>
                    {passportScore}
                  </div>
                  <div style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.08em" }}>SCORE</div>
                </div>
                {careerGoal?.matchPercentage && (
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
                    {careerGoal.matchPercentage}% match
                  </div>
                )}
              </div>
            </div>

            {/* AI Summary */}
            {user.aiSummary && (
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, fontStyle: "italic" }}>
                  "{user.aiSummary.summary}"
                </p>
              </div>
            )}
          </div>

          {/* Skills Grid */}
          {skills.length > 0 && (
            <div style={{ padding: "24px 32px" }}>
              <h2 style={{ fontWeight: 700, marginBottom: 16, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", fontSize: 12 }}>
                Verified Skills
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                {skills.map((s: any) => {
                  const name = s.skill?.name ?? s.customSkillName ?? "";
                  const color = LEVEL_COLOR[s.proficiencyLevel] ?? "#6366f1";
                  return (
                    <div key={s.id} style={{
                      padding: "14px 16px",
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{name}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color }}>{s.confidenceScore}%</span>
                      </div>
                      <span style={{ fontSize: 11, background: `${color}20`, color, padding: "1px 7px", borderRadius: 99, border: `1px solid ${color}40` }}>
                        {s.proficiencyLevel}
                      </span>
                      <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 99, marginTop: 8, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: 99,
                          width: animated ? `${s.confidenceScore}%` : "0%",
                          background: `linear-gradient(90deg, ${color}, ${color}88)`,
                          transition: "width 1.2s cubic-bezier(0.34,1.56,0.64,1)",
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Charts + Projects row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 24 }}>
          {/* Radar */}
          {radarData.length >= 3 && (
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Skill Radar</h2>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "#9394a5", fontSize: 10 }} />
                  <Radar name="Confidence" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Evidence breakdown */}
          {Object.keys(evidenceTypes).length > 0 && (
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Evidence Portfolio</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {Object.entries(evidenceTypes).map(([type, count]) => (
                  <div key={type} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)", flex: 1, textTransform: "capitalize" }}>
                      {type.replace(/_/g, " ")}
                    </span>
                    <span style={{ fontWeight: 700, color: "#6366f1" }}>{String(count)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Projects */}
        {user.projects?.length > 0 && (
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Featured Projects</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
              {user.projects.map((p: any) => (
                <div key={p.id} style={{ padding: 16, background: "var(--bg-surface)", borderRadius: 10, border: "1px solid var(--border)" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{p.title}</div>
                  {p.description && <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, lineHeight: 1.5 }} className="truncate-2">{p.description}</p>}
                  {p.technologies?.length > 0 && (
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {p.technologies.slice(0, 4).map((t: string) => <span key={t} className="badge badge-slate" style={{ fontSize: 10 }}>{t}</span>)}
                    </div>
                  )}
                  {(p.githubUrl || p.liveUrl) && (
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>🐙 Code</a>}
                      {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ fontSize: 11 }}>🔗 Live</a>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificates */}
        {user.certificates?.length > 0 && (
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Certifications</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {user.certificates.map((c: any) => (
                <div key={c.id} style={{ display: "flex", gap: 14, alignItems: "center", padding: 12, background: "var(--bg-surface)", borderRadius: 8, border: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 24 }}>🏅</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{c.issuer} {c.issueDate && `· ${new Date(c.issueDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`}</div>
                  </div>
                  {c.credentialUrl && (
                    <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>Verify ↗</a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="card" style={{ padding: 32, textAlign: "center", background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))" }}>
          <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Create your own SkillPassport</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>
            Join thousands of professionals building AI-verified skill identities.
          </p>
          <Link href="/register" className="btn btn-primary">🚀 Get Started Free</Link>
        </div>
      </div>
    </div>
  );
}
