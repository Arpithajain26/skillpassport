import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const isValidUserId = (id: string) => !!id && id.length > 0;

export async function GET() {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isValidUserId(session.user.id)) {
    return NextResponse.json([]);
  }

  try {
    const repos = await prisma.gitHubRepo.findMany({
      where: { userId: session.user.id },
      orderBy: [{ stars: "desc" }, { pushedAt: "desc" }],
    });
    return NextResponse.json(repos);
  } catch (e) {
    console.warn("GitHub repos GET notice:", e);
    return NextResponse.json([]);
  }
}
