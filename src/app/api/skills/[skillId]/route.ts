import { z } from "zod";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/db/prisma";

type Ctx = { params: Promise<{ skillId: string }> };

const resourceCreateSchema = z.object({
  title: z.string().min(1).max(120),
  url: z.string().url(),
  kind: z.enum(["ARTICLE", "VIDEO", "BOOK", "COURSE", "OTHER"]).default("OTHER"),
});

// GET: lists resources for a skill (must belong to user)
export async function GET(_: Request, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { skillId } = await ctx.params;
  const userId = (session.user as any).id as string;

  // Ensures skill belongs to user
  const skill = await prisma.skill.findFirst({
    where: { id: skillId, userId },
    select: { id: true },
  });

  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  const resources = await prisma.resource.findMany({
    where: { skillId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(resources);
}

// POST: creates a resource for a skill (must belong to user)
export async function POST(req: Request, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { skillId } = await ctx.params;
  const userId = (session.user as any).id as string;

  const body = await req.json();
  const parsed = resourceCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  // Ensures skill belongs to user
  const skill = await prisma.skill.findFirst({
    where: { id: skillId, userId },
    select: { id: true },
  });

  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  const created = await prisma.resource.create({
    data: {
      skillId,
      title: parsed.data.title,
      url: parsed.data.url,
      kind: parsed.data.kind,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
