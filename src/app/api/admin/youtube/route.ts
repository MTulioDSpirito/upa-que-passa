import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const youtubeVideoSchema = z.object({
  title: z.string().trim().min(1, "Título é obrigatório."),
  videoUrl: z.string().trim().url("Link do vídeo inválido."),
  thumbnail: z.string().trim().min(1, "URL da thumbnail é obrigatória."),
  duration: z.string().trim().min(1, "Duração é obrigatória."),
  resolution: z.string().trim().min(1, "Resolução é obrigatória."),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const videos = await prisma.youtubeVideo.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Erro ao listar vídeos do Youtube:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = youtubeVideoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Dados inválidos." },
        { status: 400 }
      );
    }

    const video = await prisma.youtubeVideo.create({
      data: parsed.data,
    });

    return NextResponse.json({ video }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar vídeo do Youtube:", error);
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
      return NextResponse.json({ error: "ID do vídeo inválido." }, { status: 400 });
    }

    const parsed = youtubeVideoSchema.safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Dados inválidos." },
        { status: 400 }
      );
    }

    const video = await prisma.youtubeVideo.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ video });
  } catch (error) {
    console.error("Erro ao atualizar vídeo do Youtube:", error);
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
      return NextResponse.json({ error: "ID do vídeo é obrigatório." }, { status: 400 });
    }

    await prisma.youtubeVideo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir vídeo do Youtube:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
