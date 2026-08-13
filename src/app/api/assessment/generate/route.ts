import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { aiClient } from "@/lib/ai-client";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { skill, currentLevel = "Intermediate" } = await req.json();

    const result = await aiClient.generateAssessment({
      skill,
      current_level: currentLevel,
      question_count: 5,
    }) as any;

    // Create assessment record
    const assessment = await prisma.assessment.create({
      data: {
        userId: session.user.id,
        skill,
        level: currentLevel,
        questions: result.questions,
      },
    });

    return NextResponse.json({ ...result, assessmentId: assessment.id });
  } catch (error) {
    console.error("Assessment generate error:", error);
    return NextResponse.json({ error: "AI service unavailable" }, { status: 503 });
  }
}
