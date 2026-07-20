import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession, createSessionToken, USER_SESSION_COOKIE, SESSION_COOKIE_MAX_AGE } from "@/lib/auth";

function isValidAvatarUrl(url: string): boolean {
  if (url.length > 500) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

import { z } from "zod";

const perfilSchema = z.object({
  nickname: z
    .preprocess((val) => (typeof val === "string" ? val.trim() : ""), z.string())
    .refine((val) => val.length >= 3 && val.length <= 24, {
      message: "Nickname deve ter entre 3 e 24 caracteres.",
    }),
  avatar: z
    .preprocess((val) => (typeof val === "string" ? val.trim() : ""), z.string())
    .refine((val) => !val || isValidAvatarUrl(val), {
      message: "URL do avatar inválida — use um link http(s).",
    }),
  city: z.preprocess((val) => (typeof val === "string" ? val.trim() : ""), z.string()),
  state: z.preprocess((val) => (typeof val === "string" ? val.trim() : ""), z.string()),
  bio: z
    .preprocess((val) => (typeof val === "string" ? val.trim() : ""), z.string())
    .refine((val) => val.length <= 300, {
      message: "Bio deve ter no máximo 300 caracteres.",
    }),
  console: z.preprocess((val) => (typeof val === "string" ? val.trim() : ""), z.string()),
});

export async function PATCH(request: NextRequest) {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = perfilSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { nickname, avatar: avatarRaw, city, state, bio, console: platform } = parsed.data;

  const nicknameTaken = await prisma.siteUser.findUnique({ where: { nickname } });
  if (nicknameTaken && nicknameTaken.id !== session.sub) {
    return NextResponse.json({ error: "Este nickname já está em uso." }, { status: 409 });
  }

  const user = await prisma.siteUser.update({
    where: { id: session.sub },
    data: {
      nickname,
      avatar: avatarRaw || null,
      city: city || null,
      state: state || null,
      bio: bio || null,
      console: platform || null,
    },
  });

  const token = await createSessionToken({
    sub: user.id,
    name: user.nickname,
    email: user.email,
    role: session.role,
    kind: "user",
    avatar: user.avatar ?? undefined,
  });

  const response = NextResponse.json({
    user: {
      nickname: user.nickname,
      avatar: user.avatar,
      city: user.city,
      state: user.state,
      bio: user.bio,
      console: user.console,
      createdAt: user.createdAt.toISOString(),
    },
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
