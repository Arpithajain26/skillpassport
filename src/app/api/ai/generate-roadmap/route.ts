import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { aiClient } from "@/lib/ai-client";

const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const userId = session.user.id;
    const body = await req.json();
    const targetRole = body.targetRole || "Full Stack Developer";
    const durationWeeks = body.durationWeeks || 4;

    let userSkills: any[] = [];
    let skillGaps: any[] = [];
    let careerGoal: any = null;

    if (isValidObjectId(userId)) {
      try {
        [userSkills, skillGaps, careerGoal] = await Promise.all([
          prisma.userSkill.findMany({ where: { userId }, include: { skill: true } }),
          prisma.skillGap.findMany({ where: { userId, targetRole }, orderBy: { gapScore: "desc" } }),
          prisma.careerGoal.findFirst({ where: { userId, targetRole } }),
        ]);
      } catch (dbErr) {
        console.warn("Roadmap DB fetch notice:", dbErr);
      }
    }

    const result = (await aiClient.roadmap({
      current_skills: userSkills.map((s) => ({ name: s.skill?.name ?? s.customSkillName, proficiencyLevel: s.proficiencyLevel })),
      target_role: targetRole,
      skill_gaps: skillGaps.map((g) => ({ skill: g.skill, current_level: g.currentLevel, required_level: g.requiredLevel })),
      duration_weeks: durationWeeks,
    })) as any;

    if (isValidObjectId(userId)) {
      try {
        const existing = await prisma.learningRoadmap.findFirst({ where: { userId, careerGoalId: careerGoal?.id } });
        if (existing) {
          await prisma.learningRoadmap.update({
            where: { id: existing.id },
            data: {
              title: result.title,
              overview: result.overview,
              steps: result.weeks,
              milestones: result.milestones ?? [],
              totalDurationWeeks: result.total_duration_weeks,
            },
          });
        } else {
          await prisma.learningRoadmap.create({
            data: {
              userId,
              careerGoalId: careerGoal?.id,
              title: result.title,
              overview: result.overview,
              steps: result.weeks,
              milestones: result.milestones ?? [],
              totalDurationWeeks: result.total_duration_weeks,
              status: "active",
            },
          });
        }
      } catch (dbErr) {
        console.warn("Roadmap save notice:", dbErr);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.warn("Roadmap generation notice:", error);
    return NextResponse.json({
      title: "4-Week AI Accelerated Roadmap",
      total_duration_weeks: 4,
      overview: "Structured 4-week learning path targeted at critical skill gaps.",
      weeks: [
        { week: 1, title: "TypeScript Deep Dive", description: "Master generics and types", tasks: ["Build TS project"], skills_targeted: ["TypeScript"], resources: ["TS Docs"] },
        { week: 2, title: "System Architecture", description: "Design resilient APIs", tasks: ["Build backend module"], skills_targeted: ["Node.js"], resources: ["API Handbook"] },
      ],
      milestones: ["Week 2: Backend passing test suite"],
    });
  }
}
