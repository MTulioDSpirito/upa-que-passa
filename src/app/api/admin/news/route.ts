import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  readAdminNews,
  writeAdminNews,
  getMergedAdminNews,
  mapNews,
} from "@/lib/adminNews";
import { NewsArticle } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const newsSchema = z.object({
  title: z.string().trim().min(1, "Título é obrigatório."),
  slug: z.string().trim().min(1, "Slug é obrigatório."),
  excerpt: z.string().trim().min(1, "Resumo é obrigatório."),
  content: z.string().trim().min(1, "Conteúdo é obrigatório."),
  cover: z.string().trim().min(1, "URL da imagem de capa é obrigatória."),
  author: z.string().trim().min(1, "Autor é obrigatório."),
  publishedAt: z.string().trim().min(1, "Data de publicação é obrigatória."),
  category: z.string().trim().min(1, "Categoria é obrigatória."),
  tags: z.array(z.string()).catch([]),
  imageCredits: z.string().optional().nullable().catch(null),
  fontes: z.string().optional().nullable().catch(null),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  const news = await getMergedAdminNews();
  return NextResponse.json({ news });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = newsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Dados inválidos." },
        { status: 400 }
      );
    }

    const dynamicNews = await readAdminNews();
    const newArticle: NewsArticle = {
      id: `admin-news-${Date.now()}`,
      views: 0,
      likes: 0,
      ...parsed.data,
      imageCredits: parsed.data.imageCredits || undefined,
      fontes: parsed.data.fontes || undefined,
    };

    dynamicNews.push(newArticle);
    await writeAdminNews(dynamicNews);

    return NextResponse.json({ news: newArticle }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar notícia:", error);
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
      return NextResponse.json({ error: "ID da notícia inválido." }, { status: 400 });
    }

    const parsed = newsSchema.safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Dados inválidos." },
        { status: 400 }
      );
    }

    const existing = await prisma.newsArticle.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Notícia não encontrada." }, { status: 404 });
    }

    const dbArticle = await prisma.newsArticle.update({
      where: { id },
      data: {
        ...parsed.data,
        imageCredits: parsed.data.imageCredits || null,
        fontes: parsed.data.fontes || null,
      },
    });

    return NextResponse.json({ news: mapNews(dbArticle) });
  } catch (error) {
    console.error("Erro ao atualizar notícia:", error);
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

    const existing = await prisma.newsArticle.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ error: "Notícia não encontrada." }, { status: 404 });
    }
    await prisma.newsArticle.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao excluir notícia:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
