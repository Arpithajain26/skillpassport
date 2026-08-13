import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  headline: z.string().max(200).optional(),
  website: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  githubUsername: z.string().max(100).optional(),
  currentStatus: z.string().optional(),
  targetCountry: z.string().optional(),
  isPublic: z.boolean().optional(),
  onboardingComplete: z.boolean().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      education: { orderBy: { startDate: "desc" } },
      experience: { orderBy: { startDate: "desc" } },
      skills: {
        include: { skill: true },
        orderBy: { confidenceScore: "desc" },
      },
      evidence: { orderBy: { createdAt: "desc" } },
      projects: { orderBy: { createdAt: "desc" } },
      certificates: { orderBy: { issueDate: "desc" } },
      careerGoals: { where: { isActive: true } },
      skillGaps: { orderBy: { gapScore: "desc" } },
      roadmaps: { where: { status: "active" }, take: 1 },
      assessments: { orderBy: { createdAt: "desc" }, take: 5 },
      githubRepos: { orderBy: { stars: "desc" } },
      aiSummary: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { password, ...safeUser } = user;
  return NextResponse.json(safeUser);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = profileSchema.parse(body);

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: { id: true, name: true, email: true, bio: true, location: true, headline: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
