import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";

export async function GET() {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({ where: { userId: session.sub } });
  return NextResponse.json({ gameIds: favorites.map((f) => f.gameId) });
}

export async function POST(request: NextRequest) {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { gameId } = await request.json();
  if (typeof gameId !== "string" || !gameId) {
    return NextResponse.json({ error: "gameId é obrigatório." }, { status: 400 });
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_gameId: { userId: session.sub, gameId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorited: false });
  }

  await prisma.favorite.create({ data: { userId: session.sub, gameId } });
  return NextResponse.json({ favorited: true });
}
