import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readAdminGames, appendAdminGame, mapGame } from "@/lib/adminGames";
import { Game } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { isSafeImageUrl } from "@/lib/safeUrl";

function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");
  const tab = searchParams.get("tab") || "all";

  if (!pageParam) {
    const dbGames = await prisma.game.findMany({
      orderBy: [
        { releaseDate: "desc" },
        { createdAt: "desc" }
      ]
    });
    const games = dbGames.map(mapGame);
    return NextResponse.json({ games }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30"
      }
    });
  }

  const page = parseInt(pageParam, 10) || 1;
  const limit = parseInt(limitParam || "12", 10) || 12;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (search.trim()) {
    where.title = {
      contains: search,
      mode: "insensitive",
    };
  }

  const now = new Date().toISOString();
  if (tab === "upcoming") {
    const todayStr = now.split("T")[0];
    where.releaseDate = {
      gt: todayStr,
    };
  } else if (tab === "recent") {
    const todayStr = now.split("T")[0];
    const recentCutoffStr = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    where.releaseDate = {
      lte: todayStr,
      gte: recentCutoffStr,
    };
  }

  const [total, dbGames] = await Promise.all([
    prisma.game.count({ where }),
    prisma.game.findMany({
      where,
      orderBy: [
        { releaseDate: "desc" },
        { createdAt: "desc" }
      ],
      skip,
      take: limit,
    })
  ]);

  const games = dbGames.map(mapGame);

  return NextResponse.json({
    games,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  });
}

import { z } from "zod";

const gameSchema = z.object({
  title: z.string().trim().catch(""),
  cover: z.string().trim().catch(""),
  developer: z.string().trim().catch(""),
  publisher: z.string().trim().catch(""),
  releaseDate: z.string().trim().catch(""),
  synopsis: z.string().trim().catch(""),
  genres: z.array(z.string()).catch([]),
  platforms: z.array(z.string()).catch([]),
  suggestedPrice: z.coerce.number().catch(0),
  trailer: z.string().trim().catch(""),
  gallery: z.array(z.string()).catch([]),
  description: z.string().trim().catch(""),
  metacriticScore: z.coerce.number().optional().nullable().catch(null),
  ageRating: z.string().trim().catch("L"),
  avgPlayTime: z.string().trim().optional().nullable().catch(null),
  online: z.boolean().catch(false),
  offline: z.boolean().catch(true),
  maxPlayers: z.coerce.number().catch(1),
  languages: z.array(z.string()).catch([]),
  subtitles: z.array(z.string()).catch([]),
  dubbing: z.array(z.string()).catch([]),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = gameSchema.safeParse(body);

  if (
    !parsed.success ||
    !parsed.data.title ||
    !parsed.data.cover ||
    !parsed.data.developer ||
    !parsed.data.releaseDate ||
    parsed.data.genres.length === 0 ||
    parsed.data.platforms.length === 0
  ) {
    return NextResponse.json(
      { error: "Preencha título, capa, desenvolvedora, data de lançamento, gêneros e plataformas." },
      { status: 400 }
    );
  }

  const {
    title, cover, developer, publisher, releaseDate, synopsis, genres, platforms, suggestedPrice,
    trailer, gallery, description, metacriticScore,
    ageRating, avgPlayTime, online, offline, maxPlayers, languages, subtitles, dubbing
  } = parsed.data;

  if (!(await isSafeImageUrl(cover))) {
    return NextResponse.json(
      { error: "URL da capa inválida — só são aceitos links http(s) para hosts públicos." },
      { status: 400 }
    );
  }

  if (!cover.startsWith("/")) {
    try {
      const imgRes = await fetch(cover, { method: "HEAD" });
      if (!imgRes.ok) {
        return NextResponse.json(
          { error: `A URL da capa retornou HTTP ${imgRes.status} — não é uma imagem válida.` },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Não foi possível acessar a URL da capa. Verifique o link antes de salvar." },
        { status: 400 }
      );
    }
  }

  const existing = await readAdminGames();
  const baseSlug = slugify(title);
  const slugTaken = (s: string) => existing.some((g) => g.slug === s);
  const slug = slugTaken(baseSlug) ? `${baseSlug}-${Date.now()}` : baseSlug;

  const siteScores = metacriticScore
    ? [{ site: "Metacritic", score: metacriticScore }]
    : [];
  const worldAvg = metacriticScore ? metacriticScore / 10 : undefined;

  const game: Game = {
    id: `admin-${Date.now()}`,
    slug,
    title,
    cover,
    trailer: trailer || undefined,
    gallery: gallery && gallery.length > 0 ? gallery : [cover],
    description: description || `${title} foi adicionado ao catálogo pela equipe de conteúdo do Upa que Passa.`,
    synopsis: synopsis || `${title} é um jogo desenvolvido por ${developer}.`,
    developer,
    publisher: publisher || developer,
    releaseDate,
    suggestedPrice,
    platforms,
    genres,
    online,
    offline,
    maxPlayers,
    languages,
    subtitles,
    dubbing,
    ageRating,
    links: [],
    userScore: 0,
    adminScore: worldAvg,
    metacriticScore: metacriticScore || undefined,
    siteScores,
    worldAvg,
  };

  await appendAdminGame(game);

  return NextResponse.json({ game }, { status: 201 });
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

    const parsed = gameSchema.safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Dados inválidos." },
        { status: 400 }
      );
    }

    const {
      title, cover, developer, publisher, releaseDate, synopsis, genres, platforms, suggestedPrice,
      trailer, gallery, description, metacriticScore,
      ageRating, avgPlayTime, online, offline, maxPlayers, languages, subtitles, dubbing
    } = parsed.data;

    const existing = await prisma.game.findUnique({
      where: { id },
      select: { description: true, synopsis: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Jogo não encontrado." }, { status: 404 });
    }

    const siteScores = metacriticScore
      ? [{ site: "Metacritic", score: metacriticScore }]
      : [];
    const worldAvg = metacriticScore ? metacriticScore / 10 : undefined;

    const dbGame = await prisma.game.update({
      where: { id },
      data: {
        title,
        cover,
        developer,
        publisher: publisher || developer,
        releaseDate,
        suggestedPrice,
        platforms,
        genres,
        trailer: trailer || null,
        gallery: gallery && gallery.length > 0 ? gallery : [cover],
        description: description || existing.description,
        synopsis: synopsis || existing.synopsis,
        metacriticScore: metacriticScore || null,
        siteScores,
        worldAvg: worldAvg ?? null,
        ageRating,
        avgPlayTime,
        online,
        offline,
        maxPlayers,
        languages,
        subtitles,
        dubbing,
      },
    });

    return NextResponse.json({ game: mapGame(dbGame) });
  } catch (error) {
    console.error("Erro ao atualizar jogo:", error);
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
      return NextResponse.json({ error: "ID do jogo inválido." }, { status: 400 });
    }

    // Verificar se o jogo possui reviews associadas
    const reviewCount = await prisma.review.count({
      where: { gameId: id }
    });

    if (reviewCount > 0) {
      return NextResponse.json({
        error: "Este jogo possui uma review associada e não pode ser excluído para não quebrar a review. Ele sumirá automaticamente dos lançamentos recentes por causa da data."
      }, { status: 400 });
    }

    // Deletar favoritos associados
    await prisma.favorite.deleteMany({
      where: { gameId: id }
    });

    // Deletar o jogo
    await prisma.game.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar jogo:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
