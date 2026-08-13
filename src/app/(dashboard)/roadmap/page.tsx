import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { RoadmapClient } from "./client";

export const metadata = { title: "Learning Roadmap" };

export default async function RoadmapPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [roadmaps, careerGoals, skillGaps] = await Promise.all([
    prisma.learningRoadmap.findMany({ where: { userId: session.user.id }, orderBy: { updatedAt: "desc" } }),
    prisma.careerGoal.findMany({ where: { userId: session.user.id, isActive: true } }),
    prisma.skillGap.findMany({ where: { userId: session.user.id }, orderBy: { gapScore: "desc" } }),
  ]);

  const initials = (session.user.name ?? "?").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div>
      <DashboardHeader title="Learning Roadmap" subtitle="AI-generated weekly learning plan" userInitials={initials} username={(session.user as any).username} />
      <main className="dashboard-content">
        <RoadmapClient roadmaps={roadmaps} careerGoals={careerGoals} skillGaps={skillGaps} />
      </main>
    </div>
  );
}
