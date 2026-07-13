"use client";

import { useAllGames } from "@/hooks/useAllGames";
import { NEWS, LISTINGS } from "@/lib/data";

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
  const featuredGames = GAMES.filter((g) => g.featured);
  
  // Prefer a featured game that already has an editorial "Nota UQP" (adminScore) for the hero,
  // since the scores row below is built around that field — falls back to the first featured
  // game if none has one yet (e.g. freshly added titles awaiting a full review).
  const topGame = featuredGames.find((g) => g.adminScore) ?? featuredGames[0];
  
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
      <LatestReviews games={GAMES} />

      {/* ─── QUEM SOMOS (HISTÓRIA E EQUIPE) ───────────────────── */}
      <AboutUs />
    </div>
  );
}
