import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido."),
});

const CLEANUP_PROBABILITY = 0.01; // ~1% das requisições disparam a limpeza

// Tokens expirados de outros e-mails (nunca aprovados/usados) não são varridos
// em lugar nenhum além do próprio e-mail que os criou; sem cron neste projeto,
// a limpeza acontece oportunisticamente numa fração pequena das requisições.
async function cleanupExpiredTokens() {
  if (Math.random() >= CLEANUP_PROBABILITY) return;
  try {
    await prisma.passwordResetToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  } catch (error) {
    console.error("Erro ao limpar PasswordResetToken expirado:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await cleanupExpiredTokens();

    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { email } = parsed.data;
    const cleanEmail = email.toLowerCase().trim();

    // Busca o usuário correspondente
    const user = await prisma.siteUser.findUnique({
      where: { email: cleanEmail },
    });

    // Se o usuário não existir, retornamos sucesso de qualquer forma para evitar Account Enumeration
    if (!user) {
      return NextResponse.json({
        message: "Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.",
      });
    }

    // Limpa tokens antigos para este e-mail
    await prisma.passwordResetToken.deleteMany({
      where: { email: cleanEmail },
    });

    // Cria uma nova solicitação de recuperação pendente de aprovação
    const tempToken = `pending-${crypto.randomUUID()}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas para o admin aprovar

    await prisma.passwordResetToken.create({
      data: {
        email: cleanEmail,
        token: tempToken,
        expiresAt,
        approved: false,
      },
    });

    // Exibe no console para desenvolvimento/admin log
    console.log("\n========================================================");
    console.log(`🔑 RECUPERAÇÃO DE SENHA SOLICITADA PARA: ${cleanEmail}`);
    console.log(`👉 Solicitação pendente de aprovação no Painel Admin.`);
    console.log("========================================================\n");

    return NextResponse.json({
      message: "Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.",
    });
  } catch (error) {
    console.error("Erro no forgot-password API:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
