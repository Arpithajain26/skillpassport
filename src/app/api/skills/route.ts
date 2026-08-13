import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const skillSchema = z.object({
  skillId: z.string().optional(),
  customSkillName: z.string().optional(),
  proficiencyLevel: z.enum(["Beginner", "Elementary", "Intermediate", "Advanced", "Expert"]),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const skills = await prisma.userSkill.findMany({
    where: { userId: session.user.id },
    include: { skill: true },
    orderBy: { confidenceScore: "desc" },
  });

  return NextResponse.json(skills);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = skillSchema.parse(body);

    if (!data.skillId && !data.customSkillName) {
      return NextResponse.json({ error: "Either skillId or customSkillName required" }, { status: 400 });
    }

    const skill = await prisma.userSkill.create({
      data: {
        userId: session.user.id,
        skillId: data.skillId ?? null,
        customSkillName: data.customSkillName ?? null,
        proficiencyLevel: data.proficiencyLevel,
      },
      include: { skill: true },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
