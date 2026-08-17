import Link from "next/link";
import { Rocket, ChevronRight, Calendar } from "lucide-react";
import { Game } from "@/lib/types";
import CardCover from "@/components/ui/CardCover";

interface UpcomingReleasesProps {
  games: Game[];
}

function formatShortDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);
  const monthName = dateObj.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
  return `${day} ${monthName} ${year}`;
}

export default function UpcomingReleases({ games }: UpcomingReleasesProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6 sm:py-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Rocket className="w-6 h-6 text-orange-400" />
          <h2 className="text-2xl font-black text-white tracking-wide uppercase">Próximos Lançamentos</h2>
        </div>
        <Link
          href="/lancamentos"
          className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-orange-400 hover:text-orange-300 transition-colors group"
        >
          Ver Todos
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Carrossel (scroll-snap) no mobile, grid a partir do sm */}
      <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/reviews/${game.slug}`}
            className="group snap-center shrink-0 w-[65%] sm:w-auto relative bg-[#0f0f18]/60 border border-white/5 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all duration-300 flex flex-col"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <CardCover src={game.cover} alt={game.title} className="group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f18] via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-md rounded-lg px-2 py-1 text-[10px] font-bold text-orange-300">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                {formatShortDate(game.releaseDate)}
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                {game.title}
              </h3>
              <p className="text-[11px] text-gray-500 truncate">{game.developer}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Botão pra todos os lançamentos — sempre visível no mobile, já que o link do header some lá */}
      <Link
        href="/lancamentos"
        className="sm:hidden mt-6 flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm rounded-xl transition-all"
      >
        Ver Todos os Lançamentos
        <ChevronRight className="w-4 h-4" />
      </Link>
    </section>
  );
}
