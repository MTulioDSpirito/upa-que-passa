import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSessionToken, USER_SESSION_COOKIE, SESSION_COOKIE_MAX_AGE } from "@/lib/auth";
import { z } from "zod";

const DISPOSABLE_EMAIL_DOMAINS = [
  "yopmail.com",
  "tempmail.com",
  "mailinator.com",
  "sharklasers.com",
  "guerrillamail.com",
  "10minutemail.com",
  "temp-mail.org",
  "getairmail.com",
  "dispostable.com",
  "burnermail.io",
  "tempmailo.com",
  "temp-mail.io",
];

const registerSchema = z.object({
  nickname: z
    .string({ message: "Nickname, e-mail e senha são obrigatórios." })
    .trim()
    .min(3, "Nickname deve ter entre 3 e 24 caracteres.")
    .max(24, "Nickname deve ter entre 3 e 24 caracteres.")
    .regex(/^[a-zA-Z0-9_]+$/, "Nickname só pode conter letras, números e sublinhados (underline)."),
  email: z
    .string({ message: "Nickname, e-mail e senha são obrigatórios." })
    .toLowerCase()
    .trim()
    .email("E-mail inválido.")
    .refine((email) => {
      const domain = email.split("@")[1];
      return !DISPOSABLE_EMAIL_DOMAINS.includes(domain);
    }, "E-mails temporários ou descartáveis não são permitidos."),
  password: z
    .string({ message: "Nickname, e-mail e senha são obrigatórios." })
    .min(8, "Senha deve ter no mínimo 8 caracteres.")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula.")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número.")
    .regex(/[^a-zA-Z0-9]/, "A senha deve conter pelo menos um caractere especial (ex: !, @, #, $, etc.)."),
  console: z.string().optional().nullable(),
  honeypot: z.string().optional().nullable(),
  turnstileToken: z.string().optional().nullable(),
});

async function verifyTurnstile(token: string, ip?: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn("Warning: TURNSTILE_SECRET_KEY não configurada no .env. Ignorando validação em desenvolvimento.");
    return true;
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: ip || "",
      }),
    });

    const data = await response.json();
    return !!data.success;
  } catch (error) {
    console.error("Erro ao validar Turnstile:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Obter IP do usuário
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || null;

  // 1. Honeypot check (se preenchido, tratamos como se fosse bot)
  if (body.honeypot) {
    console.warn(`Honeypot preenchido de IP ${ip}: ${body.honeypot}`);
    return NextResponse.json({ error: "Cadastro realizado com sucesso." }, { status: 200 }); // Retorna sucesso falso para enganar o robô
  }

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

  const { nickname: cleanNickname, email: cleanEmail, password, console: platform, turnstileToken } = parsed.data;

  // 2. Validação do Turnstile
  if (process.env.TURNSTILE_SECRET_KEY) {
    if (!turnstileToken) {
      return NextResponse.json({ error: "Verificação de segurança Turnstile é obrigatória." }, { status: 400 });
    }
    const isHuman = await verifyTurnstile(turnstileToken, ip);
    if (!isHuman) {
      return NextResponse.json({ error: "Falha na verificação de segurança (Turnstile). Tente novamente." }, { status: 400 });
    }
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
      registrationIp: ip,
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
