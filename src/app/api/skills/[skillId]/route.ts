import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/db/prisma";
import { skillUpdateSchema } from "@/lib/validators/skill";

type Ctx = { params: Promise<{ skillId: string }> };

// GET: fetches a single skill by id (must belong to user)
export async function GET(_: Request, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { skillId } = await ctx.params;
  const userId = (session.user as any).id as string;

  const skill = await prisma.skill.findFirst({
    where: { id: skillId, userId },
  });

  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  return NextResponse.json(skill);
}

// PATCH: updates a skill (title, description, level, progress, isArchived)
export async function PATCH(req: Request, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { skillId } = await ctx.params;
  const userId = (session.user as any).id as string;

  const skill = await prisma.skill.findFirst({
    where: { id: skillId, userId },
    select: { id: true },
  });

  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = skillUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const updated = await prisma.skill.update({
    where: { id: skillId },
    data: parsed.data,
  });

  return NextResponse.json(updated);
}

// DELETE: soft-deletes (archives) by default; hard-deletes if ?hard=1
export async function DELETE(req: Request, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { skillId } = await ctx.params;
  const userId = (session.user as any).id as string;
  const hard = new URL(req.url).searchParams.get("hard") === "1";

  const skill = await prisma.skill.findFirst({
    where: { id: skillId, userId },
    select: { id: true },
  });

  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  if (hard) {
    await prisma.skill.delete({ where: { id: skillId } });
    return new NextResponse(null, { status: 204 });
  }

  // Soft-delete: just flips isArchived
  const archived = await prisma.skill.update({
    where: { id: skillId },
    data: { isArchived: true },
  });

  return NextResponse.json(archived);
}