import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { GAMES } from "./seed-data/games";
import { REVIEWS } from "./seed-data/reviews";
import { NEWS } from "./seed-data/news";
import { USERS } from "./seed-data/users";

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = "UpaQuePassa@2026";

const ADMINS = [
  { name: "André", email: "andre@upaquepassa.com.br", role: "COLABORADOR" as const, avatar: "/team/andre-abertura.png" },
  { name: "Capelli", email: "capelli@upaquepassa.com.br", role: "DEVELOPER" as const, avatar: "/team/cappeli-abertura.png" },
  { name: "Fael", email: "fael@upaquepassa.com.br", role: "COLABORADOR" as const, avatar: "/team/fae-abertura.png" },
  { name: "Ique", email: "ique@upaquepassa.com.br", role: "COLABORADOR" as const, avatar: "/team/ique-abertura.png" },
  { name: "Mateus", email: "mateus@upaquepassa.com.br", role: "COLABORADOR" as const, avatar: "/team/mateus-abertura.png" },
  { name: "Patrão", email: "patrao@upaquepassa.com.br", role: "COLABORADOR" as const, avatar: "/team/patrao-abertura.png" },
  { name: "inTúlio", email: "tulio@upaquepassa.com.br", role: "DEVELOPER" as const, avatar: "/team/tulio-abertura.png" },
];


