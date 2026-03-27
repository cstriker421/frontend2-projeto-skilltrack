import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  const body = await req.json();
  const result = registerSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const { email, password } = result.data;
  const normalised = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({
    where: { email: normalised },
  });

  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email: normalised,
      username: normalised.split("@")[0],
      avatar: "🔥",
      password: hashed,
    },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}