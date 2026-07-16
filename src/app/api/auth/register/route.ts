import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSessionToken, USER_SESSION_COOKIE, SESSION_COOKIE_MAX_AGE } from "@/lib/auth";

import { z } from "zod";

const registerSchema = z.object({
  nickname: z
    .string({ message: "Nickname, e-mail e senha são obrigatórios." })
    .trim()
    .min(3, "Nickname deve ter entre 3 e 24 caracteres.")
    .max(24, "Nickname deve ter entre 3 e 24 caracteres."),
  email: z
    .string({ message: "Nickname, e-mail e senha são obrigatórios." })
    .toLowerCase()
    .trim()
    .email("E-mail inválido."),
  password: z
    .string({ message: "Nickname, e-mail e senha são obrigatórios." })
    .min(8, "Senha deve ter no mínimo 8 caracteres."),
  console: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    if (
      typeof body.nickname !== "string" ||
      typeof body.email !== "string" ||
      typeof body.password !== "string"
    ) {
      return NextResponse.json({ error: "Nickname, e-mail e senha são obrigatórios." }, { status: 400 });
    }
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { nickname: cleanNickname, email: cleanEmail, password, console: platform } = parsed.data;

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
