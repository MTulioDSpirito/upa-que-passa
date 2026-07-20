import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reviewId = searchParams.get("reviewId");
  if (!reviewId) {
    return NextResponse.json({ error: "reviewId é obrigatório." }, { status: 400 });
  }

  const session = await getUserSession();
  let liked = false;

  if (session) {
    const existing = await prisma.reviewLike.findUnique({
      where: { userId_reviewId: { userId: session.sub, reviewId } },
    });
    liked = !!existing;
  }

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { likes: true },
  });

  return NextResponse.json({ liked, likesCount: review?.likes ?? 0 });
}

export async function POST(request: NextRequest) {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json();
  const { reviewId } = body;
  if (!reviewId) {
    return NextResponse.json({ error: "reviewId é obrigatório." }, { status: 400 });
  }

  const existing = await prisma.reviewLike.findUnique({
    where: { userId_reviewId: { userId: session.sub, reviewId } },
  });

  let liked = false;
  let likesDiff = 0;

  if (existing) {
    await prisma.reviewLike.delete({ where: { id: existing.id } });
    likesDiff = -1;
  } else {
    await prisma.reviewLike.create({ data: { userId: session.sub, reviewId } });
    liked = true;
    likesDiff = 1;
  }

  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { likes: { increment: likesDiff } },
    select: { likes: true },
  });

  return NextResponse.json({ liked, likesCount: review.likes });
}
