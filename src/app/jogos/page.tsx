"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, SlidersHorizontal, Grid, List } from "lucide-react";
import GameCard from "@/components/GameCard";
import { GAMES, getScoreColor, formatScore } from "@/lib/data";

const GENRES = ["Todos", "Ação", "Aventura", "RPG", "FPS", "Corrida", "Esporte", "Terror", "Indie", "Plataforma", "Estratégia"];
const SORT_OPTIONS = [
  { value: "score", label: "Maior Nota" },
  { value: "recent", label: "Mais Recentes" },
  { value: "user", label: "Nota dos Usuários" },
  { value: "alpha", label: "A-Z" },
];

export default function JogosPage() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("Todos");
  const [sort, setSort] = useState("score");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = GAMES
    .filter((g) => {
      const matchSearch = g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.developer.toLowerCase().includes(search.toLowerCase());
      const matchGenre = genre === "Todos" || g.genres.includes(genre);
      return matchSearch && matchGenre;
    })
    .sort((a, b) => {
      if (sort === "score") return (b.adminScore || 0) - (a.adminScore || 0);
      if (sort === "recent") return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      if (sort === "user") return b.userScore - a.userScore;
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2">Catálogo de Jogos PS5</h1>
        <p className="text-gray-400">{GAMES.length} jogos avaliados · atualizado diariamente</p>
      </div>

      {/* Filters */}
      <div className="bg-[#111118] border border-white/5 rounded-2xl p-4 mb-8 space-y-4">
        {/* Search + Sort */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar jogo ou desenvolvedor..."
              className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-[#1a1a2e]">{o.label}</option>
            ))}
          </select>
          <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setView("grid")}
              className={`p-1.5 rounded-lg transition-colors ${view === "grid" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-1.5 rounded-lg transition-colors ${view === "list" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Genre filter */}
        <div className="flex gap-2 flex-wrap">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                genre === g
                  ? "bg-purple-600 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500 mb-5">
        {filtered.length} {filtered.length === 1 ? "jogo encontrado" : "jogos encontrados"}
      </div>

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="space-y-3">
          {filtered.map((game, i) => (
            <Link
              key={game.id}
              href={`/jogos/${game.slug}`}
              className="flex items-center gap-4 bg-[#111118] border border-white/5 rounded-xl p-4 hover:border-purple-500/20 transition-all group"
            >
              <span className="text-lg font-black text-gray-600 w-8 text-center">#{i + 1}</span>
              <img src={game.cover} alt={game.title} className="w-12 h-16 object-cover rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">{game.title}</h3>
                <p className="text-sm text-gray-500">{game.developer} · {new Date(game.releaseDate).getFullYear()}</p>
                <div className="flex gap-2 mt-1">
                  {game.genres.slice(0, 3).map((g) => (
                    <span key={g} className="text-xs text-purple-400 bg-purple-900/20 px-2 py-0.5 rounded-full">{g}</span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-black ${getScoreColor(game.adminScore || 0)}`}>
                  {formatScore(game.adminScore || game.userScore)}
                </div>
                <div className="text-xs text-gray-500">Nota UQP</div>
              </div>
              <div className="text-right hidden md:block">
                <div className="text-lg font-bold text-gray-300">{game.metacriticScore}</div>
                <div className="text-xs text-gray-500">Metacritic</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <div className="text-6xl mb-4">🎮</div>
          <p className="text-xl">Nenhum jogo encontrado</p>
          <p className="text-sm mt-2">Tente outro termo ou remova os filtros</p>
        </div>
      )}
    </div>
  );
}
