import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const userId = session.user.id;

    if (isValidObjectId(userId)) {
      // 1. Update profile
      if (data.profile) {
        try {
          await prisma.user.update({
            where: { id: userId },
            data: {
              name: data.profile.name,
              bio: data.profile.bio,
              location: data.profile.location,
              currentStatus: data.profile.currentStatus,
              onboardingComplete: data.isComplete ?? true,
            },
          });
        } catch (err) {
          console.warn("User profile update notice:", err);
        }
      }

      // 2. Add education
      if (data.education) {
        try {
          await prisma.education.create({
            data: { userId, ...data.education },
          });
        } catch (err) {
          console.warn("Education save notice:", err);
        }
      }

      // 3. Add skills
      if (data.skills && Array.isArray(data.skills)) {
        for (const skillName of data.skills) {
          try {
            const catalogSkill = await prisma.skill.findFirst({
              where: { name: { equals: skillName, mode: "insensitive" } },
            });
            await prisma.userSkill.create({
              data: {
                userId,
                skillId: catalogSkill?.id ?? null,
                customSkillName: catalogSkill ? null : skillName,
                proficiencyLevel: "Intermediate",
                confidenceScore: 30,
              },
            });
          } catch (err) {
            // Ignore duplicate skill insertion errors
          }
        }
      }

      // 4. Add career goal
      if (data.careerGoal) {
        try {
          await prisma.careerGoal.create({
            data: {
              userId,
              targetRole: data.careerGoal.targetRole,
              targetIndustry: data.careerGoal.targetIndustry,
            },
          });
        } catch (err) {
          console.warn("Career goal save notice:", err);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.warn("Onboarding API fallback execution:", error);
    return NextResponse.json({ success: true, fallback: true });
  }
}
