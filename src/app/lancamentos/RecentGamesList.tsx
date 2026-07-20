"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, Clock, Gamepad2, Sparkles } from "lucide-react";
import { Game, Review } from "@/lib/types";
import { getScoreColor, formatDate, formatScore } from "@/lib/data";

interface RecentGamesListProps {
  games: Game[];
  reviews: Review[];
}

export default function RecentGamesList({ games, reviews }: RecentGamesListProps) {
  const [filter, setFilter] = useState<"all" | "reviewed" | "unreviewed">("all");

  // Map games to add review information
  const gamesWithReviewInfo = games.map((game) => {
    const review = reviews.find((r) => r.gameId === game.id);
    const score = game.adminScore || (review ? review.overallScore : null);
    const hasReview = !!score;
    return {
      ...game,
      hasReview,
      reviewScore: score,
    };
  });

  const allCount = gamesWithReviewInfo.length;
  const reviewedCount = gamesWithReviewInfo.filter((g) => g.hasReview).length;
  const unreviewedCount = gamesWithReviewInfo.filter((g) => !g.hasReview).length;

  const filteredGames = gamesWithReviewInfo.filter((game) => {
    if (filter === "reviewed") return game.hasReview;
    if (filter === "unreviewed") return !game.hasReview;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Filter Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-5">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-purple-400" />
          Lançamentos Recentes
        </h2>

        {/* Dynamic Filter Tabs */}
        <div className="flex bg-[#0b0b14] border border-white/5 p-1 rounded-xl self-start sm:self-auto shadow-lg">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
              filter === "all"
                ? "bg-purple-600 text-white shadow-md font-bold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Todos ({allCount})
          </button>
          <button
            onClick={() => setFilter("reviewed")}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 ${
              filter === "reviewed"
                ? "bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Com Review ({reviewedCount})
          </button>
          <button
            onClick={() => setFilter("unreviewed")}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
              filter === "unreviewed"
                ? "bg-white/5 text-gray-300 font-bold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Sem Review ({unreviewedCount})
          </button>
        </div>
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Gamepad2 className="w-8 h-8 mx-auto mb-3 text-gray-500" />
          <p>Nenhum lançamento recente encontrado nesta categoria.</p>
        </div>
      )}

      {/* Games List */}
      <div className="space-y-3">
        {filteredGames.map((game) => (
          <Link
            key={game.id}
            href={`/reviews/${game.slug}`}
            className={`group flex items-center gap-4 bg-[#0f0f18] border rounded-xl p-4 hover:bg-[#12121f] transition-all duration-300 ${
              game.hasReview
                ? "border-amber-500/10 hover:border-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                : "border-white/5 hover:border-purple-500/20 hover:shadow-[0_0_15px_rgba(168,85,247,0.05)]"
            }`}
          >
            <img
               src={game.cover}
               alt={game.title}
               className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
               onError={(e) => {
                 (e.target as HTMLImageElement).src = "/cover_conteudo_nao_disponivel.png";
               }}
             />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                  {game.title}
                </h3>
                {game.hasReview ? (
                  <span className="flex items-center gap-0.5 text-[9px] font-mono font-extrabold uppercase bg-amber-500/10 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/20">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Review UQP
                  </span>
                ) : (
                  <span className="text-[9px] font-mono uppercase bg-white/5 text-gray-500 px-1.5 py-0.2 rounded border border-white/5">
                    Sem Review
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">{game.developer}</p>
            </div>
            
            <div className="text-sm text-gray-500 hidden md:block flex-shrink-0">{formatDate(game.releaseDate)}</div>
            
            <div className="flex items-center gap-3">
              <div className="flex gap-1 hidden sm:flex">
                {game.platforms.slice(0, 2).map((p) => (
                  <span key={p} className="text-xs bg-blue-900/20 text-[#0072ce] px-2 py-0.5 rounded-full whitespace-nowrap">{p}</span>
                ))}
              </div>

              {game.hasReview && game.reviewScore !== null && (
                <div className={`px-2.5 py-1 rounded-lg font-black font-mono text-xs border bg-amber-500/5 border-amber-500/20 ${getScoreColor(game.reviewScore)}`}>
                  {formatScore(game.reviewScore)}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
