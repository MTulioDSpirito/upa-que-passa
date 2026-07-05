import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "upa_session";
export const USER_SESSION_COOKIE = "upa_user_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 dias
export const SESSION_COOKIE_MAX_AGE = SESSION_DURATION_SECONDS;

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET não configurado no .env");
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  sub: string;
  name: string;
  email: string;
  role: string;
  // Ausente = sessão de admin (tokens emitidos antes desta mudança continuam válidos).
  kind?: "admin" | "user";
  [key: string]: unknown;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as SessionPayload;
  } catch {
    return null;
  }
}
