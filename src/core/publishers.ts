import { NewsArticle, Review, Game } from "@/lib/types";
import { appendAdminNews } from "@/lib/adminNews";
import { appendAdminReview } from "@/lib/adminReviews";
import { appendAdminGame, readAdminGames, writeAdminGames } from "@/lib/adminGames";

export interface IPublisher {
  publish(sugestao: { id: string; titulo: string; slug: string }, authorName: string, updatedPayload: any): Promise<void>;
}

export class NewsPublisher implements IPublisher {
  async publish(
    sugestao: { id: string; titulo: string; slug: string },
    authorName: string,
    updatedPayload: any
  ): Promise<void> {
    const rawFontes = (sugestao as any).fontes || updatedPayload.fontes || "";
    const fontesStr = Array.isArray(rawFontes) ? rawFontes.join(", ") : String(rawFontes || "");

    const newsArticle: NewsArticle = {
      id: sugestao.id,
      slug: sugestao.slug,
      title: sugestao.titulo,
      excerpt: updatedPayload.excerpt || "",
      content: updatedPayload.body || updatedPayload.content || "",
      cover: updatedPayload.cover || "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800",
      author: authorName,
      publishedAt: new Date().toISOString().split("T")[0],
      category: updatedPayload.category || "Notícias",
      tags: updatedPayload.tags || ["PS5"],
      views: 0,
      likes: 0,
      imageCredits: updatedPayload.imageCredits || "",
      fontes: fontesStr,
    };
    await appendAdminNews(newsArticle);
  }
}

export class ReviewPublisher implements IPublisher {
  async publish(
    sugestao: { id: string; titulo: string; slug: string },
    authorName: string,
    updatedPayload: any
  ): Promise<void> {
    const gameId = updatedPayload.gameId || `dynamic-${sugestao.slug}`;
    const review: Review = {
      id: sugestao.id,
      gameId: gameId,
      title: sugestao.titulo,
      text: updatedPayload.body || updatedPayload.content || "",
      pros: updatedPayload.pros || [],
      cons: updatedPayload.cons || [],
      conclusion: updatedPayload.conclusion || "Análise concluída pelo portal UQP.",
      scores: updatedPayload.scores || {
        graphics: 8, gameplay: 8, fun: 8, story: 8, soundtrack: 8, performance: 8,
        replay: 8, multiplayer: 0, difficulty: 0, visual: 0, ai: 0, optimization: 0, content: 0
      },
      overallScore: Number(updatedPayload.overallScore) || 8.0,
      author: authorName,
      publishedAt: new Date().toISOString().split("T")[0],
      likes: 0,
      imageCredits: updatedPayload.imageCredits || "",
    };
    await appendAdminReview(review);

    // Criar o jogo correspondente apenas se for um jogo novo e não associado a um existente
    if (!updatedPayload.gameId) {
      const game: Game = {
        id: gameId,
        slug: sugestao.slug.replace("-review", ""),
        title: sugestao.titulo.split(" - ")[0],
        cover: updatedPayload.cover || "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800",
        gallery: [updatedPayload.cover || "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800"],
        description: updatedPayload.body || "",
        synopsis: updatedPayload.excerpt || "",
        developer: updatedPayload.gameDetails?.developer || "Independente",
        publisher: updatedPayload.gameDetails?.publisher || "Independente",
        releaseDate: updatedPayload.gameDetails?.releaseDate || new Date().toISOString().split("T")[0],
        suggestedPrice: Number(updatedPayload.gameDetails?.price) || 299.9,
        platforms: updatedPayload.gameDetails?.platforms || ["PS5"],
        genres: updatedPayload.gameDetails?.genres || ["Ação", "Aventura"],
        online: false,
        offline: true,
        maxPlayers: 1,
        languages: ["Português (BR)", "Inglês"],
        subtitles: ["Português (BR)", "Inglês"],
        dubbing: [],
        ageRating: "L",
        links: [],
        userScore: Number(updatedPayload.overallScore) || 8.0,
        adminScore: Number(updatedPayload.overallScore) || 8.0,
        siteScores: [],
      };
      await appendAdminGame(game);
    }
  }
}

