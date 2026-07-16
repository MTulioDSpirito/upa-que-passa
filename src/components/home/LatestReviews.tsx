import Link from "next/link";
import { Star, ThumbsUp, Calendar, User, ChevronRight, BookOpen } from "lucide-react";
import { Game, Review } from "@/lib/types";
import { getScoreColor, formatScore, formatDate } from "@/lib/data";

interface LatestReviewsProps {
  games: Game[];
  reviews: Review[];
}

export default function LatestReviews({ games, reviews }: LatestReviewsProps) {
  // Map reviews to their corresponding games and filter out any reviews without a matching game
  const reviewsWithGames = reviews.map((r) => ({
    review: r,
    game: games.find((g) => g.id === r.gameId),
  }))
    .filter((r) => r.game)
    // Sort by publication date (descending)
    .sort((a, b) => new Date(b.review.publishedAt).getTime() - new Date(a.review.publishedAt).getTime())
    // Get the latest 3 reviews
    .slice(0, 3);

  if (reviewsWithGames.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 border-t border-white/5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white font-display">
            Reviews da Equipe
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xl">
            Confira as últimas análises críticas e notas oficiais do UQP sobre os lançamentos mais recentes de PS5.
          </p>
        </div>
        <Link
          href="/reviews"
          className="inline-flex items-center gap-2 text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors group"
        >
          Ver Todas as Reviews
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid of Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {reviewsWithGames.map(({ review, game }) => {
          if (!game) return null;
          return (
            <Link
              key={review.id}
              href={`/reviews/${game.slug}#review`}
              className="group flex flex-col bg-[#0f0f18]/60 backdrop-blur border border-white/5 hover:border-purple-500/20 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-purple-950/10"
            >
              {/* Cover & Score Overlay */}
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <img
                  src={game.cover}
                  alt={game.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f18] via-[#0f0f18]/40 to-transparent" />
                
                {/* Overall Score Badge */}
                <div className="absolute top-4 right-4 bg-[#07070a]/90 border border-white/10 backdrop-blur rounded-2xl p-2 px-3 flex items-center gap-2 shadow-lg">
                  <span className="text-[10px] font-black tracking-wider text-gray-400">NOTA</span>
                  <span className={`text-xl font-black ${getScoreColor(review.overallScore)}`}>
                    {formatScore(review.overallScore)}
                  </span>
                </div>
              </div>

              {/* Review Info */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-purple-400 font-extrabold uppercase tracking-wider block mb-2">
                    {game.title}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 mb-3 leading-snug">
                    {review.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-6">
                    {review.text}
                  </p>
                </div>

                {/* Footer Metadata */}
                <div className="border-t border-white/5 pt-4 mt-auto flex items-center justify-between text-[11px] text-gray-500">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    <span>{review.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(review.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
