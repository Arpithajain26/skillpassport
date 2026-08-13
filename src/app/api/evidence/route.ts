import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const evidenceSchema = z.object({
  type: z.string(),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  url: z.string().url().optional().or(z.literal("")),
  technologies: z.array(z.string()).optional(),
  source: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const evidence = await prisma.evidence.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(evidence);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = evidenceSchema.parse(body);

    const evidence = await prisma.evidence.create({
      data: {
        userId: session.user.id,
        ...data,
        url: data.url || null,
        technologies: data.technologies ?? [],
        verificationStatus: "pending",
      },
    });

    return NextResponse.json(evidence, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
