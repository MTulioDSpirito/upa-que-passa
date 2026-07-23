import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token de recuperação é obrigatório."),
  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres.")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula.")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número.")
    .regex(/[^a-zA-Z0-9]/, "A senha deve conter pelo menos um caractere especial (ex: !, @, #, $, etc.)."),
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "A confirmação da senha não coincide com a nova senha.",
  path: ["confirmPassword"],
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { token, password } = parsed.data;

    // Busca o token no banco
    const resetTokenRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetTokenRecord || !resetTokenRecord.approved || resetTokenRecord.expiresAt < new Date()) {
      return NextResponse.json({ error: "Token de recuperação inválido ou expirado." }, { status: 400 });
    }

    // Busca o usuário correspondente
    const user = await prisma.siteUser.findUnique({
      where: { email: resetTokenRecord.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    // Criptografa a nova senha
    const passwordHash = await hashPassword(password);

    // Atualiza a senha e reseta tentativas falhas de login (caso estivesse bloqueado)
    await prisma.$transaction([
      prisma.siteUser.update({
        where: { id: user.id },
        data: {
          passwordHash,
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      }),
      // Remove o token utilizado
      prisma.passwordResetToken.delete({
        where: { id: resetTokenRecord.id },
      }),
    ]);

    return NextResponse.json({
      message: "Senha redefinida com sucesso! Você já pode entrar com as novas credenciais.",
    });
  } catch (error) {
    console.error("Erro no reset-password API:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
