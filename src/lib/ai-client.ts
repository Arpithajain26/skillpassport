const AI_SERVICE_URL = process.env.AI_SERVICE_URL ?? "http://localhost:8000";

async function aiRequest<T>(endpoint: string, data: unknown): Promise<T> {
  const res = await fetch(`${AI_SERVICE_URL}/api${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI service error: ${res.status} ${err}`);
  }

  return res.json();
}

export const aiClient = {
  analyzeEvidence: (data: unknown) =>
    aiRequest("/evidence/analyze", data),

  skillGap: (data: unknown) =>
    aiRequest("/skills/gap-analysis", data),

  profileSummary: (data: unknown) =>
    aiRequest("/skills/summary", data),

  careerMatch: (data: unknown) =>
    aiRequest("/career/match", data),

  roadmap: (data: unknown) =>
    aiRequest("/career/roadmap", data),

  generateAssessment: (data: unknown) =>
    aiRequest("/assessment/generate", data),

  submitAssessment: (data: unknown) =>
    aiRequest("/assessment/submit", data),
};
