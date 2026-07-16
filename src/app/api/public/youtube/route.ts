import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const videos = await prisma.youtubeVideo.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    });
    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Erro ao carregar vídeos do Youtube:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
