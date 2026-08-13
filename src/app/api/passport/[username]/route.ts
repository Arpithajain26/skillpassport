import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      education: { orderBy: { startDate: "desc" } },
      experience: { orderBy: { startDate: "desc" } },
      skills: {
        include: { skill: true },
        orderBy: { confidenceScore: "desc" },
        where: { confidenceScore: { gt: 0 } },
      },
      projects: { where: { isFeatured: true }, orderBy: { createdAt: "desc" }, take: 6 },
      certificates: { orderBy: { issueDate: "desc" } },
      careerGoals: { where: { isActive: true }, take: 1 },
      evidence: { orderBy: { createdAt: "desc" }, take: 10 },
      aiSummary: true,
    },
  });

  if (!user) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  if (!user.isPublic) return NextResponse.json({ error: "This profile is private" }, { status: 403 });

  const { password, ...publicUser } = user;
  return NextResponse.json(publicUser);
}
