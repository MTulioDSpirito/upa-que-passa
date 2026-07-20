import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { SESSION_COOKIE, USER_SESSION_COOKIE, verifySessionToken, type SessionPayload } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  if (!session) return null;

  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: session.sub },
      select: { active: true },
    });
    if (!user || !user.active) return null;
  } catch {
    return null;
  }

  return session;
}

export async function getUserSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  return session?.kind === "user" ? session : null;
}

export { SESSION_COOKIE, USER_SESSION_COOKIE, SESSION_COOKIE_MAX_AGE, ADMIN_SESSION_DURATION_SECONDS, createSessionToken } from "@/lib/session";
export type { SessionPayload } from "@/lib/session";
