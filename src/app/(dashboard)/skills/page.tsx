import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { SkillsClient } from "./client";

export const metadata = { title: "Skills" };

export default async function SkillsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [userSkills, catalog] = await Promise.all([
    prisma.userSkill.findMany({
      where: { userId: session.user.id },
      include: { skill: true },
      orderBy: { confidenceScore: "desc" },
    }),
    prisma.skill.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
  ]);

  const initials = (session.user.name ?? "?").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div>
      <DashboardHeader
        title="Skills"
        subtitle={`${userSkills.length} verified skills`}
        userInitials={initials}
        username={(session.user as any).username}
      />
      <main className="dashboard-content">
        <SkillsClient userSkills={userSkills} catalog={catalog} />
      </main>
    </div>
  );
}
