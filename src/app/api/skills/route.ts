import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/db/prisma";
import { skillCreateSchema } from "@/lib/validators/skill";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id as string;

  const skills = await prisma.skill.findMany({
    where: { userId, isArchived: false },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(skills);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id as string;
  const body = await req.json();

  const parsed = skillCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const created = await prisma.skill.create({
    data: {
      userId,
      title: parsed.data.title,
      description: parsed.data.description,
      level: parsed.data.level ?? "BEGINNER",
      progress: parsed.data.progress ?? 0,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
