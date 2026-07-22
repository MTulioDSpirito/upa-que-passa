import { prisma } from "./prisma";
import { Review } from "./types";

export async function readAdminReviews(): Promise<Review[]> {
  const dbReviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" }
  });
  return dbReviews.map((r) => ({
    id: r.id,
    gameId: r.gameId,
    title: r.title,
    text: r.text,
    pros: r.pros,
    cons: r.cons,
    conclusion: r.conclusion,
    scores: (r.scores as any) || {},
    overallScore: r.overallScore,
    author: r.author,
    publishedAt: r.publishedAt,
    likes: r.likes,
    imageCredits: r.imageCredits ?? undefined,
    featured: r.featured,
  }));
}

export async function writeAdminReviews(reviews: Review[]): Promise<void> {
  if (reviews.length === 0) return;

  const gameIds = Array.from(new Set(reviews.map((r) => r.gameId)));
  
  // Buscar em lote quais jogos já existem
  const existingGames = await prisma.game.findMany({
    where: { id: { in: gameIds } },
    select: { id: true }
  });
  
  const existingGameIds = new Set(existingGames.map((g) => g.id));
  
  // Criar em lote ou sequencial apenas os jogos ausentes
  for (const gameId of gameIds) {
    if (!existingGameIds.has(gameId)) {
      await prisma.game.create({
        data: {
          id: gameId,
          slug: `game-${gameId}`,
          title: `Jogo de Review ${gameId}`,
          cover: "",
          description: "",
          synopsis: "",
          developer: "Desconhecido",
          publisher: "Desconhecido",
          releaseDate: "",
          suggestedPrice: 0,
          platforms: ["PS5"],
          genres: ["Ação"],
          online: false,
          offline: true,
          maxPlayers: 1,
          languages: [],
          subtitles: [],
          dubbing: [],
          ageRating: "L",
          links: [],
          userScore: 0,
          siteScores: [],
        }
      });
    }
  }

  // Executar upserts das reviews em uma transação do Prisma
  await prisma.$transaction(
    reviews.map((r) =>
      prisma.review.upsert({
        where: { id: r.id },
        update: {
          gameId: r.gameId,
          title: r.title,
          text: r.text,
          pros: r.pros || [],
          cons: r.cons || [],
          conclusion: r.conclusion || "",
          scores: (r.scores as any) || {},
          overallScore: r.overallScore,
          author: r.author,
          publishedAt: r.publishedAt,
          likes: r.likes,
          imageCredits: r.imageCredits || null,
          featured: r.featured ?? false,
        },
        create: {
          id: r.id,
          gameId: r.gameId,
          title: r.title,
          text: r.text,
          pros: r.pros || [],
          cons: r.cons || [],
          conclusion: r.conclusion || "",
          scores: (r.scores as any) || {},
          overallScore: r.overallScore,
          author: r.author,
          publishedAt: r.publishedAt,
          likes: r.likes,
          imageCredits: r.imageCredits || null,
          featured: r.featured ?? false,
        }
      })
    )
  );
}

export async function appendAdminReview(review: Review): Promise<void> {
  await writeAdminReviews([review]);
}
