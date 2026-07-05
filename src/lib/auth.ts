import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { SESSION_COOKIE, USER_SESSION_COOKIE, verifySessionToken, type SessionPayload } from "@/lib/session";

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
  return verifySessionToken(token);
}

export async function getUserSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  return session?.kind === "user" ? session : null;
}

export { SESSION_COOKIE, USER_SESSION_COOKIE, SESSION_COOKIE_MAX_AGE, createSessionToken } from "@/lib/session";
export type { SessionPayload } from "@/lib/session";
