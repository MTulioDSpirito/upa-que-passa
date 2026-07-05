import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.siteUser.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  const { nickname, email, active } = await request.json();
  const data: { nickname?: string; email?: string; active?: boolean } = {};

  if (nickname !== undefined) {
    if (typeof nickname !== "string" || nickname.trim().length < 3 || nickname.trim().length > 24) {
      return NextResponse.json({ error: "Nickname deve ter entre 3 e 24 caracteres." }, { status: 400 });
    }
    data.nickname = nickname.trim();
  }
  if (email !== undefined) {
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    }
    data.email = email.toLowerCase().trim();
  }
  if (active !== undefined) {
    if (typeof active !== "boolean") {
      return NextResponse.json({ error: "active deve ser booleano." }, { status: 400 });
    }
    data.active = active;
  }

  if (data.nickname || data.email) {
    const conflict = await prisma.siteUser.findFirst({
      where: {
        id: { not: id },
        OR: [
          data.nickname ? { nickname: data.nickname } : undefined,
          data.email ? { email: data.email } : undefined,
        ].filter((c): c is { nickname: string } | { email: string } => !!c),
      },
    });
    if (conflict) {
      return NextResponse.json({ error: "Nickname ou e-mail já em uso por outro usuário." }, { status: 409 });
    }
  }

  const user = await prisma.siteUser.update({
    where: { id },
    select: {
      id: true,
      nickname: true,
      email: true,
      avatar: true,
      console: true,
      city: true,
      state: true,
      active: true,
      createdAt: true,
    },
    data,
  });

  return NextResponse.json({ user });
}
