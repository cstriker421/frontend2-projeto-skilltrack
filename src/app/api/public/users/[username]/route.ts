import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

type Ctx = { params: Promise<{ username: string }> };

export async function GET(_: Request, ctx: Ctx) {
  const { username } = await ctx.params;

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      username: true,
      avatar: true,
      createdAt: true,
      skills: {
        where: { isArchived: false },
        orderBy: [{ level: "asc" }, { progress: "desc" }],
        select: {
          id: true,
          title: true,
          description: true,
          level: true,
          progress: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}