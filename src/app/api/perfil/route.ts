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

export async function PATCH(request: NextRequest) {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json();
  const nickname = typeof body.nickname === "string" ? body.nickname.trim() : "";
  const avatarRaw = typeof body.avatar === "string" ? body.avatar.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  const state = typeof body.state === "string" ? body.state.trim() : "";
  const bio = typeof body.bio === "string" ? body.bio.trim() : "";
  const platform = typeof body.console === "string" ? body.console.trim() : "";

  if (nickname.length < 3 || nickname.length > 24) {
    return NextResponse.json({ error: "Nickname deve ter entre 3 e 24 caracteres." }, { status: 400 });
  }
  if (bio.length > 300) {
    return NextResponse.json({ error: "Bio deve ter no máximo 300 caracteres." }, { status: 400 });
  }
  if (avatarRaw && !isValidAvatarUrl(avatarRaw)) {
    return NextResponse.json({ error: "URL do avatar inválida — use um link http(s)." }, { status: 400 });
  }

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
