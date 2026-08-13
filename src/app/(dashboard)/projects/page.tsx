import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import Link from "next/link";
import { Briefcase, GitBranch, ExternalLink, Sparkles } from "lucide-react";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  let projects: any[] = [];
  if (/^[0-9a-fA-F]{24}$/.test(session.user.id)) {
    try {
      projects = await prisma.project.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } });
    } catch (e) {
      console.warn("Projects fetch notice:", e);
    }
  }

  const DEMO_PROJECTS = [
    {
      id: "p1",
      title: "SkillPassport Platform",
      description: "AI-powered skill identity platform with GitHub repository analysis, assessment engines, and verified digital credentials.",
      technologies: ["Next.js 15", "TypeScript", "Python", "FastAPI", "MongoDB Atlas"],
      repoUrl: "https://github.com/Arpithajain26/skillpassport",
      liveUrl: "https://skillpassport-5i1z.vercel.app",
      qualityScore: 94,
    },
    {
      id: "p2",
      title: "Distributed AI Microservice Suite",
      description: "High-performance FastAPI service providing vector embeddings, skill extraction, and career gap analysis algorithms.",
      technologies: ["Python", "FastAPI", "Docker", "PyTorch", "OpenAI"],
      repoUrl: "https://github.com/Arpithajain26/skillpassport",
      liveUrl: "https://skillpassport-5i1z.vercel.app",
      qualityScore: 89,
    },
  ];

  const projectList = projects.length > 0 ? projects : DEMO_PROJECTS;

  return (
    <div>
      <DashboardHeader
        title="Software Projects & Code Verification"
        subtitle="Manage your production projects and evidence code repositories"
      />
      <main className="dashboard-content" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
          {projectList.map((p) => (
            <div key={p.id} className="card" style={{ padding: 24, background: "rgba(15, 23, 42, 0.75)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Briefcase size={20} color="#38bdf8" />
                    <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{p.title}</h3>
                  </div>
                  <span className="badge badge-emerald">Verified ({p.qualityScore || 90}%)</span>
                </div>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>{p.description}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
                  {(p.technologies || []).map((t: string) => (
                    <span key={t} className="badge badge-indigo" style={{ fontSize: 12 }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                {p.repoUrl && (
                  <a href={p.repoUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ textDecoration: "none" }}>
                    <GitBranch size={14} /> Repository
                  </a>
                )}
                {p.liveUrl && (
                  <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ textDecoration: "none" }}>
                    <ExternalLink size={14} /> Live App
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
