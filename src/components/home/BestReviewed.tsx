import Link from "next/link";
import { Star, ChevronRight, Trophy, Award } from "lucide-react";
import { Game } from "@/lib/types";
import { getScoreColor, formatScore } from "@/lib/data";

interface BestReviewedProps {
  games: Game[];
}

export default function BestReviewed({ games }: BestReviewedProps) {
  // Filter games that have a team evaluation (adminScore / Nota UQP) and sort them in descending order
  const topThreeGames = [...games]
    .filter((game) => game.adminScore !== undefined && game.adminScore !== null)
    .sort((a, b) => (b.adminScore || 0) - (a.adminScore || 0))
    .slice(0, 3);

  // Styling properties per placement (1st, 2nd, 3rd)
  const podiumStyles = [
    {
      borderColor: "border-yellow-400/30 hover:border-yellow-400/60 hover:shadow-yellow-500/10",
      medal: "🥇",
      badgeColor: "bg-yellow-400 text-black",
      rankText: "1º Lugar",
      rankTextColor: "text-yellow-400",
      glow: "shadow-lg shadow-yellow-500/5",
    },
    {
      borderColor: "border-slate-300/30 hover:border-slate-300/60 hover:shadow-slate-300/10",
      medal: "🥈",
      badgeColor: "bg-slate-300 text-black",
      rankText: "2º Lugar",
      rankTextColor: "text-slate-300",
      glow: "shadow-md shadow-slate-300/5",
    },
    {
      borderColor: "border-amber-700/30 hover:border-amber-700/60 hover:shadow-amber-800/10",
      medal: "🥉",
      badgeColor: "bg-amber-700 text-white",
      rankText: "3º Lugar",
      rankTextColor: "text-amber-600",
      glow: "shadow-md shadow-amber-700/5",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: CTA Box and Title */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-gradient-to-br from-[#0f0f18]/90 to-[#1b1035]/40 border border-purple-500/10 rounded-3xl p-8 hover:border-purple-500/20 transition-all duration-300 shadow-xl shadow-purple-950/10">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Trophy className="w-8 h-8 text-yellow-400 drop-shadow-[0_2px_8px_rgba(234,179,8,0.3)] hover:scale-110 transition-transform duration-300" />
              
              <div className="relative w-fit select-none transform -rotate-2 hover:rotate-2 hover:scale-105 transition-all duration-300 cursor-pointer">
                {/* Cartoonish thick offset shadow */}
                <div className="absolute inset-0 bg-purple-600 rounded-xl translate-x-1.5 translate-y-1.5 border-2 border-purple-400" />
                
                {/* Main Badge Container */}
                <div className="relative flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white bg-gradient-to-r from-purple-500 to-indigo-600 border-2 border-white px-3.5 py-1.5 rounded-xl">
                  <span>Editorial UQP</span>
                  
                  {/* Mini comic sticker tag */}
                  <div className="absolute -top-3.5 -right-3.5 bg-yellow-400 text-black border-2 border-black text-[9px] font-black px-1.5 py-0.5 rounded-md rotate-12 shadow-sm uppercase">
                    Top 3!
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl font-black text-white leading-tight mb-4 font-display">
              Os Campeões da Equipe
            </h2>
            
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Estes são os três melhores jogos na avaliação exclusiva da nossa equipe. Cada nota representa a nossa opinião sincera sobre jogabilidade, diversão e qualidade técnica.
            </p>
          </div>

          <div className="border-t border-white/5 pt-6 mt-6">
            <h4 className="text-white font-bold text-sm flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-purple-400" /> Quer ver todos?
            </h4>
            <p className="text-gray-400 text-xs mb-4">
              Explore o ranking completo com todas as notas atribuídas pela nossa equipe até agora.
            </p>
            <Link 
              href="/ranking" 
              className="inline-flex w-full items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm py-3 px-5 rounded-2xl transition-all hover:shadow-lg hover:shadow-purple-600/30 btn-press"
            >
              Acessar Ranking Completo <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Side: The 3 Podium Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topThreeGames.map((game, index) => {
            const style = podiumStyles[index] || podiumStyles[2];
            return (
              <Link
                key={game.id}
                href={`/reviews/${game.slug}`}
                className={`group relative bg-[#0f0f18]/60 backdrop-blur border rounded-2xl p-4 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${style.borderColor} ${style.glow}`}
              >
                {/* Medal and Rank Header */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl">{style.medal}</span>
                  <span className={`text-xs font-black uppercase tracking-widest ${style.rankTextColor}`}>
                    {style.rankText}
                  </span>
                </div>

                {/* Cover Image */}
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-4">
                  <img
                    src={game.cover}
                    alt={game.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Score badge overlay on cover */}
                  <div className={`absolute bottom-2 right-2 px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1.5 ${style.badgeColor}`}>
                    <span>UQP</span>
                    <span className="text-sm font-extrabold">{formatScore(game.adminScore || 0)}</span>
                  </div>
                </div>

                {/* Game Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm leading-tight group-hover:text-purple-300 transition-colors line-clamp-2 mb-1">
                      {game.title}
                    </h3>
                    <p className="text-[10px] text-gray-500 mb-3">{game.developer}</p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {game.genres.slice(0, 2).map((g) => (
                      <span key={g} className="text-[9px] text-purple-400 bg-purple-900/20 px-2 py-0.5 rounded-full">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
