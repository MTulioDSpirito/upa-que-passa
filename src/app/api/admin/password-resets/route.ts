import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import crypto from "crypto";

// GET: List all password reset requests (active, pending, and approved)
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminSession(["DEVELOPER"]);
    if (auth instanceof NextResponse) return auth;

    const resets = await prisma.passwordResetToken.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ resets });
  } catch (error) {
    console.error("Erro ao buscar solicitações de senha:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}

// POST: Approve a request, generating the final token and expiration
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminSession(["DEVELOPER"]);
    if (auth instanceof NextResponse) return auth;

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID da solicitação é obrigatório." }, { status: 400 });
    }

    // Busca o registro atual
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { id },
    });

    if (!resetRecord) {
      return NextResponse.json({ error: "Solicitação não encontrada." }, { status: 404 });
    }

    // Verifica se o usuário de fato existe no banco
    const userExists = await prisma.siteUser.findUnique({
      where: { email: resetRecord.email },
    });

    if (!userExists) {
      return NextResponse.json({ error: "O e-mail cadastrado nesta solicitação não foi encontrado na base de dados de usuários." }, { status: 400 });
    }

    // Gera o token final e define validade para 1 hora
    const finalToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    const updatedRecord = await prisma.passwordResetToken.update({
      where: { id },
      data: {
        token: finalToken,
        expiresAt,
        approved: true,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetLink = `${appUrl}/redefinir-senha?token=${finalToken}`;

    return NextResponse.json({
      message: "Solicitação aprovada com sucesso!",
      resetLink,
      resetRecord: updatedRecord,
    });
  } catch (error) {
    console.error("Erro ao aprovar solicitação de senha:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}

// DELETE: Cancel/delete a request
export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAdminSession(["DEVELOPER"]);
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório." }, { status: 400 });
    }

    await prisma.passwordResetToken.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Solicitação excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir solicitação de senha:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}

