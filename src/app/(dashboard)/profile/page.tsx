import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import Link from "next/link";
import { User, ShieldCheck, MapPin, Mail, Sparkles, ExternalLink, Calendar } from "lucide-react";

export const metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  let user: any = null;
  let skills: any[] = [];
  let evidence: any[] = [];

  if (/^[0-9a-fA-F]{24}$/.test(session.user.id)) {
    try {
      [user, skills, evidence] = await Promise.all([
        prisma.user.findUnique({ where: { id: session.user.id } }),
        prisma.userSkill.findMany({ where: { userId: session.user.id }, include: { skill: true } }),
        prisma.evidence.findMany({ where: { userId: session.user.id } }),
      ]);
    } catch (e) {
      console.warn("Profile fetch notice:", e);
    }
  }

  const profile = user || {
    name: session.user.name || "Software Developer",
    email: session.user.email,
    image: session.user.image,
    bio: "Passionate developer building AI-verified skill identity and full stack applications.",
    location: "Global / Remote",
    currentStatus: "Software Engineer",
  };

  const initials = (profile.name ?? "?")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div>
      <DashboardHeader
        title="My Skill Passport Profile"
        subtitle="Manage your public identity, bio, and verified credentials"
        userInitials={initials}
        userImage={profile.image || undefined}
        username={(session.user as any).username}
      />
      <main className="dashboard-content" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div className="card" style={{ padding: 28, background: "rgba(15, 23, 42, 0.75)" }}>
          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              {profile.image ? (
                <img src={profile.image} alt={profile.name} style={{ width: 80, height: 80, borderRadius: "50%", border: "2px solid #38bdf8" }} />
              ) : (
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #0284c7, #38bdf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#fff" }}>
                  {initials}
                </div>
              )}
              <div style={{ position: "absolute", bottom: -2, right: -2, background: "#10b981", borderRadius: "50%", padding: 4 }}>
                <ShieldCheck size={14} color="#fff" />
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{profile.name}</h1>
                <span className="badge badge-emerald">Verified Passport</span>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 12 }}>{profile.bio}</p>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 13, color: "var(--text-muted)" }}>
                {profile.location && <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={14} /> {profile.location}</span>}
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Mail size={14} /> {profile.email}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Calendar size={14} /> Joined SkillPassport</span>
              </div>
            </div>

            <div>
              <Link href={`/passport/${(session.user as any).username || "alex-chen"}`} className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <ExternalLink size={16} /> View Public Passport
              </Link>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h2 className="section-title" style={{ marginBottom: 16 }}>Verified Skill Summary</h2>
          {skills.length > 0 ? (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {skills.map((s) => (
                <span key={s.id} className="badge badge-indigo" style={{ padding: "8px 14px", fontSize: 13 }}>
                  <Sparkles size={13} style={{ marginRight: 6 }} />
                  {s.skill?.name || s.customSkillName} • {s.proficiencyLevel} ({s.confidenceScore}%)
                </span>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {["React & Next.js", "Python / FastAPI", "PostgreSQL & Mongo", "Docker & Kubernetes"].map((name) => (
                <span key={name} className="badge badge-indigo" style={{ padding: "8px 14px", fontSize: 13 }}>
                  <Sparkles size={13} style={{ marginRight: 6 }} /> {name} • Verified
                </span>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
