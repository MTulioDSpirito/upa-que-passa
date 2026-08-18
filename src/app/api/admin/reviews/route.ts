import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readAdminReviews, writeAdminReviews, mapReview } from "@/lib/adminReviews";
import { Review } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

async function syncGameAdminScore(gameId: string, score: number | undefined) {
  try {
    let adminScore = null;
    if (score !== undefined) {
      adminScore = score;
    } else {
      const remainingReview = await prisma.review.findFirst({
        where: { gameId },
        orderBy: { createdAt: "desc" }
      });
      if (remainingReview) {
        adminScore = remainingReview.overallScore;
      }
    }
    await prisma.game.update({ where: { id: gameId }, data: { adminScore } });
  } catch (err) {
    console.error("Failed to sync game admin score:", err);
  }
}

const scoresSchema = z.object({
  graphics: z.number().min(0).max(10).catch(8),
  gameplay: z.number().min(0).max(10).catch(8),
  fun: z.number().min(0).max(10).catch(8),
  story: z.number().min(0).max(10).catch(8),
  soundtrack: z.number().min(0).max(10).catch(8),
  performance: z.number().min(0).max(10).catch(8),
  replay: z.number().min(0).max(10).catch(8),
  multiplayer: z.number().min(0).max(10).catch(0),
  difficulty: z.number().min(0).max(10).catch(0),
  visual: z.number().min(0).max(10).catch(0),
  ai: z.number().min(0).max(10).catch(0),
  optimization: z.number().min(0).max(10).catch(0),
  content: z.number().min(0).max(10).catch(0),
});

const reviewSchema = z.object({
  gameId: z.string().min(1, "Selecione o jogo."),
  title: z.string().trim().min(1, "Título é obrigatório."),
  text: z.string().trim().min(1, "Texto da análise é obrigatório."),
  pros: z.array(z.string()).catch([]),
  cons: z.array(z.string()).catch([]),
  conclusion: z.string().trim().min(1, "Conclusão é obrigatória."),
  scores: scoresSchema,
  overallScore: z.number().min(0).max(10),
  author: z.string().trim().min(1, "Autor é obrigatório."),
  publishedAt: z.string().trim().min(1, "Data de publicação é obrigatória."),
  imageCredits: z.string().optional().nullable().catch(null),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  const reviews = await readAdminReviews();
  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Dados inválidos." },
        { status: 400 }
      );
    }

    const reviews = await readAdminReviews();
    const newReview: Review = {
      id: `admin-review-${Date.now()}`,
      likes: 0,
      ...parsed.data,
      imageCredits: parsed.data.imageCredits || undefined,
    };

    reviews.push(newReview);
    await writeAdminReviews(reviews);

    // Sync game score
    await syncGameAdminScore(newReview.gameId, newReview.overallScore);

    return NextResponse.json({ review: newReview }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar review:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...rest } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "ID do jogo inválido." }, { status: 400 });
    }

    const parsed = reviewSchema.safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Dados inválidos." },
        { status: 400 }
      );
    }

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Review não encontrada." }, { status: 404 });
    }

    const dbReview = await prisma.review.update({
      where: { id },
      data: {
        ...parsed.data,
        imageCredits: parsed.data.imageCredits || null,
      },
    });

    // Sync game score
    await syncGameAdminScore(dbReview.gameId, dbReview.overallScore);

    return NextResponse.json({ review: mapReview(dbReview) });
  } catch (error) {
    console.error("Erro ao atualizar review:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const existing = await prisma.review.findUnique({ where: { id }, select: { gameId: true } });
    if (!existing) {
      return NextResponse.json({ error: "Review não encontrada." }, { status: 404 });
    }

    await prisma.review.delete({ where: { id } });

    // Sync game score (revert to fallback)
    await syncGameAdminScore(existing.gameId, undefined);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao excluir review:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
