import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { z } from "zod";
import { AprovarSugestaoService, UserNotFoundError, SugestaoNotFoundError } from "@/core/services/AprovarSugestaoService";
import { PrismaAdminUserRepository } from "@/infrastructure/repositories/PrismaAdminUserRepository";
import { PrismaSugestaoRepository } from "@/infrastructure/repositories/PrismaSugestaoRepository";
import { NewsPublisher, ReviewPublisher, LaunchPublisher } from "@/core/publishers";

const aprovarSchema = z.object({
  id: z.string({ message: "ID inválido." }),
  titulo: z.string().optional().nullable(),
  slug: z.string().optional().nullable(),
  fontes: z.union([z.string(), z.array(z.string())]).optional().nullable(),
  payload: z.unknown().optional().nullable(),
});

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = aprovarSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  const { id, titulo, slug, fontes, payload } = parsed.data;

  try {
    const service = new AprovarSugestaoService(
      new PrismaAdminUserRepository(),
      new PrismaSugestaoRepository(),
      {
        NOTICIA: new NewsPublisher(),
        REVIEW: new ReviewPublisher(),
        LANCAMENTO: new LaunchPublisher(),
      }
    );

    await service.execute({
      id,
      email: session.email,
      titulo,
      slug,
      fontes,
      payload,
    });

  } catch (error: any) {
    console.error("Erro ao aprovar sugestão:", error);
    if (error instanceof UserNotFoundError) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }
    if (error instanceof SugestaoNotFoundError) {
      return NextResponse.json({ error: "Sugestão não encontrada." }, { status: 404 });
    }
    return NextResponse.json({ error: "Não foi possível aprovar a sugestão." }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}
