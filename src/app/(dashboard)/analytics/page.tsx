import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { BarChart4, Zap, ShieldCheck, TrendingUp, Sparkles } from "lucide-react";

export const metadata = { title: "Analytics Matrix" };

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div>
      <DashboardHeader
        title="Skill Analytics & Proficiency Matrix"
        subtitle="Real-time multi-dimensional radar breakdown across engineering domains"
      />
      <main className="dashboard-content" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div className="card" style={{ padding: 28, background: "rgba(15, 23, 42, 0.75)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <BarChart4 size={24} color="#38bdf8" />
            <h2 className="section-title" style={{ margin: 0 }}>Engineering Category Breakdown</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {[
              { category: "Frontend Engineering", level: "Advanced", score: 92, color: "#38bdf8" },
              { category: "Backend Architecture", level: "Advanced", score: 88, color: "#818cf8" },
              { category: "Cloud & DevOps", level: "Intermediate", score: 74, color: "#34d399" },
              { category: "Database & Storage", level: "Advanced", score: 85, color: "#fbbf24" },
              { category: "AI & Machine Learning", level: "Intermediate", score: 78, color: "#a855f7" },
            ].map((cat) => (
              <div key={cat.category} style={{ padding: 20, background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>{cat.category}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: cat.color, marginBottom: 8 }}>{cat.score}%</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>Level: {cat.level}</div>
                <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99, marginTop: 12, overflow: "hidden" }}>
                  <div style={{ width: `${cat.score}%`, height: "100%", background: cat.color, borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h2 className="section-title" style={{ marginBottom: 12 }}>Verification Velocity</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>
            Your Skill Passport confidence score has increased by <strong style={{ color: "#34d399" }}>+18%</strong> over the past 30 days based on code repository scanning and assessment performance.
          </p>
        </div>
      </main>
    </div>
  );
}
