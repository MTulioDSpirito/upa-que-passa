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

// Hash bcrypt válido que não corresponde a nenhuma senha real. Usado para "queimar"
// o mesmo tempo de um bcrypt.compare real quando o e-mail não existe, mitigando
// enumeração de contas por diferença de tempo de resposta (timing side-channel).
export const DUMMY_PASSWORD_HASH = "$2b$10$SQQ8CzbqStgk32zhYPMALejGL1c2/RlTOjEegD2k4c5vZYaorHhbS";

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
  if (!session || session.kind !== "user") return null;

  try {
    const user = await prisma.siteUser.findUnique({
      where: { id: session.sub },
      select: { active: true },
    });
    if (!user || !user.active) return null;
  } catch {
    return null;
  }

  return session;
}

export { SESSION_COOKIE, USER_SESSION_COOKIE, SESSION_COOKIE_MAX_AGE, ADMIN_SESSION_DURATION_SECONDS, createSessionToken } from "@/lib/session";
export type { SessionPayload } from "@/lib/session";
