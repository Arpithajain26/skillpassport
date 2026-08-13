import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const evidence = await prisma.evidence.findFirst({ where: { id, userId: session.user.id } });
  if (!evidence) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.evidence.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
