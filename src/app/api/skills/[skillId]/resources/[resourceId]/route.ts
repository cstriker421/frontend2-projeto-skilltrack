import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/db/prisma";

type Ctx = { params: Promise<{ skillId: string; resourceId: string }> };

// DELETE: deletes a resource (must belong to user's skill)
export async function DELETE(_: Request, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { skillId, resourceId } = await ctx.params;
  const userId = (session.user as any).id as string;

  // Ensures the resource belongs to a skill owned by this user
  const resource = await prisma.resource.findFirst({
    where: { id: resourceId, skillId, skill: { userId } },
    select: { id: true },
  });

  if (!resource) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.resource.delete({ where: { id: resourceId } });

  return NextResponse.json({ ok: true });
}
