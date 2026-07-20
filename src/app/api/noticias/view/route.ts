import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId } = body;
    if (!articleId) {
      return NextResponse.json({ error: "articleId é obrigatório." }, { status: 400 });
    }

    const article = await prisma.newsArticle.update({
      where: { id: articleId },
      data: { views: { increment: 1 } },
      select: { views: true },
    });

    return NextResponse.json({ views: article.views });
  } catch (error: any) {
    console.error("Erro ao incrementar views:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
