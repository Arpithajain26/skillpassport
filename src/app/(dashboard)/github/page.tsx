import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { GitHubClient } from "./client";

export const metadata = { title: "GitHub Integration" };

export default async function GitHubPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [user, repos] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { githubUsername: true } }),
    prisma.gitHubRepo.findMany({ where: { userId: session.user.id }, orderBy: [{ stars: "desc" }, { pushedAt: "desc" }] }),
  ]);

  const initials = (session.user.name ?? "?").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div>
      <DashboardHeader title="GitHub Integration" subtitle="Import skills from your public repositories" userInitials={initials} username={(session.user as any).username} />
      <main className="dashboard-content">
        <GitHubClient githubUsername={user?.githubUsername ?? null} repos={repos} />
      </main>
    </div>
  );
}
