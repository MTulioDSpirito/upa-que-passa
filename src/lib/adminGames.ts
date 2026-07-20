import { prisma } from "./prisma";
import { Game } from "./types";

export async function readAdminGames(): Promise<Game[]> {
  const dbGames = await prisma.game.findMany({
    orderBy: { createdAt: "desc" }
  });
  return dbGames.map((g) => ({
    id: g.id,
    slug: g.slug,
    title: g.title,
    cover: g.cover,
    trailer: g.trailer ?? undefined,
    gallery: g.gallery,
    description: g.description,
    synopsis: g.synopsis,
    developer: g.developer,
    publisher: g.publisher,
    engine: g.engine ?? undefined,
    releaseDate: g.releaseDate,
    suggestedPrice: g.suggestedPrice,
    platforms: g.platforms,
    genres: g.genres,
    avgPlayTime: g.avgPlayTime ?? undefined,
    online: g.online,
    offline: g.offline,
    maxPlayers: g.maxPlayers,
    languages: g.languages,
    subtitles: g.subtitles,
    dubbing: g.dubbing,
    ageRating: g.ageRating,
    links: (g.links as any) || [],
    metacriticScore: g.metacriticScore ?? undefined,
    openCriticScore: g.openCriticScore ?? undefined,
    userScore: g.userScore,
    adminScore: g.adminScore ?? undefined,
    siteScores: (g.siteScores as any) || [],
    worldAvg: g.worldAvg ?? undefined,
    featured: g.featured,
    tags: g.tags,
  }));
}

export async function writeAdminGames(games: Game[]): Promise<void> {
  for (const g of games) {
    await prisma.game.upsert({
      where: { id: g.id },
      update: {
        slug: g.slug,
        title: g.title,
        cover: g.cover,
        trailer: g.trailer ?? null,
        gallery: g.gallery,
        description: g.description,
        synopsis: g.synopsis,
        developer: g.developer,
        publisher: g.publisher,
        engine: g.engine ?? null,
        releaseDate: g.releaseDate,
        suggestedPrice: g.suggestedPrice,
        platforms: g.platforms,
        genres: g.genres,
        avgPlayTime: g.avgPlayTime ?? null,
        online: g.online,
        offline: g.offline,
        maxPlayers: g.maxPlayers,
        languages: g.languages,
        subtitles: g.subtitles,
        dubbing: g.dubbing,
        ageRating: g.ageRating,
        links: (g.links as any) || [],
        metacriticScore: g.metacriticScore ?? null,
        openCriticScore: g.openCriticScore ?? null,
        userScore: g.userScore,
        adminScore: g.adminScore ?? null,
        siteScores: (g.siteScores as any) || [],
        worldAvg: g.worldAvg ?? null,
        featured: g.featured ?? false,
        tags: g.tags || [],
      },
      create: {
        id: g.id,
        slug: g.slug,
        title: g.title,
        cover: g.cover,
        trailer: g.trailer ?? null,
        gallery: g.gallery,
        description: g.description,
        synopsis: g.synopsis,
        developer: g.developer,
        publisher: g.publisher,
        engine: g.engine ?? null,
        releaseDate: g.releaseDate,
        suggestedPrice: g.suggestedPrice,
        platforms: g.platforms,
        genres: g.genres,
        avgPlayTime: g.avgPlayTime ?? null,
        online: g.online,
        offline: g.offline,
        maxPlayers: g.maxPlayers,
        languages: g.languages,
        subtitles: g.subtitles,
        dubbing: g.dubbing,
        ageRating: g.ageRating,
        links: (g.links as any) || [],
        metacriticScore: g.metacriticScore ?? null,
        openCriticScore: g.openCriticScore ?? null,
        userScore: g.userScore,
        adminScore: g.adminScore ?? null,
        siteScores: (g.siteScores as any) || [],
        worldAvg: g.worldAvg ?? null,
        featured: g.featured ?? false,
        tags: g.tags || [],
      }
    });
  }
}

export async function appendAdminGame(game: Game): Promise<void> {
  await writeAdminGames([game]);
}
