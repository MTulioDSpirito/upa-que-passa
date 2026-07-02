"use client";

import Link from "next/link";
import { Star, ThumbsUp, Calendar, User, ChevronRight, Gamepad2 } from "lucide-react";
import { GAMES, REVIEWS, getScoreColor, formatScore, formatDate } from "@/lib/data";

export default function ReviewsPage() {
  const reviewsWithGames = REVIEWS.map((r) => ({
    review: r,
    game: GAMES.find((g) => g.id === r.gameId),
  })).filter((r) => r.game);

  const otherGames = GAMES.filter((g) => !REVIEWS.find((r) => r.gameId === g.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2">Reviews</h1>
        <p className="text-gray-400">Análises aprofundadas dos melhores jogos de PS5</p>
      </div>

      {/* Featured reviews */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          Reviews em Destaque
        </h2>

        {reviewsWithGames.length > 0 ? (
          <div className="space-y-6">
            {reviewsWithGames.map(({ review, game }) => (
              <Link
                key={review.id}
                href={`/jogos/${game!.slug}#review`}
                className="group flex gap-5 bg-[#111118] border border-white/5 rounded-3xl overflow-hidden hover:border-purple-500/20 transition-all p-0"
              >
                <div className="relative w-48 h-48 flex-shrink-0 overflow-hidden">
                  <img src={game!.cover} alt={game!.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-xs text-purple-400 bg-purple-900/30 px-2 py-0.5 rounded-full mb-2 inline-block">
                        Review Oficial
                      </span>
                      <h3 className="text-xl font-black text-white group-hover:text-purple-300 transition-colors">
                        {review.title}
                      </h3>
                    </div>
                    <div className={`text-3xl font-black flex-shrink-0 ${getScoreColor(review.overallScore)}`}>
                      {formatScore(review.overallScore)}
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 mb-4">
                    {review.text.slice(0, 250)}...
                  </p>

                  <div className="flex gap-3 mb-3">
                    <div className="bg-green-900/10 border border-green-800/20 rounded-lg px-3 py-1.5">
                      <p className="text-xs text-green-400 font-semibold mb-0.5">Prós</p>
                      <p className="text-xs text-gray-400">{review.pros[0]}</p>
                    </div>
                    <div className="bg-red-900/10 border border-red-800/20 rounded-lg px-3 py-1.5">
                      <p className="text-xs text-red-400 font-semibold mb-0.5">Contras</p>
                      <p className="text-xs text-gray-400">{review.cons[0]}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {review.author}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(review.publishedAt)}</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {review.likes} curtidas</span>
                    <span className="ml-auto text-purple-400 group-hover:text-purple-300 flex items-center gap-1">
                      Ler completa <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-600">
            <div className="text-5xl mb-3">✍️</div>
            <p>Nenhuma review publicada ainda</p>
          </div>
        )}
      </section>

      {/* Games without reviews */}
      <section>
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-blue-400" />
          Avaliações da Comunidade
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherGames.map((game) => (
            <Link
              key={game.id}
              href={`/jogos/${game.slug}`}
              className="group flex gap-3 bg-[#111118] border border-white/5 rounded-2xl p-4 hover:border-purple-500/20 transition-all"
            >
              <img src={game.cover} alt={game.title} className="w-16 h-20 object-cover rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors text-sm mb-0.5 line-clamp-2">
                  {game.title}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{game.developer}</p>
                <div className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className={`text-sm font-bold ${getScoreColor(game.userScore)}`}>{game.userScore}</span>
                  <span className="text-xs text-gray-600">usuários</span>
                </div>
                <div className="mt-1">
                  <span className={`text-xs font-semibold ${getScoreColor(game.adminScore || 0)}`}>
                    Nota UQP: {game.adminScore || "Em breve"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
