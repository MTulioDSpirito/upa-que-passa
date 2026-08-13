import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  verifyPassword,
  createSessionToken,
  SESSION_COOKIE,
  ADMIN_SESSION_DURATION_SECONDS,
  DUMMY_PASSWORD_HASH,
} from "@/lib/auth";
import { isLocked, lockoutRemainingMinutes, nextLockoutState } from "@/lib/loginLockout";

export type AdminLoginResult =
  | { ok: true; user: { name: string; email: string; role: string } }
  | { ok: false; error: string; status: number };

export async function loginAdmin(email: string, password: string): Promise<AdminLoginResult> {
  const user = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } });

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
    await prisma.adminUser.update({ where: { id: user.id }, data: nextState });
    return { ok: false, error: "E-mail ou senha inválidos.", status: 401 };
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { failedLoginAttempts: 0, lockedUntil: null },
  });

  const token = await createSessionToken({
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_DURATION_SECONDS,
  });

  return { ok: true, user: { name: user.name, email: user.email, role: user.role } };
}
