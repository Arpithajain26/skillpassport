import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { aiClient } from "@/lib/ai-client";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { targetRole, durationWeeks = 12 } = await req.json();

    const [userSkills, skillGaps, careerGoal] = await Promise.all([
      prisma.userSkill.findMany({ where: { userId: session.user.id }, include: { skill: true } }),
      prisma.skillGap.findMany({ where: { userId: session.user.id, targetRole }, orderBy: { gapScore: "desc" } }),
      prisma.careerGoal.findFirst({ where: { userId: session.user.id, targetRole } }),
    ]);

    const result = await aiClient.roadmap({
      current_skills: userSkills.map((s) => ({ name: s.skill?.name ?? s.customSkillName, proficiencyLevel: s.proficiencyLevel })),
      target_role: targetRole,
      skill_gaps: skillGaps.map((g) => ({ skill: g.skill, current_level: g.currentLevel, required_level: g.requiredLevel })),
      duration_weeks: durationWeeks,
    }) as any;

    // Save roadmap
    const roadmap = await prisma.learningRoadmap.upsert({
      where: { id: (await prisma.learningRoadmap.findFirst({ where: { userId: session.user.id, careerGoalId: careerGoal?.id } }))?.id ?? "new" },
      create: {
        userId: session.user.id,
        careerGoalId: careerGoal?.id,
        title: result.title,
        overview: result.overview,
        steps: result.weeks,
        milestones: result.milestones ?? [],
        totalDurationWeeks: result.total_duration_weeks,
        status: "active",
      },
      update: {
        title: result.title,
        overview: result.overview,
        steps: result.weeks,
        milestones: result.milestones ?? [],
        totalDurationWeeks: result.total_duration_weeks,
      },
    });

    return NextResponse.json({ ...result, id: roadmap.id });
  } catch (error) {
    console.error("Roadmap error:", error);
    return NextResponse.json({ error: "AI service unavailable" }, { status: 503 });
  }
}
