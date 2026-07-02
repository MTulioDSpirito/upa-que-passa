"use client";

import Link from "next/link";
import { Trophy, Star, TrendingUp } from "lucide-react";
import { GAMES, getScoreColor, formatScore } from "@/lib/data";

const CATEGORIES = [
  { id: "geral", label: "🏆 Geral", genre: null },
  { id: "rpg", label: "⚔️ RPG", genre: "RPG" },
  { id: "acao", label: "💥 Ação", genre: "Ação" },
  { id: "aventura", label: "🗺️ Aventura", genre: "Aventura" },
  { id: "terror", label: "👻 Terror", genre: "Terror" },
];

export default function RankingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <h1 className="text-4xl font-black text-white">Ranking de Jogos</h1>
        </div>
        <p className="text-gray-400">Os melhores jogos de PS5 avaliados pela nossa equipe e pela comunidade</p>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        {[...GAMES].sort((a, b) => (b.adminScore || 0) - (a.adminScore || 0)).slice(0, 3).map((game, i) => {
          const pos = [1, 0, 2][i];
          const actualGame = [...GAMES].sort((a, b) => (b.adminScore || 0) - (a.adminScore || 0))[pos];
          const medals = ["🥇", "🥈", "🥉"];
          const heights = ["h-48", "h-40", "h-36"];
          return (
            <Link
              key={actualGame.id}
              href={`/jogos/${actualGame.slug}`}
              className={`group flex flex-col items-center ${pos === 0 ? "order-2" : pos === 1 ? "order-1" : "order-3"}`}
            >
              <div className="text-3xl mb-2">{medals[pos]}</div>
              <div className="relative mb-3">
                <img
                  src={actualGame.cover}
                  alt={actualGame.title}
                  className={`${pos === 0 ? "w-28 h-40" : "w-24 h-32"} object-cover rounded-xl border-2 ${
                    pos === 0 ? "border-yellow-400" : pos === 1 ? "border-gray-400" : "border-orange-400"
                  } group-hover:scale-105 transition-transform`}
                />
                <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
                  pos === 0 ? "bg-yellow-400 text-black" : pos === 1 ? "bg-gray-400 text-black" : "bg-orange-400 text-black"
                }`}>
                  #{pos + 1}
                </div>
              </div>
              <p className="text-xs font-semibold text-white text-center line-clamp-2 mb-1">{actualGame.title}</p>
              <div className={`text-lg font-black ${getScoreColor(actualGame.adminScore || 0)}`}>
                {formatScore(actualGame.adminScore || 0)}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Full ranking */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          Ranking Completo 2024
        </h2>
        {[...GAMES]
          .sort((a, b) => (b.adminScore || 0) - (a.adminScore || 0))
          .map((game, i) => (
            <Link
              key={game.id}
              href={`/jogos/${game.slug}`}
              className="flex items-center gap-4 bg-[#111118] border border-white/5 rounded-xl p-4 hover:border-purple-500/20 transition-all group"
            >
              <div className={`text-xl font-black w-10 text-center ${
                i === 0 ? "text-yellow-400" :
                i === 1 ? "text-gray-400" :
                i === 2 ? "text-orange-400" :
                "text-gray-700"
              }`}>
                #{i + 1}
              </div>

              <img src={game.cover} alt={game.title} className="w-12 h-16 object-cover rounded-lg flex-shrink-0" />

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                  {game.title}
                </h3>
                <p className="text-sm text-gray-500">{game.developer} · {new Date(game.releaseDate).getFullYear()}</p>
                <div className="flex gap-2 mt-1">
                  {game.genres.slice(0, 2).map((g) => (
                    <span key={g} className="text-xs text-purple-400 bg-purple-900/20 px-1.5 py-0.5 rounded-full">{g}</span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <div className="text-sm font-semibold text-gray-400">{game.metacriticScore || "—"}</div>
                  <div className="text-xs text-gray-600">Metacritic</div>
                </div>
                <div className="text-right hidden md:block">
                  <div className="text-sm font-semibold text-gray-400 flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {game.userScore.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-600">Usuários</div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-black ${getScoreColor(game.adminScore || 0)}`}>
                    {formatScore(game.adminScore || game.userScore)}
                  </div>
                  <div className="text-xs text-gray-600">Nota UQP</div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
