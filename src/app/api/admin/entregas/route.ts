import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const criarSchema = z.object({
  tipo: z.enum(["NOTICIA", "REVIEW", "LANCAMENTO"]),
  criador: z.enum(["KAI_REPORTER", "NINA_CORRESPONDENTE", "MILO_LANCAMENTOS", "THEO_REVIEWS", "VERA_NOTAS"]),
  titulo: z.string().trim().min(1, "Título é obrigatório."),
  slug: z.string().trim().min(1, "Slug é obrigatório."),
  payload: z.unknown(),
  fontes: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((v) => (Array.isArray(v) ? v : v ? [v] : [])),
});

// Cria uma sugestão PENDING na fila de revisão (/admin/sugestoes). É o que permite
// os agentes mandarem conteúdo direto pra fila de PRODUÇÃO sem precisar da
// DATABASE_URL secreta — eles autenticam e postam aqui. Dedup por slug+tipo: se já
// existe uma sugestão PENDING ou APPROVED com o mesmo slug/tipo, não duplica.
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const parsed = criarSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Dados inválidos." },
        { status: 400 }
      );
    }
    const { tipo, criador, titulo, slug, payload, fontes } = parsed.data;

    const jaExiste = await prisma.sugestaoAgente.findFirst({
      where: { slug, tipo, status: { in: ["PENDING", "APPROVED"] } },
      select: { id: true, status: true },
    });
    if (jaExiste) {
      return NextResponse.json({ skipped: true, motivo: "slug já na fila/publicado", id: jaExiste.id });
    }

    const sugestao = await prisma.sugestaoAgente.create({
      data: {
        tipo,
        criador,
        titulo,
        slug,
        payload: payload as object,
        fontes,
        status: "PENDING",
      },
      select: { id: true },
    });

    return NextResponse.json({ id: sugestao.id }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar sugestão:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const include = {
    revisadoPor: {
      select: {
        name: true,
      },
    },
  } as const;

  const [pendentes, aprovados, rejeitados] = await Promise.all([
    prisma.sugestaoAgente.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include,
    }),
    prisma.sugestaoAgente.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 100,
      include,
    }),
    prisma.sugestaoAgente.findMany({
      where: { status: "REJECTED" },
      orderBy: { createdAt: "desc" },
      take: 100,
      include,
    }),
  ]);

  return NextResponse.json({ pendentes, aprovados, rejeitados });
}
