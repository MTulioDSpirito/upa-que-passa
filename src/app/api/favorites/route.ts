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

import { z } from "zod";

const favoriteSchema = z.object({
  gameId: z.string({ message: "gameId é obrigatório." }).min(1, "gameId é obrigatório."),
});

export async function POST(request: NextRequest) {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = favoriteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { gameId } = parsed.data;

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
