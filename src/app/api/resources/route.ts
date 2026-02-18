import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/db/prisma";
import { resourceCreateSchema } from "@/lib/validators/resource";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const { searchParams } = new URL(req.url);
  const skillId = searchParams.get("skillId");

  if (!skillId) {
    return NextResponse.json({ error: "skillId is required" }, { status: 400 });
  }

  // Ensures the skill belongs to the current user
  const ownsSkill = await prisma.skill.findFirst({
    where: { id: skillId, userId, isArchived: false },
    select: { id: true },
  });

  if (!ownsSkill) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const resources = await prisma.resource.findMany({
    where: { skillId },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(resources);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const body = await req.json();

  const parsed = resourceCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  // Ensures the skill belongs to the current user
  const ownsSkill = await prisma.skill.findFirst({
    where: { id: parsed.data.skillId, userId, isArchived: false },
    select: { id: true },
  });

  if (!ownsSkill) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const created = await prisma.resource.create({
    data: {
      skillId: parsed.data.skillId,
      title: parsed.data.title,
      url: parsed.data.url,
      type: parsed.data.type ?? "ARTICLE",
      status: parsed.data.status ?? "PLANNED",
      notes: parsed.data.notes,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
