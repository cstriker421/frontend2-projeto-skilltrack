import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/db/prisma";
import { skillCreateSchema } from "@/lib/validators/skill";

type Ctx = { params: Promise<{ skillId: string }> };

// Updates a skill (partial updates allowed)
export async function PATCH(req: Request, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { skillId } = await ctx.params; // ✅ unwrap params Promise once
  const userId = (session.user as any).id as string;

  const body = await req.json();
  const parsed = skillCreateSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  // Ensure it belongs to the user
  const existing = await prisma.skill.findFirst({
    where: { id: skillId, userId, isArchived: false },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.skill.update({
    where: { id: skillId },
    data: parsed.data,
  });

  return NextResponse.json(updated);
}

// Soft-deletes (archives) a skill
export async function DELETE(_: Request, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { skillId } = await ctx.params;
  const userId = (session.user as any).id as string;

  const existing = await prisma.skill.findFirst({
    where: { id: skillId, userId, isArchived: false },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.skill.update({
    where: { id: skillId },
    data: { isArchived: true },
  });

  return NextResponse.json({ ok: true });
}
