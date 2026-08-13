import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { aiClient } from "@/lib/ai-client";

export async function POST(_req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [user, skills, projects, certificates, experiences, assessments, careerGoal] = await Promise.all([
      prisma.user.findUnique({ where: { id: session.user.id } }),
      prisma.userSkill.findMany({ where: { userId: session.user.id }, include: { skill: true }, orderBy: { confidenceScore: "desc" }, take: 8 }),
      prisma.project.count({ where: { userId: session.user.id } }),
      prisma.certificate.count({ where: { userId: session.user.id } }),
      prisma.experience.findMany({ where: { userId: session.user.id, isCurrent: false } }),
      prisma.assessment.count({ where: { userId: session.user.id } }),
      prisma.careerGoal.findFirst({ where: { userId: session.user.id, isActive: true } }),
    ]);

    const result = await aiClient.profileSummary({
      name: user?.name ?? "User",
      skills: skills.map((s) => ({ name: s.skill?.name ?? s.customSkillName, level: s.proficiencyLevel, confidence: s.confidenceScore })),
      projects_count: projects,
      certificates_count: certificates,
      internships_count: experiences.length,
      assessments_count: assessments,
      target_role: careerGoal?.targetRole,
      bio: user?.bio,
    }) as any;

    // Save the summary
    await prisma.aiProfileSummary.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        summary: result.summary,
        headline: result.headline,
        keyStrengths: result.key_strengths ?? [],
      },
      update: {
        summary: result.summary,
        headline: result.headline,
        keyStrengths: result.key_strengths ?? [],
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Summary error:", error);
    return NextResponse.json({ error: "AI service unavailable" }, { status: 503 });
  }
}