async function main() {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  // 0. Limpar dados anteriores para evitar conflitos
  console.log("Limpando dados existentes...");
  await prisma.favorite.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.game.deleteMany({});
  await prisma.newsArticle.deleteMany({});
  await prisma.siteUser.deleteMany({});
  await prisma.youtubeVideo.deleteMany({});

  // 1. Seed Admin Users
  for (const admin of ADMINS) {
    await prisma.adminUser.upsert({
      where: { email: admin.email },
      update: {},
      create: { ...admin, passwordHash },
    });
  }
  console.log(`Seeded ${ADMINS.length} admin users.`);

  // 2. Seed Games
  for (const g of GAMES) {
    await prisma.game.upsert({
      where: { id: g.id },
      update: {
        slug: g.slug,
        title: g.title,
        cover: g.cover,
        trailer: g.trailer || null,
        gallery: g.gallery || [],
        description: g.description,
        synopsis: g.synopsis,
        developer: g.developer,
        publisher: g.publisher,
        engine: g.engine || null,
        releaseDate: g.releaseDate,
        suggestedPrice: g.suggestedPrice,
        platforms: g.platforms || [],
        genres: g.genres || [],
        avgPlayTime: g.avgPlayTime || null,
        online: g.online,
        offline: g.offline,
        maxPlayers: g.maxPlayers,
        languages: g.languages || [],
        subtitles: g.subtitles || [],
        dubbing: g.dubbing || [],
        ageRating: g.ageRating,
        links: (g.links as any) || [],
        metacriticScore: g.metacriticScore || null,
        openCriticScore: g.openCriticScore || null,
        userScore: g.userScore,
        adminScore: g.adminScore || null,
        siteScores: (g.siteScores as any) || [],
        worldAvg: g.worldAvg || null,
        featured: g.featured || false,
        tags: g.tags || [],
      },
      create: {
        id: g.id,
        slug: g.slug,
        title: g.title,
        cover: g.cover,
        trailer: g.trailer || null,
        gallery: g.gallery || [],
        description: g.description,
        synopsis: g.synopsis,
        developer: g.developer,
        publisher: g.publisher,
        engine: g.engine || null,
        releaseDate: g.releaseDate,
        suggestedPrice: g.suggestedPrice,
        platforms: g.platforms || [],
        genres: g.genres || [],
        avgPlayTime: g.avgPlayTime || null,
        online: g.online,
        offline: g.offline,
        maxPlayers: g.maxPlayers,
        languages: g.languages || [],
        subtitles: g.subtitles || [],
        dubbing: g.dubbing || [],
        ageRating: g.ageRating,
        links: (g.links as any) || [],
        metacriticScore: g.metacriticScore || null,
        openCriticScore: g.openCriticScore || null,
        userScore: g.userScore,
        adminScore: g.adminScore || null,
        siteScores: (g.siteScores as any) || [],
        worldAvg: g.worldAvg || null,
        featured: g.featured || false,
        tags: g.tags || [],
      },
    });
  }
  console.log(`Seeded ${GAMES.length} games.`);

  // 3. Seed Reviews
  for (const r of REVIEWS) {
    await prisma.review.upsert({
      where: { id: r.id },
      update: {
        gameId: r.gameId,
        title: r.title,
        text: r.text,
        pros: r.pros || [],
        cons: r.cons || [],
        conclusion: r.conclusion,
        scores: (r.scores as any) || {},
        overallScore: r.overallScore,
        author: r.author,
        publishedAt: r.publishedAt,
        likes: r.likes || 0,
        imageCredits: r.imageCredits || null,
      },
      create: {
        id: r.id,
        gameId: r.gameId,
        title: r.title,
        text: r.text,
        pros: r.pros || [],
        cons: r.cons || [],
        conclusion: r.conclusion,
        scores: (r.scores as any) || {},
        overallScore: r.overallScore,
        author: r.author,
        publishedAt: r.publishedAt,
        likes: r.likes || 0,
        imageCredits: r.imageCredits || null,
      },
    });
  }
  console.log(`Seeded ${REVIEWS.length} reviews.`);

  // 4. Seed News Articles
  for (const n of NEWS) {
    await prisma.newsArticle.upsert({
      where: { id: n.id },
      update: {
        slug: n.slug,
        title: n.title,
        excerpt: n.excerpt,
        content: n.content,
        cover: n.cover,
        author: n.author,
        publishedAt: n.publishedAt,
        category: n.category,
        tags: n.tags || [],
        views: n.views || 0,
        likes: n.likes || 0,
        imageCredits: n.imageCredits || null,
        fontes: n.fontes || null,
      },
      create: {
        id: n.id,
        slug: n.slug,
        title: n.title,
        excerpt: n.excerpt,
        content: n.content,
        cover: n.cover,
        author: n.author,
        publishedAt: n.publishedAt,
        category: n.category,
        tags: n.tags || [],
        views: n.views || 0,
        likes: n.likes || 0,
        imageCredits: n.imageCredits || null,
        fontes: n.fontes || null,
      },
    });
  }
  console.log(`Seeded ${NEWS.length} news articles.`);

  // 5. Seed Site Users and Favorites
  for (const user of USERS) {
    const email = `${user.nickname.toLowerCase()}@example.com`;
    await prisma.siteUser.upsert({
      where: { id: user.id },
      update: {
        nickname: user.nickname,
        email,
        avatar: user.avatar,
        console: user.console,
        city: user.city || null,
        state: user.state || null,
        bio: user.bio || null,
      },
      create: {
        id: user.id,
        nickname: user.nickname,
        email,
        passwordHash, // Use default hashed password
        avatar: user.avatar,
        console: user.console,
        city: user.city || null,
        state: user.state || null,
        bio: user.bio || null,
      },
    });

    if (user.favoriteGames && user.favoriteGames.length > 0) {
      for (const gameId of user.favoriteGames) {
        const gameExists = GAMES.some((g) => g.id === gameId);
        if (gameExists) {
          await prisma.favorite.upsert({
            where: {
              userId_gameId: {
                userId: user.id,
                gameId: gameId,
              },
            },
            update: {},
            create: {
              userId: user.id,
              gameId: gameId,
            },
          });
        }
      }
    }
  }
  console.log(`Seeded ${USERS.length} site users and their favorites.`);

  // 3. Seed YouTube Videos
  const YOUTUBE_VIDEOS = [
    {
      title: "God of War Ragnarök Vale a Pena em 2026? Análise Completa PS5",
      videoUrl: "https://www.youtube.com/watch?v=kY31w0e80bY",
      thumbnail: "https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/library_hero.jpg",
      duration: "18:42",
      resolution: "4K UHD",
    },
    {
      title: "Marvel's Spider-Man 2: Detalhes do Venom e Campanha Sem Spoilers",
      videoUrl: "https://www.youtube.com/watch?v=q6d_gsk5f4M",
      thumbnail: "https://upload.wikimedia.org/wikipedia/en/0/0f/SpiderMan2PS5BoxArt.jpeg",
      duration: "22:15",
      resolution: "1080P",
    },
    {
      title: "Será que Hogwarts Legacy ainda impressiona no PS5? Review Técnico",
      videoUrl: "https://www.youtube.com/watch?v=BtyBj1NDZbA",
      thumbnail: "https://cdn.cloudflare.steamstatic.com/steam/apps/990080/library_600x900.jpg",
      duration: "15:30",
      resolution: "4K HDR",
    },
  ];

  for (const video of YOUTUBE_VIDEOS) {
    await prisma.youtubeVideo.create({
      data: video,
    });
  }
  console.log(`Seeded ${YOUTUBE_VIDEOS.length} YouTube videos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

