import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { aiClient } from "@/lib/ai-client";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const userId = session.user.id;
    const { targetRole } = await req.json();

    const userSkills = await prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true },
    });

    const skillsForAI = userSkills.map((s) => ({
      name: s.skill?.name ?? s.customSkillName ?? "",
      proficiencyLevel: s.proficiencyLevel,
      confidenceScore: s.confidenceScore,
    }));

    const result = await aiClient.skillGap({ current_skills: skillsForAI, target_role: targetRole }) as any;

    // Store gaps in database
    await prisma.skillGap.deleteMany({
      where: { userId, targetRole },
    });

    if (result.gaps && result.gaps.length > 0) {
      await prisma.skillGap.createMany({
        data: result.gaps.map((g: any) => ({
          userId,
          skill: g.skill,
          currentLevel: g.current_level,
          requiredLevel: g.required_level,
          gapScore: g.gap_score,
          priority: g.priority,
          resources: g.resources ?? [],
          targetRole,
        })),
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Skill gap error:", error);
    return NextResponse.json({ error: "AI service unavailable" }, { status: 503 });
  }
}
