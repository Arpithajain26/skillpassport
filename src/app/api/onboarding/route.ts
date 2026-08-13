import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const userId = session.user.id;

    // Update user profile
    if (data.profile) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          name: data.profile.name,
          bio: data.profile.bio,
          location: data.profile.location,
          currentStatus: data.profile.currentStatus,
          onboardingComplete: data.isComplete ?? false,
        },
      });
    }

    // Add education
    if (data.education) {
      await prisma.education.create({
        data: { userId, ...data.education },
      });
    }

    // Add skills
    if (data.skills && data.skills.length > 0) {
      for (const skillName of data.skills) {
        const catalogSkill = await prisma.skill.findFirst({
          where: { name: { equals: skillName, mode: "insensitive" } },
        });
        const existing = await prisma.userSkill.findFirst({
          where: { userId, skillId: catalogSkill?.id ?? undefined },
        });
        if (!existing) {
          await prisma.userSkill.create({
            data: {
              userId,
              skillId: catalogSkill?.id ?? null,
              customSkillName: catalogSkill ? null : skillName,
              proficiencyLevel: "Intermediate",
              confidenceScore: 30,
            },
          });
        }
      }
    }

    // Add career goal
    if (data.careerGoal) {
      await prisma.careerGoal.create({
        data: {
          userId,
          targetRole: data.careerGoal.targetRole,
          targetIndustry: data.careerGoal.targetIndustry,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: "Failed to save onboarding data" }, { status: 500 });
  }
}
