"use client";

import { Heart, Edit, Trash2, Flame } from "lucide-react";
import { getScoreColor, formatScore, formatDate } from "@/lib/data";
import { Game, Review } from "@/lib/types";
import { type AdminUserSession } from "../layout/AdminUserFooter";

interface ReviewListProps {
  reviews: Review[];
  allGames: Game[];
  actionLoading: boolean;
  adminUser: AdminUserSession;
  onEdit: (review: Review) => void;
  onDelete: (id: string) => void;
  onSetFeatured: (id: string) => void;
}

export default function ReviewList({
  reviews,
  allGames,
  actionLoading,
  adminUser,
  onEdit,
  onDelete,
  onSetFeatured,
}: ReviewListProps) {
  return (
    <div className="bg-[#0f0f18] border border-white/5 rounded-2xl divide-y divide-white/5">
      {reviews.map((review) => {
        const game = allGames.find((g) => g.id === review.gameId);
        return (
          <div
            key={review.id}
            className="flex items-center gap-4 p-4 hover:bg-white/[0.01] transition-colors"
          >
            {game ? (
              <img
                src={game.cover}
                alt=""
                className="w-10 h-14 object-cover rounded-lg flex-shrink-0 border border-white/10"
              />
            ) : (
              <div className="w-10 h-14 bg-white/5 rounded-lg flex-shrink-0 flex items-center justify-center text-xs text-gray-500">
                N/A
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white line-clamp-1 flex items-center gap-2">
                {review.title}
                {review.featured && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-orange-400 font-extrabold uppercase tracking-wider bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                    <Flame className="w-3 h-3 fill-orange-400" /> Destaque
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">
                Jogo:{" "}
                <span className="text-purple-400">
                  {game ? game.title : review.gameId}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {review.author} · {formatDate(review.publishedAt)} ·{" "}
                <Heart className="w-3 h-3 inline text-red-500" /> {review.likes}
              </p>
            </div>
            <div
              className={`text-sm font-black ${getScoreColor(
                review.overallScore
              )} px-3 py-1 bg-white/5 rounded-lg`}
            >
              {formatScore(review.overallScore)}
            </div>
            <div className="flex gap-1.5 flex-shrink-0 items-center">
              {/* Flame button / indicator */}
              {(adminUser.role === "DEVELOPER" || review.featured) && (
                <button
                  onClick={() => adminUser.role === "DEVELOPER" && !review.featured && onSetFeatured(review.id)}
                  disabled={actionLoading || adminUser.role !== "DEVELOPER" || review.featured}
                  title={
                    adminUser.role === "DEVELOPER"
                      ? review.featured
                        ? "Destaque atual"
                        : "Definir como destaque do momento"
                      : "Apenas desenvolvedores podem alterar o destaque"
                  }
                  className={`btn-press p-2 rounded-lg transition-all ${
                    review.featured
                      ? "bg-orange-500/10 text-orange-500 cursor-default"
                      : "bg-white/5 text-gray-500 hover:text-orange-400 hover:bg-orange-500/5 cursor-pointer"
                  } ${adminUser.role !== "DEVELOPER" && !review.featured ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  <Flame className={`w-4 h-4 ${review.featured ? "fill-orange-500 animate-pulse" : ""}`} />
                </button>
              )}

              <button
                onClick={() => onEdit(review)}
                disabled={actionLoading}
                className="btn-press p-2 bg-blue-900/20 text-[#0072ce] rounded-lg hover:bg-blue-900/40 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(review.id)}
                disabled={actionLoading}
                className="btn-press p-2 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/40 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
