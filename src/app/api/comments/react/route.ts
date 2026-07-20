import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json();
  const { commentId, type } = body; // type is either "LIKE" or "DISLIKE"

  if (!commentId) {
    return NextResponse.json({ error: "commentId é obrigatório." }, { status: 400 });
  }
  if (type !== "LIKE" && type !== "DISLIKE") {
    return NextResponse.json({ error: "Tipo de reação inválido (deve ser LIKE ou DISLIKE)." }, { status: 400 });
  }

  // Check if comment exists
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });
  if (!comment) {
    return NextResponse.json({ error: "Comentário não encontrado." }, { status: 404 });
  }

  const existingReaction = await prisma.commentReaction.findUnique({
    where: { userId_commentId: { userId: session.sub, commentId } },
  });

  if (existingReaction) {
    if (existingReaction.type === type) {
      // User is toggling their reaction off
      await prisma.commentReaction.delete({
        where: { id: existingReaction.id },
      });
    } else {
      // User is switching their reaction type (e.g. from LIKE to DISLIKE)
      await prisma.commentReaction.update({
        where: { id: existingReaction.id },
        data: { type },
      });
    }
  } else {
    // New reaction
    await prisma.commentReaction.create({
      data: {
        userId: session.sub,
        commentId,
        type,
      },
    });
  }

  // Fetch updated counts
  const reactions = await prisma.commentReaction.findMany({
    where: { commentId },
  });

  const likes = reactions.filter((r) => r.type === "LIKE").length;
  const dislikes = reactions.filter((r) => r.type === "DISLIKE").length;

  const userReaction = reactions.find((r) => r.userId === session.sub);
  const userReactionType = userReaction ? userReaction.type : null;

  return NextResponse.json({ likes, dislikes, userReactionType });
}
