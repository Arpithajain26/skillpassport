import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardHomeClient } from "./client";

export const metadata = { title: "Dashboard" };

async function getDashboardData(userId: string) {
  try {
    // Fetch user first
    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Only fetch related data if queries exist - with error handling for each
    let skills: any[] = [];
    let evidence: any[] = [];
    let projects = 0;
    let certificates = 0;
    let careerGoals: any[] = [];
    let skillGaps: any[] = [];
    let assessments: any[] = [];
    let aiSummary: any = null;
    let githubRepos = 0;

    try {
      skills = await prisma.userSkill.findMany({
        where: { userId },
        include: { skill: true },
        orderBy: { confidenceScore: "desc" },
        take: 8,
      });
    } catch (e) {
      console.log("Skip skills:", e);
    }
    try {
      evidence = await prisma.evidence.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      });
    } catch (e) {
      console.log("Skip evidence:", e);
    }
    try {
      projects = await prisma.project.count({ where: { userId } });
    } catch (e) {
      console.log("Skip projects:", e);
    }
    try {
      certificates = await prisma.certificate.count({ where: { userId } });
    } catch (e) {
      console.log("Skip certificates:", e);
    }
    try {
      careerGoals = await prisma.careerGoal.findMany({
        where: { userId, isActive: true },
        take: 2,
      });
    } catch (e) {
      console.log("Skip careerGoals:", e);
    }
    try {
      skillGaps = await prisma.skillGap.findMany({
        where: { userId },
        orderBy: { gapScore: "desc" },
        take: 5,
      });
    } catch (e) {
      console.log("Skip skillGaps:", e);
    }
    try {
      assessments = await prisma.assessment.findMany({
        where: { userId },
        orderBy: { completedAt: "desc" },
        take: 3,
      });
    } catch (e) {
      console.log("Skip assessments:", e);
    }
    try {
      aiSummary = await prisma.aiProfileSummary.findUnique({
        where: { userId },
      });
    } catch (e) {
      console.log("Skip aiSummary:", e);
    }
    try {
      githubRepos = await prisma.gitHubRepo.count({ where: { userId } });
    } catch (e) {
      console.log("Skip githubRepos:", e);
    }

    return {
      user,
      skills,
      evidence,
      projects,
      certificates,
      careerGoals,
      skillGaps,
      assessments,
      aiSummary,
      githubRepos,
    };
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return {
      user: null,
      skills: [],
      evidence: [],
      projects: 0,
      certificates: 0,
      careerGoals: [],
      skillGaps: [],
      assessments: [],
      aiSummary: null,
      githubRepos: 0,
    };
  }
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    console.log("No session, redirecting to login");
    redirect("/login");
  }

  const isValidMongoId = (value: string) => /^[0-9a-fA-F]{24}$/.test(value);
  if (!isValidMongoId(session.user.id)) {
    console.warn("Blocked invalid session user id:", session.user.id);
    redirect("/login");
  }

  const data = await getDashboardData(session.user.id);

  if (!data.user) {
    console.log("User not found in database, redirecting to onboarding");
    redirect("/onboarding");
  }

  if (data.user.onboardingComplete === false) {
    console.log("Onboarding not complete, redirecting");
    redirect("/onboarding");
  }

  const initials = (data.user.name ?? "?")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const effectiveData = {
    ...data,
    user: data.user,
  };

  return (
    <div>
      <DashboardHeader
        title={`Good day, ${effectiveData.user.name?.split(" ")[0] ?? "there"} 👋`}
        subtitle="Here's your skill identity snapshot"
        userInitials={initials}
        userImage={effectiveData.user.image || undefined}
        username={(session.user as any).username}
      />
      <main className="dashboard-content">
        <DashboardHomeClient data={effectiveData} />
      </main>
    </div>
  );
}
