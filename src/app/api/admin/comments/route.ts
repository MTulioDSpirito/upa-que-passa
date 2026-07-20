import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

  const where: any = {};
  if (search.trim()) {
    where.OR = [
      { userNickname: { contains: search, mode: "insensitive" } },
      { text: { contains: search, mode: "insensitive" } },
      { game: { title: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (!pageParam) {
    const comments = await prisma.comment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        game: {
          select: {
            title: true,
          },
        },
      },
    });
    return NextResponse.json({ comments });
  }

  const page = parseInt(pageParam, 10) || 1;
  const limit = parseInt(limitParam || "10", 10) || 10;
  const skip = (page - 1) * limit;

  const [total, comments] = await Promise.all([
    prisma.comment.count({ where }),
    prisma.comment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        game: {
          select: {
            title: true,
          },
        },
      },
      skip,
      take: limit,
    })
  ]);

  return NextResponse.json({
    comments,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  });
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID é obrigatório." }, { status: 400 });
  }

  // Find comment first to know the gameId
  const comment = await prisma.comment.findUnique({
    where: { id },
    select: { gameId: true },
  });

  if (!comment) {
    return NextResponse.json({ error: "Comentário não encontrado." }, { status: 404 });
  }

  // Delete comment
  await prisma.comment.delete({
    where: { id },
  });

  // Recalculate game user score average
  const gameComments = await prisma.comment.findMany({
    where: { gameId: comment.gameId },
    select: { score: true },
  });

  let avg = 0.0;
  if (gameComments.length > 0) {
    const sum = gameComments.reduce((acc, curr) => acc + curr.score, 0);
    avg = parseFloat((sum / gameComments.length).toFixed(1));
  }

  await prisma.game.update({
    where: { id: comment.gameId },
    data: { userScore: avg },
  });

  return NextResponse.json({ success: true, averageScore: avg });
}
