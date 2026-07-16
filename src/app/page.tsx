"use client";

import { useAllGames } from "@/hooks/useAllGames";
import { useAllNews } from "@/hooks/useAllNews";
import { useAllReviews } from "@/hooks/useAllReviews";
import { LISTINGS } from "@/lib/data";

// Home components
import TrendingStrip from "@/components/home/TrendingStrip";
import MarketplaceFeatured from "@/components/home/MarketplaceFeatured";
import FeaturedMoment from "@/components/home/FeaturedMoment";
import BestReviewed from "@/components/home/BestReviewed";
import LatestReviews from "@/components/home/LatestReviews";
import YouTubeVideos from "@/components/home/YouTubeVideos";
import AboutUs from "@/components/home/AboutUs";

export default function Home() {
  const [GAMES] = useAllGames();
  const NEWS = useAllNews();
  const REVIEWS = useAllReviews();

  // Find the review that has been set as featured, and find its corresponding game
  const featuredReview = REVIEWS.find((r) => r.featured);
  const featuredReviewGame = featuredReview
    ? GAMES.find((g) => g.id === featuredReview.gameId)
    : null;

  const featuredGames = GAMES.filter((g) => g.featured);
  
  // Prefer the manually featured review's game; fallback to standard featured game logic
  const topGame =
    featuredReviewGame ??
    (featuredGames.find((g) => g.adminScore) ?? featuredGames[0]);

  const sortedNews = [...NEWS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const activeListings = LISTINGS.filter((l) => l.active).slice(0, 3);

  return (
    <div className="bg-[#07070a]">
      {/* ─── TRENDING STRIP ───────────────────────────────────── */}
      <TrendingStrip newsList={sortedNews.slice(0, 9)} />

      {/* ─── DESTAQUE DO MOMENTO ─────────────────────────────── */}
      {topGame && <FeaturedMoment topGame={topGame} />}

      {/* ─── YOUTUBE INTEGRATION (Últimos Vídeos) ────────────── */}
      <YouTubeVideos />

      {/* ─── MARKETPLACE ─────────────────────────────────────── */}
      <MarketplaceFeatured activeListings={activeListings} />

      {/* ─── MELHORES AVALIADOS ───────────────────────────────── */}
      <BestReviewed games={GAMES} />

      {/* ─── REVIEWS DA EQUIPE ───────────────────────────────── */}
      <LatestReviews games={GAMES} reviews={REVIEWS} />

      {/* ─── QUEM SOMOS (HISTÓRIA E EQUIPE) ───────────────────── */}
      <AboutUs />
    </div>
  );
}
