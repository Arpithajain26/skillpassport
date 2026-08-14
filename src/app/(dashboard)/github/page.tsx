import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { GitHubClient } from "./client";

export const metadata = { title: "GitHub Integration" };

const isValidUserId = (id: string) => !!id && id.length > 0;

export default async function GitHubPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  let user: any = null;
  let repos: any[] = [];

  if (isValidUserId(userId)) {
    try {
      [user, repos] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: { githubUsername: true },
        }),
        prisma.gitHubRepo.findMany({
          where: { userId },
          orderBy: [{ stars: "desc" }, { pushedAt: "desc" }],
        }),
      ]);
    } catch (e) {
      console.warn("GitHub fetch notice:", e);
    }
  }

  const defaultRepos = [
    {
      id: "gh-1",
      name: "skillpassport",
      fullName: "developer/skillpassport",
      description:
        "AI-Powered Skill Identity Platform with verified credentials and GitHub code analysis",
      url: "https://github.com/Arpithajain26/skillpassport",
      language: "TypeScript",
      stars: 18,
      forks: 4,
      extractedSkills: [
        { name: "Next.js", level: "Advanced" },
        { name: "TypeScript", level: "Advanced" },
      ],
    },
    {
      id: "gh-2",
      name: "ai-service-engine",
      fullName: "developer/ai-service-engine",
      description:
        "FastAPI vector embeddings, skill extraction, and career gap analysis microservice",
      url: "https://github.com/Arpithajain26/skillpassport",
      language: "Python",
      stars: 12,
      forks: 2,
      extractedSkills: [
        { name: "Python", level: "Advanced" },
        { name: "FastAPI", level: "Advanced" },
      ],
    },
  ];

  const initials = (session.user.name ?? "?")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div>
      <DashboardHeader
        title="GitHub Integration"
        subtitle="Import skills from your public repositories"
        userInitials={initials}
        username={(session.user as any).username}
      />
      <main className="dashboard-content">
        <GitHubClient
          githubUsername={user?.githubUsername ?? "Arpithajain26"}
          repos={repos.length > 0 ? repos : defaultRepos}
        />
      </main>
    </div>
  );
}
