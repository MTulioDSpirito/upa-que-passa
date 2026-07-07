import Link from "next/link";
import { Calendar, Clock, Gamepad2 } from "lucide-react";
import { GAMES, formatDate } from "@/lib/data";
import { readAdminGames } from "@/lib/adminGames";
import { Game } from "@/lib/types";

export const dynamic = "force-dynamic";

const UPCOMING = [
  { id: "u1", title: "Assassin's Creed Black Flag Resynced", developer: "Ubisoft Montpellier", releaseDate: "2026-07-09", cover: "https://media.rawg.io/media/screenshots/990/99088f6f170459244defd7afd9fce096.jpg", platforms: ["PS5", "Xbox Series X|S", "PC"], genres: ["Ação", "Aventura"] },
  { id: "u2", title: "Marvel's Wolverine", developer: "Insomniac Games", releaseDate: "2026-09-15", cover: "https://media.rawg.io/media/games/28d/28d61be51ec0411e24c28f71122dcaaf.jpeg", platforms: ["PS5"], genres: ["Ação", "Aventura"] },
  { id: "u3", title: "GTA VI", developer: "Rockstar Games", releaseDate: "2026-11-19", cover: "https://media.rawg.io/media/games/734/7342a1cd82c8997ec620084ae4c2e7e4.jpg", platforms: ["PS5", "Xbox Series X|S"], genres: ["Ação", "Mundo Aberto"] },
];

const RECENT_WINDOW_DAYS = 180;

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

export default async function LancamentosPage() {
  const adminGames = await readAdminGames();
  const recentGames = selectRecentGames([...GAMES, ...adminGames]);
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
          Em Breve
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {upcoming.map((game) => (
            <div key={game.id} className="bg-[#111118] border border-white/5 rounded-2xl overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <img src={game.cover} alt={game.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-black text-white text-xl mb-1">{game.title}</h3>
                  <p className="text-sm text-gray-300">{game.developer}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-orange-400 mb-3">
                  <Calendar className="w-4 h-4" />
                  Previsão: {formatDate(game.releaseDate)}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {game.platforms.map((p) => (
                    <span key={p} className="text-xs bg-blue-900/20 text-blue-400 border border-blue-800/20 px-2 py-0.5 rounded-full">{p}</span>
                  ))}
                  {game.genres.map((g) => (
                    <span key={g} className="text-xs bg-purple-900/20 text-purple-400 border border-purple-800/20 px-2 py-0.5 rounded-full">{g}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recentes */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-purple-400" />
          Lançamentos Recentes
        </h2>
        {recentGames.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Gamepad2 className="w-8 h-8 mx-auto mb-3 text-gray-600" />
            <p>Nenhum lançamento nos últimos {RECENT_WINDOW_DAYS} dias.</p>
          </div>
        )}
        <div className="space-y-3">
          {recentGames.map((game) => (
            <Link
              key={game.id}
              href={`/jogos/${game.slug}`}
              className="flex items-center gap-4 bg-[#111118] border border-white/5 rounded-xl p-4 hover:border-purple-500/20 transition-all group"
            >
              <img src={game.cover} alt={game.title} className="w-12 h-16 object-cover rounded-lg" />
              <div className="flex-1">
                <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">{game.title}</h3>
                <p className="text-sm text-gray-500">{game.developer}</p>
              </div>
              <div className="text-sm text-gray-500 hidden md:block">{formatDate(game.releaseDate)}</div>
              <div className="flex gap-1">
                {game.platforms.slice(0, 2).map((p) => (
                  <span key={p} className="text-xs bg-blue-900/20 text-blue-400 px-2 py-0.5 rounded-full">{p}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
