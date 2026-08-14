import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { aiClient } from "@/lib/ai-client";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { assessmentId, userAnswers } = await req.json();

    const assessment = await prisma.assessment.findFirst({
      where: { id: assessmentId, userId: session.user.id },
    });

    if (!assessment)
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 },
      );

    // Get current confidence
    const userSkill = await prisma.userSkill.findFirst({
      where: { userId: session.user.id },
      include: { skill: true },
    });

    const result = (await aiClient.submitAssessment({
      skill: assessment.skill,
      questions: assessment.questions,
      user_answers: userAnswers,
      current_confidence: userSkill?.confidenceScore ?? 50,
    })) as any;

    // Update assessment record
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        userAnswers,
        score: result.score,
        correct: result.correct_count,
        total: result.total_questions,
        levelAchieved: result.level_achieved,
        previousConfidence: userSkill?.confidenceScore,
        newConfidence: result.new_confidence,
        feedback: result.feedback,
        questionFeedback: result.question_feedback,
        completedAt: new Date(),
      },
    });

    // Update skill confidence
    const catalogSkill = await prisma.skill.findFirst({
      where: { name: assessment.skill },
    });

    if (catalogSkill) {
      await prisma.userSkill.updateMany({
        where: { userId: session.user.id, skillId: catalogSkill.id },
        data: { confidenceScore: result.new_confidence },
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Assessment submit error:", error);
    return NextResponse.json(
      { error: "Failed to submit assessment" },
      { status: 500 },
    );
  }
}
