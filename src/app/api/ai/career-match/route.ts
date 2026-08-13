import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { aiClient } from "@/lib/ai-client";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { targetRole } = await req.json();

    const [userSkills, evidenceCount] = await Promise.all([
      prisma.userSkill.findMany({
        where: { userId: session.user.id },
        include: { skill: true },
      }),
      prisma.evidence.count({ where: { userId: session.user.id } }),
    ]);

    const skillsForAI = userSkills.map((s) => ({
      name: s.skill?.name ?? s.customSkillName ?? "",
      proficiencyLevel: s.proficiencyLevel,
      confidenceScore: s.confidenceScore,
    }));

    const result = await aiClient.careerMatch({
      user_skills: skillsForAI,
      target_role: targetRole,
      evidence_count: evidenceCount,
    }) as any;

    // Update career goal match percentage
    await prisma.careerGoal.updateMany({
      where: { userId: session.user.id, targetRole },
      data: { matchPercentage: result.match_percentage },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Career match error:", error);
    return NextResponse.json({ error: "AI service unavailable" }, { status: 503 });
  }
}
