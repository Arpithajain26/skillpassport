import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const username = email.split("@")[0].replace(/[^a-z0-9]/gi, "-").toLowerCase() + "-" + Date.now().toString(36);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        username,
      },
      select: { id: true, email: true, name: true, username: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    console.error("Register error:", error);
    const message = error?.message || "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
