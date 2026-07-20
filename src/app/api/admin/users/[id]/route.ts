import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

import { z } from "zod";

const updateUserSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(3, "Nickname deve ter entre 3 e 24 caracteres.")
    .max(24, "Nickname deve ter entre 3 e 24 caracteres.")
    .optional(),
  email: z
    .string()
    .toLowerCase()
    .trim()
    .email("E-mail inválido.")
    .optional(),
  active: z.boolean({ message: "active deve ser booleano." }).optional(),
});

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

  const body = await request.json();
  const parsed = updateUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const data = parsed.data;

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
