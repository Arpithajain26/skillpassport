import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PassportView } from "./passport-view";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await prisma.user.findUnique({ where: { username }, select: { name: true, bio: true } });
  if (!user) return { title: "Passport Not Found" };
  return {
    title: `${user.name} — SkillPassport`,
    description: user.bio ?? `${user.name}'s AI-verified skill identity`,
  };
}

async function getPublicProfile(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      skills: {
        include: { skill: true },
        orderBy: { confidenceScore: "desc" },
        where: { confidenceScore: { gt: 0 } },
      },
      projects: { where: { isFeatured: true }, orderBy: { createdAt: "desc" }, take: 6 },
      certificates: { orderBy: { issueDate: "desc" } },
      education: { orderBy: { startDate: "desc" } },
      experience: { orderBy: { startDate: "desc" } },
      careerGoals: { where: { isActive: true }, take: 1 },
      evidence: { orderBy: { createdAt: "desc" }, take: 10 },
      aiSummary: true,
    },
  });

  return user;
}

export default async function PassportPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await getPublicProfile(username);

  if (!user) notFound();
  if (!user.isPublic) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>This passport is private</h1>
        <p style={{ color: "var(--text-secondary)" }}>The owner has set their profile to private.</p>
      </div>
    );
  }

  return <PassportView user={user} />;
}
