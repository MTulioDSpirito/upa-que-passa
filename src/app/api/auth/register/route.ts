import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSessionToken, USER_SESSION_COOKIE, SESSION_COOKIE_MAX_AGE } from "@/lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const { nickname, email, password, console: platform } = await request.json();

  if (typeof nickname !== "string" || typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Nickname, e-mail e senha são obrigatórios." }, { status: 400 });
  }

  const cleanNickname = nickname.trim();
  const cleanEmail = email.toLowerCase().trim();

  if (cleanNickname.length < 3 || cleanNickname.length > 24) {
    return NextResponse.json({ error: "Nickname deve ter entre 3 e 24 caracteres." }, { status: 400 });
  }
  if (!EMAIL_RE.test(cleanEmail)) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Senha deve ter no mínimo 8 caracteres." }, { status: 400 });
  }

  const [existingEmail, existingNickname] = await Promise.all([
    prisma.siteUser.findUnique({ where: { email: cleanEmail } }),
    prisma.siteUser.findUnique({ where: { nickname: cleanNickname } }),
  ]);
  if (existingEmail) {
    return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });
  }
  if (existingNickname) {
    return NextResponse.json({ error: "Este nickname já está em uso." }, { status: 409 });
  }

  const user = await prisma.siteUser.create({
    data: {
      nickname: cleanNickname,
      email: cleanEmail,
      passwordHash: await hashPassword(password),
      console: typeof platform === "string" ? platform : null,
    },
  });

  const token = await createSessionToken({
    sub: user.id,
    name: user.nickname,
    email: user.email,
    role: "user",
    kind: "user",
    avatar: user.avatar ?? undefined,
  });

  const response = NextResponse.json(
    { id: user.id, nickname: user.nickname, email: user.email },
    { status: 201 }
  );

  response.cookies.set(USER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE,
  });

  return response;
}
