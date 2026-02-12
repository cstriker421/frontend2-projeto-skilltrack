import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/db/prisma";
import { skillCreateSchema } from "@/lib/validators/skill";

type Ctx = { params: { skillId: string } };

// Updates a skill (partial updates allowed)
export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const body = await req.json();

  // Allows partial updates
  const parsed = skillCreateSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  // Ensures the skill belongs to this user
  const existing = await prisma.skill.findFirst({
    where: { id: params.skillId, userId, isArchived: false },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.skill.update({
    where: { id: params.skillId },
    data: parsed.data,
  });

  return NextResponse.json(updated);
}

// Soft-deletes (archives) a skill
export async function DELETE(_: Request, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  const existing = await prisma.skill.findFirst({
    where: { id: params.skillId, userId, isArchived: false },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.skill.update({
    where: { id: params.skillId },
    data: { isArchived: true },
  });

  return NextResponse.json({ ok: true });
}
