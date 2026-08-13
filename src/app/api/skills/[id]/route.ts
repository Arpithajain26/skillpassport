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

  const skill = await prisma.userSkill.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!skill) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.userSkill.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const skill = await prisma.userSkill.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!skill) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.userSkill.update({
    where: { id },
    data: body,
    include: { skill: true },
  });

  return NextResponse.json(updated);
}
