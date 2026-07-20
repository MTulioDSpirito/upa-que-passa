import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

async function run() {
  console.log("Iniciando migração de JSON para o PostgreSQL...");

  const dataDir = path.join(process.cwd(), "data");

  // 1. Migrar Games
  try {
    const gamesPath = path.join(dataDir, "admin-games.json");
    const gamesData = JSON.parse(await fs.readFile(gamesPath, "utf-8"));
    console.log(`Encontrados ${gamesData.length} jogos no JSON.`);

    for (const g of gamesData) {
      await prisma.game.upsert({
        where: { slug: g.slug },
        update: {
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
          suggestedPrice: Number(g.suggestedPrice) || 0,
          platforms: g.platforms || [],
          genres: g.genres || [],
          avgPlayTime: g.avgPlayTime || null,
          online: !!g.online,
          offline: !!g.offline,
          maxPlayers: Number(g.maxPlayers) || 1,
          languages: g.languages || [],
          subtitles: g.subtitles || [],
          dubbing: g.dubbing || [],
          ageRating: g.ageRating || "L",
          links: g.links || [],
          metacriticScore: g.metacriticScore != null ? Number(g.metacriticScore) : null,
          openCriticScore: g.openCriticScore != null ? Number(g.openCriticScore) : null,
          userScore: Number(g.userScore) || 0,
          adminScore: g.adminScore != null ? Number(g.adminScore) : null,
          siteScores: g.siteScores || [],
          worldAvg: g.worldAvg != null ? Number(g.worldAvg) : null,
          featured: !!g.featured,
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
          suggestedPrice: Number(g.suggestedPrice) || 0,
          platforms: g.platforms || [],
          genres: g.genres || [],
          avgPlayTime: g.avgPlayTime || null,
          online: !!g.online,
          offline: !!g.offline,
          maxPlayers: Number(g.maxPlayers) || 1,
          languages: g.languages || [],
          subtitles: g.subtitles || [],
          dubbing: g.dubbing || [],
          ageRating: g.ageRating || "L",
          links: g.links || [],
          metacriticScore: g.metacriticScore != null ? Number(g.metacriticScore) : null,
          openCriticScore: g.openCriticScore != null ? Number(g.openCriticScore) : null,
          userScore: Number(g.userScore) || 0,
          adminScore: g.adminScore != null ? Number(g.adminScore) : null,
          siteScores: g.siteScores || [],
          worldAvg: g.worldAvg != null ? Number(g.worldAvg) : null,
          featured: !!g.featured,
          tags: g.tags || [],
        },
      });
      console.log(`Jogo upserted: ${g.title}`);
    }
  } catch (err: any) {
    console.error("Erro ao migrar jogos:", err.message);
  }

  // 2. Migrar Reviews
  try {
    const reviewsPath = path.join(dataDir, "admin-reviews.json");
    const reviewsData = JSON.parse(await fs.readFile(reviewsPath, "utf-8"));
    console.log(`Encontradas ${reviewsData.length} reviews no JSON.`);

    for (const r of reviewsData) {
      // Garantir que o jogo associado existe (upsert com info mínima se necessário)
      const gameExists = await prisma.game.findUnique({ where: { id: r.gameId } });
      if (!gameExists) {
        console.warn(`Jogo com ID ${r.gameId} não encontrado. Criando placeholder.`);
        await prisma.game.create({
          data: {
            id: r.gameId,
            slug: `placeholder-${r.gameId}`,
            title: `Placeholder Game ${r.gameId}`,
            cover: "",
            description: "",
            synopsis: "",
            developer: "",
            publisher: "",
            releaseDate: "",
            suggestedPrice: 0,
            platforms: [],
            genres: [],
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
          scores: r.scores || {},
          overallScore: Number(r.overallScore) || 0,
          author: r.author,
          publishedAt: r.publishedAt,
          likes: Number(r.likes) || 0,
          imageCredits: r.imageCredits || null,
        },
        create: {
          id: r.id,
          gameId: r.gameId,
          title: r.title,
          text: r.text,
          pros: r.pros || [],
          cons: r.cons || [],
          conclusion: r.conclusion || "",
          scores: r.scores || {},
          overallScore: Number(r.overallScore) || 0,
          author: r.author,
          publishedAt: r.publishedAt,
          likes: Number(r.likes) || 0,
          imageCredits: r.imageCredits || null,
        },
      });
      console.log(`Review upserted: ${r.title}`);
    }
  } catch (err: any) {
    console.error("Erro ao migrar reviews:", err.message);
  }

  // 3. Migrar News
  try {
    const newsPath = path.join(dataDir, "admin-news.json");
    const newsData = JSON.parse(await fs.readFile(newsPath, "utf-8"));
    console.log(`Encontradas ${newsData.length} notícias no JSON.`);

    for (const n of newsData) {
      await prisma.newsArticle.upsert({
        where: { slug: n.slug },
        update: {
          title: n.title,
          excerpt: n.excerpt || "",
          content: n.content || "",
          cover: n.cover || "",
          author: n.author || "Redação",
          publishedAt: n.publishedAt || new Date().toISOString().split("T")[0],
          category: n.category || "Geral",
          tags: n.tags || [],
          views: Number(n.views) || 0,
          likes: Number(n.likes) || 0,
          imageCredits: n.imageCredits || null,
          fontes: n.fontes || null,
        },
        create: {
          id: n.id,
          slug: n.slug,
          title: n.title,
          excerpt: n.excerpt || "",
          content: n.content || "",
          cover: n.cover || "",
          author: n.author || "Redação",
          publishedAt: n.publishedAt || new Date().toISOString().split("T")[0],
          category: n.category || "Geral",
          tags: n.tags || [],
          views: Number(n.views) || 0,
          likes: Number(n.likes) || 0,
          imageCredits: n.imageCredits || null,
          fontes: n.fontes || null,
        },
      });
      console.log(`Notícia upserted: ${n.title}`);
    }
  } catch (err: any) {
    console.error("Erro ao migrar notícias:", err.message);
  }

  console.log("Migração concluída com sucesso!");
  await prisma.$disconnect();
}

run().catch((err) => {
  console.error("Erro geral na migração:", err);
  prisma.$disconnect();
});
