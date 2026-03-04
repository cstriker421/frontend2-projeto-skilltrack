import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/db/prisma";

const VALID_AVATARS = ["🔥","🚀","⚡","🎯","📚","🧠","💡","🌱","🏆","⭐","🎓","🦉","🥇"];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatar: true, email: true, name: true, username: true },
  });

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const { avatar } = await req.json();

  if (!VALID_AVATARS.includes(avatar)) {
    return NextResponse.json({ error: "Invalid avatar" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { avatar },
    select: { avatar: true },
  });

  return NextResponse.json(updated);
}