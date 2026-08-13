import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchUserRepos, fetchRepoLanguages, extractSkillsFromRepo } from "@/lib/github";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { username } = await req.json();
    if (!username) return NextResponse.json({ error: "Username required" }, { status: 400 });

    // Update user github username
    await prisma.user.update({
      where: { id: session.user.id },
      data: { githubUsername: username },
    });

    // Fetch repos
    const repos = await fetchUserRepos(username);

    // Clear existing repos
    await prisma.gitHubRepo.deleteMany({ where: { userId: session.user.id } });

    // Save repos
    for (const repo of repos.slice(0, 20)) {
      let languages: Record<string, number> = {};
      try {
        languages = await fetchRepoLanguages(username, repo.name);
      } catch {}

      const extractedSkills = extractSkillsFromRepo(repo, languages);

      await prisma.gitHubRepo.create({
        data: {
          userId: session.user.id,
          repoId: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          url: repo.html_url,
          language: repo.language,
          languages,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          isPrivate: repo.private,
          topics: repo.topics,
          extractedSkills,
          pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null,
        },
      });
    }

    return NextResponse.json({ success: true, repoCount: repos.length });
  } catch (error: any) {
    console.error("GitHub connect error:", error);
    return NextResponse.json({ error: error.message ?? "Failed to connect GitHub" }, { status: 500 });
  }
}
