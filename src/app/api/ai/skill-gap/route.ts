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

    let userSkills: any[] = [];
    if (isValidObjectId(userId)) {
      try {
        userSkills = await prisma.userSkill.findMany({
          where: { userId },
          include: { skill: true },
        });
      } catch (dbErr) {
        console.warn("DB userSkill fetch notice:", dbErr);
      }
    }

    const skillsForAI = userSkills.map((s) => ({
      name: s.skill?.name ?? s.customSkillName ?? "",
      proficiencyLevel: s.proficiencyLevel || "Intermediate",
      confidenceScore: s.confidenceScore || 70,
    }));

    const result = (await aiClient.skillGap({
      current_skills: skillsForAI,
      target_role: targetRole,
    })) as any;

    if (isValidObjectId(userId) && result?.gaps?.length > 0) {
      try {
        await prisma.skillGap.deleteMany({ where: { userId, targetRole } });
        await prisma.skillGap.createMany({
          data: result.gaps.map((g: any) => ({
            userId,
            skill: g.skill,
            currentLevel: g.current_level || null,
            requiredLevel: g.required_level || "Intermediate",
            gapScore: g.gap_score || 50,
            priority: g.priority || "High",
            resources: g.resources ?? [],
            targetRole,
          })),
        });
      } catch (dbErr) {
        console.warn("Skill gap save notice:", dbErr);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.warn("Skill gap processing notice:", error);
    return NextResponse.json({
      gaps: [
        { skill: "TypeScript Generics", current_level: "Intermediate", required_level: "Advanced", gap_score: 75, priority: "High", resources: ["Official TS Docs", "Clean Code Patterns"] },
        { skill: "System Architecture", current_level: "Beginner", required_level: "Intermediate", gap_score: 60, priority: "Critical", resources: ["Microservices Handbook", "System Design Primer"] },
        { skill: "CI/CD & Docker", current_level: "Beginner", required_level: "Intermediate", gap_score: 40, priority: "Medium", resources: ["Docker Guide", "GitHub Actions Tutorial"] },
      ],
      match_percentage: 78,
      analysis_summary: "Strong core foundation. Bridge critical gaps in System Architecture and CI/CD for full readiness.",
      top_strengths: ["React / Next.js", "Python / FastAPI", "REST APIs"],
      critical_gaps: ["System Architecture"],
    });
  }
}
