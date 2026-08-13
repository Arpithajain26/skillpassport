"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const LEVELS = ["Beginner", "Elementary", "Intermediate", "Advanced", "Expert"] as const;
const LEVEL_COLOR: Record<string, string> = {
  Expert: "#8b5cf6", Advanced: "#6366f1", Intermediate: "#22d3ee",
  Elementary: "#f59e0b", Beginner: "#64748b",
};
const LEVEL_PCT: Record<string, number> = {
  Expert: 100, Advanced: 80, Intermediate: 60, Elementary: 40, Beginner: 20,
};

export function SkillsClient({ userSkills, catalog }: { userSkills: any[]; catalog: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [customName, setCustomName] = useState("");
  const [level, setLevel] = useState<string>("Intermediate");
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(catalog.map((s) => s.category)))];

  const filteredCatalog = catalog.filter(
    (s) =>
      (filter === "All" || s.category === filter) &&
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  async function addSkill() {
    if (!selectedSkill && !customName.trim()) {
      setMsg({ type: "error", text: "Select a skill or enter a custom name" });
      return;
    }
    setAdding(true);
    try {
      const catalogMatch = catalog.find((c) => c.name === selectedSkill);
      const body = catalogMatch
        ? { skillId: catalogMatch.id, proficiencyLevel: level }
        : { customSkillName: customName.trim(), proficiencyLevel: level };

      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setMsg({ type: "success", text: "Skill added!" });
        setShowAdd(false);
        setSelectedSkill("");
        setCustomName("");
        startTransition(() => router.refresh());
      } else {
        const d = await res.json();
        setMsg({ type: "error", text: d.error ?? "Failed to add skill" });
      }
    } finally {
      setAdding(false);
    }
  }

  async function removeSkill(id: string) {
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
    startTransition(() => router.refresh());
  }

  const grouped = userSkills.reduce((acc: Record<string, typeof userSkills>, s) => {
    const cat = s.skill?.category ?? "Custom";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {msg && (
        <div className={`alert alert-${msg.type}`} style={{ alignItems: "center" }}>
          {msg.type === "success" ? "✓" : "⚠"} {msg.text}
        </div>
      )}

      {/* Header actions */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, flex: 1 }}>Your Skills</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(!showAdd)}>
          + Add Skill
        </button>
      </div>

      {/* Add Skill Panel */}
      {showAdd && (
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Add a Skill</h3>

          {/* Category filter */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {categories.slice(0, 8).map((c) => (
              <button
                key={c}
                className={`btn btn-sm ${filter === c ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <input
            className="input"
            placeholder="Search skills…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: 14 }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8, maxHeight: 220, overflowY: "auto", marginBottom: 16 }}>
            {filteredCatalog.slice(0, 40).map((s) => (
              <button
                key={s.id}
                className={`btn btn-sm ${selectedSkill === s.name ? "btn-primary" : "btn-secondary"}`}
                onClick={() => { setSelectedSkill(s.name); setCustomName(""); }}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Or custom skill name</label>
              <input
                className="input"
                placeholder="e.g. Figma, Jira, …"
                value={customName}
                onChange={(e) => { setCustomName(e.target.value); setSelectedSkill(""); }}
              />
            </div>

            <div className="input-group" style={{ minWidth: 160 }}>
              <label className="input-label">Proficiency Level</label>
              <select className="input" value={level} onChange={(e) => setLevel(e.target.value)}>
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>

            <button className="btn btn-primary" onClick={addSkill} disabled={adding}>
              {adding ? "Adding…" : "Add →"}
            </button>
            <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Skills by category */}
      {Object.keys(grouped).length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No skills yet</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>
            Add skills manually, connect GitHub, or submit evidence for AI extraction.
          </p>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Your First Skill</button>
        </div>
      ) : (
        Object.entries(grouped).map(([category, skills]) => (
          <div key={category}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              {category}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
              {skills.map((s) => {
                const name = s.skill?.name ?? s.customSkillName ?? "Unknown";
                const color = LEVEL_COLOR[s.proficiencyLevel] ?? "#6366f1";
                const pct = LEVEL_PCT[s.proficiencyLevel] ?? 20;
                return (
                  <div key={s.id} className="skill-card" style={{ position: "relative" }}>
                    <button
                      onClick={() => removeSkill(s.id)}
                      style={{
                        position: "absolute", top: 8, right: 8,
                        background: "transparent", border: "none", cursor: "pointer",
                        color: "var(--text-muted)", fontSize: 14, padding: 4,
                        lineHeight: 1,
                      }}
                      title="Remove skill"
                    >
                      ×
                    </button>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{name}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color }}>{s.confidenceScore}%</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <span className="badge" style={{ background: `${color}20`, color, borderColor: `${color}40`, fontSize: 11 }}>
                        {s.proficiencyLevel}
                      </span>
                      {s.evidenceCount > 0 && (
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                          {s.evidenceCount} evidence
                        </span>
                      )}
                    </div>
                    <div className="skill-level-bar">
                      <div
                        className="skill-level-fill"
                        style={{ width: `${s.confidenceScore}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }}
                      />
                    </div>
                    {s.aiExplanation && (
                      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.5 }}>
                        {s.aiExplanation.slice(0, 80)}…
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