export class LaunchPublisher implements IPublisher {
  async publish(
    sugestao: { id: string; titulo: string; slug: string },
    authorName: string,
    updatedPayload: any
  ): Promise<void> {
    const games = await readAdminGames();
    
    // Normalize slug by removing '-notas' suffix if present
    const normalizedSlug = sugestao.slug.replace(/-notas$/, "");
    
    const existingIndex = games.findIndex(
      (g) => g.slug === normalizedSlug || g.slug === sugestao.slug
    );

    if (existingIndex !== -1) {
      const existing = games[existingIndex];
      
      // Update score fields
      if (updatedPayload.metacriticScore !== undefined) {
        existing.metacriticScore = updatedPayload.metacriticScore;
      }
      if (updatedPayload.openCriticScore !== undefined) {
        existing.openCriticScore = updatedPayload.openCriticScore;
      }
      if (updatedPayload.userScore !== undefined) {
        existing.userScore = updatedPayload.userScore;
      }
      if (updatedPayload.worldAvg !== undefined) {
        existing.worldAvg = updatedPayload.worldAvg;
      }
      if (updatedPayload.siteScores !== undefined) {
        existing.siteScores = updatedPayload.siteScores;
      }

      // Update game details if not already present
      if (updatedPayload.developer && existing.developer === "Desconhecido") {
        existing.developer = updatedPayload.developer;
      }
      if (updatedPayload.publisher && existing.publisher === "Desconhecido") {
        existing.publisher = updatedPayload.publisher;
      }
      if (updatedPayload.releaseDate && (!existing.releaseDate || existing.releaseDate.startsWith("2026"))) {
        existing.releaseDate = updatedPayload.releaseDate;
      }
      if (updatedPayload.genres && updatedPayload.genres.length > 0) {
        existing.genres = updatedPayload.genres;
      }
      if (updatedPayload.cover && (!existing.cover || existing.cover.includes("unsplash"))) {
        existing.cover = updatedPayload.cover;
      }
      if (updatedPayload.gallery && updatedPayload.gallery.length > 0) {
        existing.gallery = Array.from(new Set([...existing.gallery, ...updatedPayload.gallery]));
      }

      await writeAdminGames(games);
    } else {
      const game: Game = {
        id: `launch-${sugestao.id}`,
        slug: sugestao.slug,
        title: sugestao.titulo,
        cover: updatedPayload.cover || "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800",
        gallery: [updatedPayload.cover || "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800"],
        description: updatedPayload.excerpt || "",
        synopsis: updatedPayload.excerpt || "",
        developer: updatedPayload.developer || "Desconhecido",
        publisher: updatedPayload.developer || "Desconhecido",
        releaseDate: updatedPayload.releaseDate || new Date().toISOString().split("T")[0],
        suggestedPrice: Number(updatedPayload.price) || 0,
        platforms: updatedPayload.platforms || ["PS5"],
        genres: updatedPayload.genres || ["Ação"],
        online: false,
        offline: true,
        maxPlayers: 1,
        languages: ["Português (BR)"],
        subtitles: ["Português (BR)"],
        dubbing: [],
        ageRating: "L",
        links: updatedPayload.buyLink ? [{ label: "Comprar", url: updatedPayload.buyLink }] : [],
        userScore: updatedPayload.userScore || 0,
        metacriticScore: updatedPayload.metacriticScore,
        openCriticScore: updatedPayload.openCriticScore,
        siteScores: updatedPayload.siteScores || [],
        worldAvg: updatedPayload.worldAvg,
      };
      games.push(game);
      await writeAdminGames(games);
    }
  }
}
