import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get("gameId");
  if (!gameId) {
    return NextResponse.json({ error: "gameId é obrigatório." }, { status: 400 });
  }

  const session = await getUserSession();
  const userId = session?.sub;

  const comments = await prisma.comment.findMany({
    where: { gameId },
    orderBy: { createdAt: "desc" },
    include: {
      reactions: true,
    },
  });

  // Calculate average score
  const scores = comments.map((c) => c.score);
  const avgScore = scores.length > 0 ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)) : 0.0;

  // Format comments to include like/dislike counts and whether the current user liked/disliked them
  const formattedComments = comments.map((comment) => {
    const likes = comment.reactions.filter((r) => r.type === "LIKE").length;
    const dislikes = comment.reactions.filter((r) => r.type === "DISLIKE").length;

    let userReactionType: string | null = null;
    if (userId) {
      const match = comment.reactions.find((r) => r.userId === userId);
      if (match) {
        userReactionType = match.type; // "LIKE" or "DISLIKE"
      }
    }

    return {
      id: comment.id,
      userId: comment.userId,
      userNickname: comment.userNickname,
      userAvatar: comment.userAvatar,
      text: comment.text,
      score: comment.score,
      createdAt: comment.createdAt,
      likes,
      dislikes,
      userReactionType,
    };
  });

  return NextResponse.json({ comments: formattedComments, averageScore: avgScore });
}

export async function POST(request: NextRequest) {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json();
  const { gameId, text, score } = body;

  if (!gameId) {
    return NextResponse.json({ error: "gameId é obrigatório." }, { status: 400 });
  }
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json({ error: "O comentário não pode ser vazio." }, { status: 400 });
  }
  if (text.length > 500) {
    return NextResponse.json({ error: "O comentário ultrapassou o limite de 500 caracteres." }, { status: 400 });
  }
  
  const parsedScore = parseFloat(score);
  if (isNaN(parsedScore) || parsedScore < 1 || parsedScore > 10) {
    return NextResponse.json({ error: "A nota deve ser um valor entre 1 e 10." }, { status: 400 });
  }

  // Get user details
  const user = await prisma.siteUser.findUnique({
    where: { id: session.sub },
    select: { nickname: true, avatar: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  // Check if user already commented on this game
  const existingComment = await prisma.comment.findFirst({
    where: { gameId, userId: session.sub },
  });

  if (existingComment) {
    return NextResponse.json({ error: "Você já avaliou este jogo. Apenas uma avaliação por usuário é permitida." }, { status: 400 });
  }

  // Create comment
  const newComment = await prisma.comment.create({
    data: {
      gameId,
      userId: session.sub,
      userNickname: user.nickname,
      userAvatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nickname}`,
      text: text.trim(),
      score: parsedScore,
    },
  });

  // Calculate new average and update Game model
  const allGameComments = await prisma.comment.findMany({
    where: { gameId },
    select: { score: true },
  });

  const sum = allGameComments.reduce((acc, curr) => acc + curr.score, 0);
  const avg = parseFloat((sum / allGameComments.length).toFixed(1));

  await prisma.game.update({
    where: { id: gameId },
    data: { userScore: avg },
  });

  return NextResponse.json({ comment: { ...newComment, likes: 0, dislikes: 0, userReactionType: null }, averageScore: avg });
}
