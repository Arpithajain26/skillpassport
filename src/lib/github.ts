const GITHUB_API = "https://api.github.com";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers: HeadersInit = {
  Accept: "application/vnd.github.v3+json",
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
};

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  private: boolean;
  topics: string[];
  pushed_at: string;
  languages_url: string;
}

export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  const res = await fetch(
    `${GITHUB_API}/users/${username}/repos?sort=updated&per_page=30&type=owner`,
    { headers, next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    if (res.status === 404) throw new Error("GitHub user not found");
    if (res.status === 403) throw new Error("GitHub API rate limit exceeded");
    throw new Error("Failed to fetch GitHub repositories");
  }

  const repos: GitHubRepo[] = await res.json();
  return repos.filter((r) => !r.private);
}

export async function fetchRepoLanguages(
  username: string,
  repoName: string
): Promise<Record<string, number>> {
  const res = await fetch(
    `${GITHUB_API}/repos/${username}/${repoName}/languages`,
    { headers, next: { revalidate: 3600 } }
  );
  if (!res.ok) return {};
  return res.json();
}

export function extractSkillsFromRepo(repo: GitHubRepo, languages: Record<string, number>) {
  const skills: Array<{ name: string; level: string; confidence: number }> = [];
  const seen = new Set<string>();

  const LANG_SKILL_MAP: Record<string, string> = {
    Python: "Python", TypeScript: "TypeScript", JavaScript: "JavaScript",
    Java: "Java", Go: "Go", Rust: "Rust", "C++": "C++",
    CSS: "CSS", HTML: "HTML",
  };

  for (const [lang] of Object.entries(languages).sort(([, a], [, b]) => b - a)) {
    const skillName = LANG_SKILL_MAP[lang];
    if (skillName && !seen.has(skillName)) {
      seen.add(skillName);
      skills.push({ name: skillName, level: "Intermediate", confidence: 72 });
    }
  }

  const topicSkillMap: Record<string, string> = {
    react: "React", "next.js": "Next.js", nextjs: "Next.js",
    "node.js": "Node.js", nodejs: "Node.js", express: "Express.js",
    fastapi: "FastAPI", django: "Django", flask: "Flask",
    postgresql: "PostgreSQL", mongodb: "MongoDB", redis: "Redis",
    docker: "Docker", kubernetes: "Kubernetes",
    "machine-learning": "Machine Learning", pytorch: "PyTorch",
    tensorflow: "TensorFlow", nlp: "NLP", graphql: "GraphQL",
    tailwindcss: "Tailwind CSS",
  };

  for (const topic of repo.topics) {
    const skillName = topicSkillMap[topic.toLowerCase()];
    if (skillName && !seen.has(skillName)) {
      seen.add(skillName);
      skills.push({ name: skillName, level: "Intermediate", confidence: 68 });
    }
  }

  return skills.slice(0, 8);
}
