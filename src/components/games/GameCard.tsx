"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Star, Heart } from "lucide-react";
import { Game } from "@/lib/types";
import { getScoreColor, formatScore } from "@/lib/data";
import { useUserSession } from "@/hooks/useUserSession";

interface GameCardProps {
  game: Game;
  compact?: boolean;
}

export default function GameCard({ game, compact = false }: GameCardProps) {
  const score = game.adminScore || game.worldAvg || game.userScore || undefined;
  const scoreColor = score ? getScoreColor(score) : "text-gray-500";
  const [favorited, setFavorited] = useState(false);
  const currentUser = useUserSession();
  const router = useRouter();
  const pathname = usePathname();

  async function handleToggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId: game.id }),
    });
    if (res.ok) {
      const data = await res.json();
      setFavorited(data.favorited);
    }
  }

  if (compact) {
    return (
      <Link href={`/jogos/${game.slug}`} className="flex gap-3 items-center group hover:bg-white/5 p-2 rounded-xl transition-all">
        <img
          src={game.cover}
          alt={game.title}
          className="w-12 h-16 object-cover object-center rounded-lg flex-shrink-0"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
            {game.title}
          </p>
          <p className="text-xs text-gray-500">{game.developer}</p>
          <span className={`text-sm font-bold ${scoreColor}`}>{score ? formatScore(score) : "—"}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/jogos/${game.slug}`} className="game-card group block">
      <div className="relative bg-[#0f0f18] rounded-xl overflow-hidden border border-white/5 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20">
        {/* Cover */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={game.cover}
            alt={game.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Score Badge */}
          <div className={`absolute top-2 right-2 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-black text-black ${
            !score ? "bg-gray-400" :
            score >= 9 ? "bg-green-400" :
            score >= 7.5 ? "bg-lime-400" :
            score >= 6 ? "bg-yellow-400" :
            "bg-red-400"
          }`}>
            {score ? formatScore(score) : "—"}
          </div>

          {/* Platforms */}
          <div className="absolute bottom-2 left-2 flex gap-1">
            {game.platforms.slice(0, 2).map((p) => (
              <span key={p} className="text-xs bg-black/60 backdrop-blur text-gray-300 px-1.5 py-0.5 rounded">
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-semibold text-white text-sm leading-tight group-hover:text-purple-300 transition-colors line-clamp-2 mb-1">
            {game.title}
          </h3>
          <p className="text-xs text-gray-500 mb-2">{game.developer}</p>

          {/* Genres */}
          <div className="flex gap-1 flex-wrap mb-2">
            {game.genres.slice(0, 2).map((g) => (
              <span key={g} className="text-xs text-purple-400 bg-purple-900/20 px-2 py-0.5 rounded-full">
                {g}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className={`w-3 h-3 ${game.userScore ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`} />
              <span className="text-xs text-gray-400">
                {game.userScore ? `${game.userScore.toFixed(1)} usuários` : "Sem notas de usuários"}
              </span>
            </div>
            <button
              onClick={handleToggleFavorite}
              className={`p-1 transition-colors ${favorited ? "text-red-400" : "text-gray-500 hover:text-red-400"}`}
              aria-label="Favoritar"
            >
              <Heart className={`w-4 h-4 ${favorited ? "fill-red-400" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
