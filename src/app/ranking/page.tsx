"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Trophy, Star, TrendingUp, Calendar, SlidersHorizontal } from "lucide-react";
import { getScoreColor, formatScore } from "@/lib/data";
import { useAllGames } from "@/hooks/useAllGames";
import CardCover from "@/components/ui/CardCover";

const CATEGORIES = [
  { id: "geral", label: "🏆 Geral", genre: null },
  { id: "rpg", label: "⚔️ RPG", genre: "RPG" },
  { id: "acao", label: "💥 Ação", genre: "Ação" },
  { id: "aventura", label: "🗺️ Aventura", genre: "Aventura" },
  { id: "terror", label: "👻 Terror", genre: "Terror" },
];

const PLATFORMS = [
  { id: "all", label: "Todas Plataformas" },
  { id: "PS5", label: "PlayStation 5" },
  { id: "Xbox", label: "Xbox" },
  { id: "PC", label: "PC" },
];

const MONTHS = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Março" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" },
];

export default function RankingPage() {
  const [GAMES] = useAllGames();
  const [sortBy, setSortBy] = useState<"uqp" | "users" | "metacritic">("uqp");
  const [platform, setPlatform] = useState<string>("all");
  const [period, setPeriod] = useState<"all" | "year" | "month">("all");
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  // Dynamically get available years from GAMES
  const availableYears = useMemo(() => {
    const years = GAMES.map((g) => new Date(g.releaseDate).getFullYear());
    return Array.from(new Set(years)).sort((a, b) => b - a);
  }, [GAMES]);

  // Filter and Sort logic
  const filteredAndSortedGames = useMemo(() => {
    return [...GAMES]
      .filter((game) => {
        // Platform Filter
        if (platform !== "all") {
          const match = game.platforms?.some((p) => {
            const platLower = p.toLowerCase();
            const filterLower = platform.toLowerCase();
            if (filterLower === "ps5") {
              return platLower.includes("ps5") || platLower.includes("playstation");
            }
            return platLower.includes(filterLower);
          });
          if (!match) return false;
        }

        // Genre Filter
        if (activeGenre) {
          if (!game.genres?.includes(activeGenre)) return false;
        }

        // Period Filter
        if (period !== "all") {
          const date = new Date(game.releaseDate);
          const year = date.getFullYear();
          if (year !== selectedYear) return false;

          if (period === "month") {
            const month = date.getMonth() + 1;
            if (month !== selectedMonth) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;

        if (sortBy === "uqp") {
          scoreA = a.adminScore || a.worldAvg || 0;
          scoreB = b.adminScore || b.worldAvg || 0;
        } else if (sortBy === "users") {
          scoreA = a.userScore || 0;
          scoreB = b.userScore || 0;
        } else if (sortBy === "metacritic") {
          scoreA = a.metacriticScore || 0;
          scoreB = b.metacriticScore || 0;
        }

        return scoreB - scoreA;
      });
  }, [GAMES, platform, activeGenre, period, selectedYear, selectedMonth, sortBy]);

  // Podium games layout helper (displays 2nd, 1st, 3rd)
  const podiumGames = useMemo(() => {
    const top3 = filteredAndSortedGames.slice(0, 3);
    if (top3.length === 3) {
      return [
        { game: top3[1], pos: 1, medal: "🥈", color: "border-gray-400", bg: "bg-gray-400 text-black" },
        { game: top3[0], pos: 0, medal: "🥇", color: "border-yellow-400", bg: "bg-yellow-400 text-black" },
        { game: top3[2], pos: 2, medal: "🥉", color: "border-orange-400", bg: "bg-orange-400 text-black" },
      ];
    } else if (top3.length === 2) {
      return [
        { game: top3[1], pos: 1, medal: "🥈", color: "border-gray-400", bg: "bg-gray-400 text-black" },
        { game: top3[0], pos: 0, medal: "🥇", color: "border-yellow-400", bg: "bg-yellow-400 text-black" },
      ];
    } else if (top3.length === 1) {
      return [
        { game: top3[0], pos: 0, medal: "🥇", color: "border-yellow-400", bg: "bg-yellow-400 text-black" },
      ];
    }
    return [];
  }, [filteredAndSortedGames]);

  // Helper to format correct score value based on current sort type
  const getDisplayScore = (game: typeof GAMES[0]) => {
    if (sortBy === "uqp") {
      const val = game.adminScore || game.worldAvg || 0;
      return { val: formatScore(val), label: "Nota UQP" };
    }
    if (sortBy === "users") {
      const val = game.userScore || 0;
      return { val: val ? val.toFixed(1) : "—", label: "Usuários" };
    }
    const val = game.metacriticScore || 0;
    return { val: val ? val.toString() : "—", label: "Metacritic" };
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <h1 className="text-4xl font-black text-white">Ranking de Jogos</h1>
        </div>
        <p className="text-gray-400">
          Descubra e filtre os melhores jogos avaliados pela nossa equipe e pela comunidade
        </p>
      </div>

      {/* Glassmorphic Filter Box */}
      <div className="bg-[#0f0f18]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 mb-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Sort By */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
              Ordenar por
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-[#181824] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="uqp">Nota UQP</option>
                <option value="users">Nota Usuários</option>
                <option value="metacritic">Metacritic</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
              Plataforma
            </label>
            <div className="relative">
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-[#181824] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500 focus:outline-none appearance-none cursor-pointer"
              >
                {PLATFORMS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Period Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
              Período
            </label>
            <div className="relative">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="w-full bg-[#181824] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="all">Geral (Histórico)</option>
                <option value="year">Top Anual</option>
                <option value="month">Top Mensal</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Conditional Year / Month Controls */}
          {(period === "year" || period === "month") && (
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                  Ano
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full bg-[#181824] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500 focus:outline-none cursor-pointer"
                >
                  {availableYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {period === "month" && (
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                    Mês
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="w-full bg-[#181824] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500 focus:outline-none cursor-pointer"
                  >
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Categories Pills */}
        <div className="border-t border-white/5 pt-4">
          <label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
            Filtrar por Gênero
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = activeGenre === cat.genre;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveGenre(cat.genre)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Podium */}
      {podiumGames.length > 0 && (
        <div className="grid grid-cols-3 gap-4 items-end mb-12 max-w-2xl mx-auto bg-[#0a0a12]/30 border border-white/5 p-6 rounded-3xl backdrop-blur-sm">
          {podiumGames.map(({ game, pos, medal, color, bg }) => {
            const displayScore = getDisplayScore(game);
            const scoreNum = sortBy === "uqp" ? (game.adminScore || game.worldAvg || 0) : sortBy === "users" ? (game.userScore || 0) : (game.metacriticScore ? game.metacriticScore / 10 : 0);

            return (
              <Link
                key={game.id}
                href={`/reviews/${game.slug}`}
                className={`group flex flex-col items-center transition-transform hover:scale-[1.02] ${
                  pos === 0 ? "order-2" : pos === 1 ? "order-1" : "order-3"
                }`}
              >
                <div className="text-4xl mb-2 filter drop-shadow">{medal}</div>
                <div
                  className={`relative mb-3 overflow-hidden rounded-2xl border-2 ${color} shadow-2xl ${
                    pos === 0 ? "w-28 h-40" : "w-24 h-32"
                  }`}
                >
                  <CardCover src={game.cover} alt={game.title} />
                  <div
                    className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shadow-lg ${bg}`}
                  >
                    #{pos + 1}
                  </div>
                </div>
                <p className="text-xs font-bold text-white text-center line-clamp-2 mb-1 px-1">
                  {game.title}
                </p>
                <div className={`text-lg font-black ${getScoreColor(scoreNum)}`}>
                  {displayScore.val}
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                  {displayScore.label}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Full ranking */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          Ranking Completo
          {period === "year" && ` — Ano ${selectedYear}`}
          {period === "month" && ` — ${MONTHS.find((m) => m.value === selectedMonth)?.label}/${selectedYear}`}
        </h2>

        {filteredAndSortedGames.length > 0 ? (
          filteredAndSortedGames.map((game, i) => {
            const displayScore = getDisplayScore(game);
            const scoreNum = sortBy === "uqp" ? (game.adminScore || game.worldAvg || 0) : sortBy === "users" ? (game.userScore || 0) : (game.metacriticScore ? game.metacriticScore / 10 : 0);

            return (
              <Link
                key={game.id}
                href={`/reviews/${game.slug}`}
                className="flex items-center gap-4 bg-[#0f0f18]/80 border border-white/5 rounded-2xl p-4 hover:border-purple-500/20 transition-all hover:bg-[#131322] group"
              >
                <div
                  className={`text-xl font-black w-10 text-center ${
                    i === 0
                      ? "text-yellow-400"
                      : i === 1
                      ? "text-gray-400"
                      : i === 2
                      ? "text-orange-400"
                      : "text-gray-500"
                  }`}
                >
                  #{i + 1}
                </div>

                <img
                  src={game.cover}
                  alt={game.title}
                  className="w-12 h-16 object-cover rounded-xl flex-shrink-0 shadow-md border border-white/5"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/cover_conteudo_nao_disponivel.png";
                  }}
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                    {game.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <p className="text-xs text-gray-500">
                      {game.developer} · {new Date(game.releaseDate).getFullYear()}
                    </p>
                    <div className="flex gap-1.5 animate-fade-in">
                      {game.platforms?.map((plat) => (
                        <span
                          key={plat}
                          className="text-[9px] font-semibold text-gray-400 bg-white/5 border border-white/5 px-1.5 py-0.2 rounded"
                        >
                          {plat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-1.5">
                    {game.genres.slice(0, 2).map((g) => (
                      <span
                        key={g}
                        className="text-[10px] text-purple-400 bg-purple-900/20 px-2 py-0.5 rounded-full"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block">
                    <div className="text-sm font-semibold text-gray-400">
                      {game.metacriticScore || "—"}
                    </div>
                    <div className="text-xs text-gray-500">Metacritic</div>
                  </div>
                  <div className="text-right hidden md:block">
                    <div className="text-sm font-semibold text-gray-400 flex items-center gap-1 justify-end">
                      <Star
                        className={`w-3 h-3 ${
                          game.userScore ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
                        }`}
                      />
                      {game.userScore ? game.userScore.toFixed(1) : "—"}
                    </div>
                    <div className="text-xs text-gray-500">Usuários</div>
                  </div>
                  <div className="text-right min-w-[70px]">
                    <div
                      className={`text-2xl font-black ${getScoreColor(scoreNum)}`}
                    >
                      {displayScore.val}
                    </div>
                    <div className="text-xs text-gray-500">{displayScore.label}</div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-[#0f0f18]/60 border border-white/5 rounded-2xl">
            <Trophy className="w-12 h-12 text-gray-600 mb-3" />
            <p className="text-gray-400 text-sm font-medium">Nenhum jogo encontrado para estes filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}
