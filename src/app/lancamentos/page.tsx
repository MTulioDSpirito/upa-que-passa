import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { formatDate } from "@/lib/data";
import { readAdminGames } from "@/lib/adminGames";
import { readAdminReviews } from "@/lib/adminReviews";
import { Game } from "@/lib/types";
import RecentGamesList from "./RecentGamesList";
import GameImage from "@/components/GameImage";

export const dynamic = "force-dynamic";

const UPCOMING = [
  { id: "u1", title: "Assassin's Creed Black Flag Resynced", developer: "Ubisoft Montpellier", releaseDate: "2026-07-09", cover: "https://media.rawg.io/media/screenshots/990/99088f6f170459244defd7afd9fce096.jpg", platforms: ["PS5", "Xbox Series X|S", "PC"], genres: ["Ação", "Aventura"] },
  { id: "u2", title: "Marvel's Wolverine", developer: "Insomniac Games", releaseDate: "2026-09-15", cover: "https://media.rawg.io/media/games/28d/28d61be51ec0411e24c28f71122dcaaf.jpeg", platforms: ["PS5"], genres: ["Ação", "Aventura"] },
  { id: "u3", title: "GTA VI", developer: "Rockstar Games", releaseDate: "2026-11-19", cover: "https://media.rawg.io/media/games/734/7342a1cd82c8997ec620084ae4c2e7e4.jpg", platforms: ["PS5", "Xbox Series X|S"], genres: ["Ação", "Mundo Aberto"] },
  { id: "u4", title: "Halo: Campaign Evolved", developer: "Halo Studios", releaseDate: "2026-07-28", cover: "https://media.rawg.io/media/screenshots/c44/c445c015eb08b156eed3f047f9718508.jpg", platforms: ["PS5", "Xbox Series X|S", "PC"], genres: ["Tiro em Primeira Pessoa", "Ação"] },
  { id: "u5", title: "Onimusha: Way of the Sword", developer: "Capcom", releaseDate: "2026-09-04", cover: "https://media.rawg.io/media/screenshots/965/9653d36f42d6a7a360c99963253384ff.jpg", platforms: ["PS5", "Xbox Series X|S", "PC", "Switch 2"], genres: ["Ação", "Aventura", "RPG"] },
  { id: "u6", title: "Control Resonant", developer: "Remedy Entertainment", releaseDate: "2026-09-24", cover: "https://media.rawg.io/media/screenshots/5b8/5b812f73e4c5df28630747c52f57170b.jpg", platforms: ["PS5", "Xbox Series X|S", "PC"], genres: ["Ação", "Aventura"] },
  { id: "u7", title: "Silent Hill: Townfall", developer: "Screen Burn Interactive", releaseDate: "2026-09-24", cover: "https://media.rawg.io/media/games/d1c/d1c4e52d3084231530fcab5d90033d42.jpg", platforms: ["PS5", "PC"], genres: ["Terror", "Aventura"] },
];

const RECENT_WINDOW_DAYS = 60;

function selectRecentGames(games: Game[]): Game[] {
  const now = Date.now();
  const cutoff = now - RECENT_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  return games
    .filter((g) => {
      const releaseTime = new Date(g.releaseDate).getTime();
      return releaseTime <= now && releaseTime >= cutoff;
    })
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
}

function selectUpcomingAdminGames(adminGames: Game[]) {
  const now = Date.now();
  return adminGames
    .filter((g) => new Date(g.releaseDate).getTime() > now)
    .map((g) => ({
      id: g.id,
      title: g.title,
      developer: g.developer,
      releaseDate: g.releaseDate,
      cover: g.cover,
      platforms: g.platforms,
      genres: g.genres,
    }));
}

function parseReleaseDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);
  const monthName = dateObj.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "").toUpperCase();
  const dayStr = String(day).padStart(2, "0");
  const yearStr = String(year);
  return { day: dayStr, month: monthName, year: yearStr };
}

export default async function LancamentosPage() {
  const adminGames = await readAdminGames();
  const adminReviews = await readAdminReviews();
  const recentGames = selectRecentGames(adminGames);
  const upcoming = [...UPCOMING, ...selectUpcomingAdminGames(adminGames)].sort(
    (a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-2">Lançamentos</h1>
        <p className="text-gray-400">Os jogos mais recentes e os que estão por vir</p>
      </div>

      {/* Em breve */}
      <section className="mb-12" id="em-breve">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-orange-400" />
          Calendário de Lançamentos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {upcoming.map((game) => {
            const { day, month, year } = parseReleaseDate(game.releaseDate);
            
            // Calculate days remaining
            const diffTime = new Date(game.releaseDate).getTime() - Date.now();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const countdownText = diffDays > 0 ? `Faltam ${diffDays} dias` : "Hoje!";

            return (
              <div key={game.id} className="group relative bg-[#0f0f18]/60 border border-white/5 rounded-2xl overflow-hidden hover:border-orange-500/30 hover:shadow-[0_0_20px_rgba(249,115,22,0.08)] hover:bg-[#141422] transition-all duration-300 flex flex-col">
                {/* Cover Preview & Overlays */}
                <div className="relative h-44 overflow-hidden shrink-0">
                  <GameImage
                    src={game.cover}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f18] via-transparent to-black/40" />

                  {/* Floating Calendar Leaf Badge */}
                  <div className="absolute top-3 left-3 flex flex-col items-center justify-center w-12 h-14 bg-[#0f0f18]/90 border border-white/10 rounded-xl overflow-hidden shadow-lg backdrop-blur-md">
                    <div className="w-full bg-orange-500 text-[8px] font-black text-center text-white py-0.5 font-mono uppercase tracking-widest leading-none">
                      {month}
                    </div>
                    <div className="flex-1 flex flex-col justify-center items-center px-1">
                      <span className="text-lg font-black text-white leading-none">{day}</span>
                      <span className="text-[6px] text-gray-500 font-mono font-bold mt-0.5">{year}</span>
                    </div>
                  </div>

                  {/* Countdown Badge */}
                  <div className="absolute bottom-3 right-3 bg-[#0f0f18]/80 border border-white/10 backdrop-blur-md rounded-lg px-2 py-0.5 text-[9px] font-mono font-bold text-orange-400">
                    {countdownText}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-white text-base group-hover:text-orange-400 transition-colors line-clamp-1 mb-1" title={game.title}>
                      {game.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">{game.developer}</p>
                  </div>

                  {/* Platforms */}
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-white/5">
                    {game.platforms.slice(0, 2).map((p) => (
                      <span key={p} className="text-[9px] font-mono bg-blue-900/10 text-blue-400 border border-blue-800/10 px-1.5 py-0.2 rounded">
                        {p}
                      </span>
                    ))}
                    {game.genres.slice(0, 1).map((g) => (
                      <span key={g} className="text-[9px] font-mono bg-purple-900/10 text-purple-400 border border-purple-800/10 px-1.5 py-0.2 rounded">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recentes */}
      <RecentGamesList games={recentGames} reviews={adminReviews} />
    </div>
  );
}
