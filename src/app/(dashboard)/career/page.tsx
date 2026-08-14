import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { CareerClient } from "./client";

const isValidUserId = (id: string) => !!id && id.length > 0;

export const metadata = { title: "Career Goals" };

export default async function CareerPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  let careerGoals: any[] = [];
  let userSkills: any[] = [];
  let skillGaps: any[] = [];
  if (isValidUserId(session.user.id)) {
    try {
      [careerGoals, userSkills, skillGaps] = await Promise.all([
        prisma.careerGoal.findMany({
          where: { userId: session.user.id },
          orderBy: { createdAt: "desc" },
        }),
        prisma.userSkill.findMany({
          where: { userId: session.user.id },
          include: { skill: true },
          orderBy: { confidenceScore: "desc" },
        }),
        prisma.skillGap.findMany({
          where: { userId: session.user.id },
          orderBy: { gapScore: "desc" },
        }),
      ]);
    } catch (e) {
      console.warn("Career fetch notice:", e);
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
        title="Career Goals"
        subtitle="AI-powered career matching and skill gap analysis"
        userInitials={initials}
        username={(session.user as any).username}
      />
      <main className="dashboard-content">
        <CareerClient
          careerGoals={careerGoals}
          userSkills={userSkills}
          skillGaps={skillGaps}
        />
      </main>
    </div>
  );
}
