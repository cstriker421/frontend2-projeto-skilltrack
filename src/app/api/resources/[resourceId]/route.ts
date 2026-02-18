import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/db/prisma";
import { resourceCreateSchema } from "@/lib/validators/resource";

type Ctx = { params: Promise<{ resourceId: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { resourceId } = await ctx.params;
  const userId = (session.user as any).id as string;

  const body = await req.json();

  // Allows partial updates but doen't allow changing skillId here
  const parsed = resourceCreateSchema
    .omit({ skillId: true })
    .partial()
    .safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  // Ensures resource belongs to a skill owned by this user
  const existing = await prisma.resource.findFirst({
    where: {
      id: resourceId,
      skill: { userId, isArchived: false },
    },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.resource.update({
    where: { id: resourceId },
    data: parsed.data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { resourceId } = await ctx.params;
  const userId = (session.user as any).id as string;

  const existing = await prisma.resource.findFirst({
    where: {
      id: resourceId,
      skill: { userId, isArchived: false },
    },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.resource.delete({ where: { id: resourceId } });

  return NextResponse.json({ ok: true });
}
