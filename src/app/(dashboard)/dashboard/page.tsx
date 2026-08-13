import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardHomeClient } from "./client";

export const metadata = { title: "Dashboard" };

async function getDashboardData(userId: string) {
  const [user, skills, evidence, projects, certificates, careerGoals, skillGaps, assessments, aiSummary, githubRepos] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.userSkill.findMany({ where: { userId }, include: { skill: true }, orderBy: { confidenceScore: "desc" }, take: 8 }),
    prisma.evidence.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.project.count({ where: { userId } }),
    prisma.certificate.count({ where: { userId } }),
    prisma.careerGoal.findMany({ where: { userId, isActive: true }, take: 2 }),
    prisma.skillGap.findMany({ where: { userId }, orderBy: { gapScore: "desc" }, take: 5 }),
    prisma.assessment.findMany({ where: { userId }, orderBy: { completedAt: "desc" }, take: 3 }),
    prisma.aiProfileSummary.findUnique({ where: { userId } }),
    prisma.gitHubRepo.count({ where: { userId } }),
  ]);

  return { user, skills, evidence, projects, certificates, careerGoals, skillGaps, assessments, aiSummary, githubRepos };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const data = await getDashboardData(session.user.id);
  if (!data.user?.onboardingComplete) redirect("/onboarding");

  const initials = (data.user?.name ?? "?")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div>
      <DashboardHeader
        title={`Good day, ${data.user?.name?.split(" ")[0] ?? "there"} 👋`}
        subtitle="Here's your skill identity snapshot"
        userInitials={initials}
        username={(session.user as any).username}
      />
      <main className="dashboard-content">
        <DashboardHomeClient data={data} />
      </main>
    </div>
  );
}
