import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  verifyPassword,
  hashPassword,
  createSessionToken,
  USER_SESSION_COOKIE,
  SESSION_COOKIE_MAX_AGE,
  DUMMY_PASSWORD_HASH,
} from "@/lib/auth";
import { isLocked, lockoutRemainingMinutes, nextLockoutState } from "@/lib/loginLockout";

export type UserLoginResult =
  | { ok: true; user: { id: string; nickname: string; email: string } }
  | { ok: false; error: string; status: number };

export async function loginUser(email: string, password: string): Promise<UserLoginResult> {
  const user = await prisma.siteUser.findUnique({ where: { email: email.toLowerCase().trim() } });

  if (!user || !user.active) {
    await verifyPassword(password, DUMMY_PASSWORD_HASH);
    return { ok: false, error: "E-mail ou senha inválidos.", status: 401 };
  }

  if (isLocked(user.lockedUntil)) {
    return {
      ok: false,
      error: `Muitas tentativas. Tente novamente em ${lockoutRemainingMinutes(user.lockedUntil)} minuto(s).`,
      status: 429,
    };
  }

  if (!(await verifyPassword(password, user.passwordHash))) {
    const nextState = nextLockoutState(user.failedLoginAttempts);
    await prisma.siteUser.update({ where: { id: user.id }, data: nextState });
    return { ok: false, error: "E-mail ou senha inválidos.", status: 401 };
  }

  await prisma.siteUser.update({
    where: { id: user.id },
    data: { failedLoginAttempts: 0, lockedUntil: null },
  });

  const token = await createSessionToken({
    sub: user.id,
    name: user.nickname,
    email: user.email,
    role: "user",
    kind: "user",
    avatar: user.avatar ?? undefined,
  });

  const cookieStore = await cookies();
  cookieStore.set(USER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE,
  });

  return { ok: true, user: { id: user.id, nickname: user.nickname, email: user.email } };
}

export type ResetPasswordResult = { ok: true; message: string } | { ok: false; error: string; status: number };

export async function resetUserPassword(token: string, password: string): Promise<ResetPasswordResult> {
  const resetTokenRecord = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!resetTokenRecord || !resetTokenRecord.approved || resetTokenRecord.expiresAt < new Date()) {
    return { ok: false, error: "Token de recuperação inválido ou expirado.", status: 400 };
  }

  const user = await prisma.siteUser.findUnique({ where: { email: resetTokenRecord.email } });
  if (!user) {
    return { ok: false, error: "Usuário não encontrado.", status: 404 };
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.siteUser.update({
      where: { id: user.id },
      data: { passwordHash, failedLoginAttempts: 0, lockedUntil: null },
    }),
    prisma.passwordResetToken.delete({ where: { id: resetTokenRecord.id } }),
  ]);

  return { ok: true, message: "Senha redefinida com sucesso! Você já pode entrar com as novas credenciais." };
}
