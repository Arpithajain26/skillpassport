import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { AssessmentsClient } from "./client";

const isValidUserId = (id: string) => !!id && id.length > 0;

export const metadata = { title: "Assessments" };

export default async function AssessmentsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  let userSkills: any[] = [];
  let assessments: any[] = [];
  if (isValidUserId(session.user.id)) {
    try {
      [userSkills, assessments] = await Promise.all([
        prisma.userSkill.findMany({
          where: { userId: session.user.id },
          include: { skill: true },
          orderBy: { confidenceScore: "desc" },
        }),
        prisma.assessment.findMany({
          where: { userId: session.user.id },
          orderBy: { createdAt: "desc" },
        }),
      ]);
    } catch (e) {
      console.warn("Assessments fetch notice:", e);
    }
  }

  const initials = (session.user.name ?? "?")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div>
      <DashboardHeader
        title="AI Assessments"
        subtitle="Verify your skill level with AI-generated quizzes"
        userInitials={initials}
        username={(session.user as any).username}
      />
      <main className="dashboard-content">
        <AssessmentsClient userSkills={userSkills} assessments={assessments} />
      </main>
    </div>
  );
}
