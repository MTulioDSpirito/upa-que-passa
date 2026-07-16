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
  for (const r of reviews) {
    // Garantir que o jogo correspondente existe no banco de dados para respeitar a chave estrangeira
    const gameExists = await prisma.game.findUnique({ where: { id: r.gameId } });
    if (!gameExists) {
      await prisma.game.create({
        data: {
          id: r.gameId,
          slug: `game-${r.gameId}`,
          title: `Jogo de Review ${r.gameId}`,
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

    await prisma.review.upsert({
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
    });
  }
}

export async function appendAdminReview(review: Review): Promise<void> {
  await writeAdminReviews([review]);
}
