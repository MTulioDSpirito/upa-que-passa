import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  // Check role is DEVELOPER
  if (session.role !== "DEVELOPER") {
    return NextResponse.json(
      { error: "Acesso negado. Apenas desenvolvedores podem alterar o destaque." },
      { status: 403 }
    );
  }

  try {
    const { reviewId } = await request.json();
    if (!reviewId || typeof reviewId !== "string") {
      return NextResponse.json({ error: "ID da review inválido." }, { status: 400 });
    }

    // Use a transaction to reset all to false and set the chosen one to true
    await prisma.$transaction([
      prisma.review.updateMany({
        data: { featured: false },
      }),
      prisma.review.update({
        where: { id: reviewId },
        data: { featured: true },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao definir review em destaque:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
