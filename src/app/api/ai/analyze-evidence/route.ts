import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { aiClient } from "@/lib/ai-client";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { evidenceId, ...analysisData } = body;

    const result = await aiClient.analyzeEvidence(analysisData) as any;

    // Update evidence record if evidenceId provided
    if (evidenceId) {
      await prisma.evidence.update({
        where: { id: evidenceId },
        data: {
          verificationStatus: "analyzed",
          aiScore: result.overall_quality,
          extractedSkills: result.skills,
          aiSummary: result.summary,
          aiRecommendations: result.recommendations,
        },
      });

      // Update user skill confidence scores based on AI analysis
      for (const extractedSkill of result.skills) {
        const catalogSkill = await prisma.skill.findFirst({
          where: { name: { equals: extractedSkill.name, mode: "insensitive" } },
        });

        if (catalogSkill) {
          const existing = await prisma.userSkill.findFirst({
            where: { userId: session.user.id, skillId: catalogSkill.id },
          });

          if (existing) {
            const newConfidence = Math.round(
              existing.confidenceScore * 0.7 + extractedSkill.confidence * 0.3
            );
            await prisma.userSkill.update({
              where: { id: existing.id },
              data: {
                confidenceScore: Math.min(100, newConfidence),
                evidenceCount: { increment: 1 },
                verificationStatus: "analyzed",
              },
            });
          } else {
            await prisma.userSkill.create({
              data: {
                userId: session.user.id,
                skillId: catalogSkill.id,
                proficiencyLevel: extractedSkill.level,
                confidenceScore: extractedSkill.confidence,
                evidenceCount: 1,
                verificationStatus: "analyzed",
                aiExplanation: extractedSkill.explanation,
              },
            });
          }
        }
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI analyze evidence error:", error);
    return NextResponse.json({ error: "AI service unavailable" }, { status: 503 });
  }
}
