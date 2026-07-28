import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Janela de "cooldown": o mesmo IP só incrementa a view de um mesmo artigo de novo
// depois desse tempo, para dificultar inflar o contador com um script simples.
const VIEW_COOLDOWN_MS = 30 * 60 * 1000; // 30 minutos
const RETENTION_MS = 90 * 24 * 60 * 60 * 1000; // 90 dias
const CLEANUP_PROBABILITY = 0.01; // ~1% das requisições disparam a limpeza

function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

// ArticleViewLog cresce indefinidamente (1 linha por IP único por artigo);
// não há cron neste projeto, então a limpeza acontece oportunisticamente
// numa fração pequena das requisições em vez de rodar toda vez.
async function cleanupOldViewLogs() {
  if (Math.random() >= CLEANUP_PROBABILITY) return;
  try {
    await prisma.articleViewLog.deleteMany({
      where: { viewedAt: { lt: new Date(Date.now() - RETENTION_MS) } },
    });
  } catch (error) {
    console.error("Erro ao limpar ArticleViewLog antigo:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId } = body;
    if (!articleId || typeof articleId !== "string") {
      return NextResponse.json({ error: "articleId é obrigatório." }, { status: 400 });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const ipHash = hashIp(ip);

    await cleanupOldViewLogs();

    const existingLog = await prisma.articleViewLog.findUnique({
      where: { articleId_ipHash: { articleId, ipHash } },
    });

    const cooldownExpired =
      !existingLog || Date.now() - existingLog.viewedAt.getTime() > VIEW_COOLDOWN_MS;

    if (!cooldownExpired) {
      const article = await prisma.newsArticle.findUnique({
        where: { id: articleId },
        select: { views: true },
      });
      return NextResponse.json({ views: article?.views ?? 0 });
    }

    const [article] = await prisma.$transaction([
      prisma.newsArticle.update({
        where: { id: articleId },
        data: { views: { increment: 1 } },
        select: { views: true },
      }),
      prisma.articleViewLog.upsert({
        where: { articleId_ipHash: { articleId, ipHash } },
        update: { viewedAt: new Date() },
        create: { articleId, ipHash },
      }),
    ]);

    return NextResponse.json({ views: article.views });
  } catch (error: any) {
    console.error("Erro ao incrementar views:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
