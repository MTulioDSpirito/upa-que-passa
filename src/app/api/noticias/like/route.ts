import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get("articleId");
  if (!articleId) {
    return NextResponse.json({ error: "articleId é obrigatório." }, { status: 400 });
  }

  const session = await getUserSession();
  let liked = false;

  if (session) {
    const existing = await prisma.newsLike.findUnique({
      where: { userId_articleId: { userId: session.sub, articleId } },
    });
    liked = !!existing;
  }

  const article = await prisma.newsArticle.findUnique({
    where: { id: articleId },
    select: { likes: true },
  });

  return NextResponse.json({ liked, likesCount: article?.likes ?? 0 });
}

export async function POST(request: NextRequest) {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json();
  const { articleId } = body;
  if (!articleId) {
    return NextResponse.json({ error: "articleId é obrigatório." }, { status: 400 });
  }

  const existing = await prisma.newsLike.findUnique({
    where: { userId_articleId: { userId: session.sub, articleId } },
  });

  let liked = false;
  let likesDiff = 0;

  if (existing) {
    await prisma.newsLike.delete({ where: { id: existing.id } });
    likesDiff = -1;
  } else {
    await prisma.newsLike.create({ data: { userId: session.sub, articleId } });
    liked = true;
    likesDiff = 1;
  }

  const article = await prisma.newsArticle.update({
    where: { id: articleId },
    data: { likes: { increment: likesDiff } },
    select: { likes: true },
  });

  return NextResponse.json({ liked, likesCount: article.likes });
}
