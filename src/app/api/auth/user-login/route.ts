import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken, USER_SESSION_COOKIE, SESSION_COOKIE_MAX_AGE } from "@/lib/auth";

import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "Senha é obrigatória."),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const user = await prisma.siteUser.findUnique({ where: { email: email.toLowerCase().trim() } });

  if (!user || !user.active || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "E-mail ou senha inválidos." }, { status: 401 });
  }

  const token = await createSessionToken({
    sub: user.id,
    name: user.nickname,
    email: user.email,
    role: "user",
    kind: "user",
    avatar: user.avatar ?? undefined,
  });

  const response = NextResponse.json({
    id: user.id,
    nickname: user.nickname,
    email: user.email,
  });

  response.cookies.set(USER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE,
  });

  return response;
}
