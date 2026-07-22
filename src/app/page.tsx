import { prisma } from "@/lib/prisma";
import { LISTINGS } from "@/lib/data";
import { Game, Review, NewsArticle, YoutubeVideo } from "@/lib/types";

// Home components
import TrendingStrip from "@/components/home/TrendingStrip";
import MarketplaceFeatured from "@/components/home/MarketplaceFeatured";
import FeaturedMoment from "@/components/home/FeaturedMoment";
import BestReviewed from "@/components/home/BestReviewed";
import LatestReviews from "@/components/home/LatestReviews";
import YouTubeVideos from "@/components/home/YouTubeVideos";
import AboutUs from "@/components/home/AboutUs";

// Revalidate this page every 60 seconds (Incremental Static Regeneration)
export const revalidate = 60;

export default async function Home() {
  // Fetch data in parallel
  const [dbNews, dbReviews, dbFeaturedGames, dbBestReviewedGames, dbVideos] = await Promise.all([
    // 9 latest news articles
    prisma.newsArticle.findMany({
      orderBy: { publishedAt: "desc" },
      take: 9
    }),
    // 3 latest reviews with their games
    prisma.review.findMany({
      orderBy: { publishedAt: "desc" },
      take: 3,
      include: { game: true }
    }),
    // Featured games for FeaturedMoment
    prisma.game.findMany({
      where: { featured: true },
      orderBy: { releaseDate: "desc" }
    }),
    // Best reviewed games for BestReviewed
    prisma.game.findMany({
      where: { adminScore: { not: null } },
      orderBy: { adminScore: "desc" },
      take: 3
    }),
    // 3 latest youtube videos
    prisma.youtubeVideo.findMany({
      orderBy: { createdAt: "desc" },
      take: 3
    })
  ]);

  // Helper mapper to cast Prisma Game to application Game type
  const mapGame = (g: any): Game => ({
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
  });

  const news: NewsArticle[] = dbNews.map((n) => ({
    id: n.id,
    slug: n.slug,
    title: n.title,
    excerpt: n.excerpt,
    content: n.content,
    cover: n.cover,
    author: n.author,
    publishedAt: n.publishedAt,
    category: n.category,
    tags: n.tags,
    views: n.views,
    likes: n.likes,
    imageCredits: n.imageCredits ?? undefined,
    fontes: n.fontes ?? undefined,
  }));

  const reviews: Review[] = dbReviews.map((r) => ({
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

  const latestReviewsGames: Game[] = dbReviews
    .filter((r) => r.game)
    .map((r) => mapGame(r.game));

  const featuredGames: Game[] = dbFeaturedGames.map(mapGame);
  const bestReviewedGames: Game[] = dbBestReviewedGames.map(mapGame);

  const videos: YoutubeVideo[] = dbVideos.map((v) => ({
    id: v.id,
    title: v.title,
    videoUrl: v.videoUrl,
    thumbnail: v.thumbnail,
    duration: v.duration,
    resolution: v.resolution,
  }));

  // Find the review that has been set as featured, and get its game
  const featuredReview = await prisma.review.findFirst({
    where: { featured: true },
    include: { game: true }
  });
  const featuredReviewGame = featuredReview?.game ? mapGame(featuredReview.game) : null;

  // Prefer the manually featured review's game; fallback to standard featured game logic
  const topGame =
    featuredReviewGame ??
    (featuredGames.find((g) => g.adminScore) ?? featuredGames[0] ?? bestReviewedGames[0]);

  const activeListings = LISTINGS.filter((l) => l.active).slice(0, 3);

  return (
    <div className="bg-[#07070a]">
      {/* ─── TRENDING STRIP ───────────────────────────────────── */}
      <TrendingStrip newsList={news} />

      {/* ─── DESTAQUE DO MOMENTO ─────────────────────────────── */}
      {topGame && <FeaturedMoment topGame={topGame} />}

      {/* ─── YOUTUBE INTEGRATION (Últimos Vídeos) ────────────── */}
      <YouTubeVideos initialVideos={videos} />

      {/* ─── MARKETPLACE ─────────────────────────────────────── */}
      <MarketplaceFeatured activeListings={activeListings} />

      {/* ─── MELHORES AVALIADOS ───────────────────────────────── */}
      <BestReviewed games={bestReviewedGames} />

      {/* ─── REVIEWS DA EQUIPE ───────────────────────────────── */}
      <LatestReviews games={latestReviewsGames} reviews={reviews} />

      {/* ─── QUEM SOMOS (HISTÓRIA E EQUIPE) ───────────────────── */}
      <AboutUs />
    </div>
  );
}
