"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function GitHubClient({ githubUsername, repos }: { githubUsername: string | null; repos: any[] }) {
  const router = useRouter();
  const [_, startTransition] = useTransition();
  const [username, setUsername] = useState(githubUsername ?? "");
  const [connecting, setConnecting] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function connectGitHub() {
    if (!username.trim()) return;
    setConnecting(true); setMsg(null);
    try {
      const res = await fetch("/api/github/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: `Connected! Imported ${data.repoCount} repositories.` });
        startTransition(() => router.refresh());
      } else {
        setMsg({ type: "error", text: data.error ?? "Failed to connect" });
      }
    } finally { setConnecting(false); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {msg && <div className={`alert alert-${msg.type}`}>{msg.type === "success" ? "✓" : "⚠"} {msg.text}</div>}

      {/* Connect */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ fontSize: 48 }}>🐙</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Connect GitHub</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
              Enter your public GitHub username. We&apos;ll import your public repositories and
              automatically extract skills from your languages, topics, and README descriptions.
              <br />
              <span style={{ color: "var(--text-muted)", fontSize: 12 }}>No OAuth needed — works with any public profile.</span>
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <input
                className="input"
                placeholder="e.g. torvalds"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && connectGitHub()}
                style={{ maxWidth: 260 }}
              />
              <button className="btn btn-primary" onClick={connectGitHub} disabled={connecting || !username.trim()}>
                {connecting ? "Connecting…" : githubUsername ? "🔄 Re-sync" : "🔗 Connect"}
              </button>
            </div>
            {githubUsername && (
              <div style={{ marginTop: 10, fontSize: 13, color: "var(--emerald)" }}>
                ✓ Connected to github.com/{githubUsername}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Repos grid */}
      {repos.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            {repos.length} Public Repositories
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
            {repos.map((repo) => {
              const skills = (repo.extractedSkills as any[]) ?? [];
              return (
                <div key={repo.id} className="card" style={{ padding: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontWeight: 700, fontSize: 14, color: "var(--primary-light)", textDecoration: "none" }}
                    >
                      {repo.name}
                    </a>
                    <div style={{ display: "flex", gap: 10, fontSize: 12, color: "var(--text-muted)" }}>
                      {repo.stars > 0 && <span>⭐ {repo.stars}</span>}
                      {repo.forks > 0 && <span>🍴 {repo.forks}</span>}
                    </div>
                  </div>

                  {repo.description && (
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 10, lineHeight: 1.5 }} className="truncate-2">
                      {repo.description}
                    </p>
                  )}

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {repo.language && (
                      <span className="badge badge-violet" style={{ fontSize: 10 }}>{repo.language}</span>
                    )}
                    {repo.topics?.slice(0, 3).map((t: string) => (
                      <span key={t} className="badge badge-slate" style={{ fontSize: 10 }}>{t}</span>
                    ))}
                  </div>

                  {skills.length > 0 && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, marginBottom: 6 }}>EXTRACTED SKILLS</div>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {skills.slice(0, 5).map((s: any) => (
                          <span key={s.name} className="badge badge-cyan" style={{ fontSize: 10 }}>{s.name}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {repo.pushedAt && (
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
                      Updated {new Date(repo.pushedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {repos.length === 0 && githubUsername && (
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <p style={{ color: "var(--text-secondary)" }}>No public repositories found for <strong>{githubUsername}</strong></p>
        </div>
      )}
    </div>
  );
}
