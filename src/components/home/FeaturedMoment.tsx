"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Flame, ArrowRight } from "lucide-react";
import { getScoreColor, formatScore } from "@/lib/data";
import { Game } from "@/lib/types";

interface FeaturedMomentProps {
  topGame: Game;
}

export default function FeaturedMoment({ topGame }: FeaturedMomentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCentered, setIsCentered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCentered(entry.isIntersecting);
      },
      {
        rootMargin: "-20% 0px -20% 0px",
        threshold: 0.15,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12" ref={containerRef}>
      <div className="flex items-center gap-3 mb-6">
        <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
        <h2 className="text-2xl font-black text-white tracking-wide uppercase">Destaque do Momento</h2>
      </div>

      <div className="relative rounded-3xl bg-gradient-to-r from-[#181822] to-[#121218] border border-white/5 p-6 sm:p-10 flex gap-8 flex-wrap lg:flex-nowrap items-center overflow-hidden shadow-2xl">
        {/* Glow Effects in the background */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Mascot (replaces the character on the left) */}
        <div className="w-full lg:w-auto flex justify-center items-center flex-shrink-0 relative z-10 py-4 lg:py-0">
          <div className="relative group">
            {/* Outer glow aura that scales with the logo */}
            <div className={`absolute inset-0 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full blur-2xl opacity-20 transition-all duration-1000 ease-out ${
              isCentered ? "scale-130 opacity-30" : "scale-90"
            }`} />
            
            <img
              src="/logo-icon.png"
              alt="Upa que passa Mascot"
              className={`w-32 h-32 sm:w-40 sm:h-40 object-contain transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) transform select-none ${
                isCentered 
                  ? "scale-115 rotate-2 filter drop-shadow-[0_10px_20px_rgba(168,85,247,0.4)]" 
                  : "scale-95 filter drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)]"
              }`}
            />
          </div>
        </div>

        {/* Rest of the component (Cover + Info) */}
        <div className="flex-1 flex gap-6 flex-wrap sm:flex-nowrap items-center relative z-10">
          {/* Game Cover */}
          <img
            src={topGame.cover}
            alt={topGame.title}
            className="w-32 h-44 sm:w-40 sm:h-56 object-cover object-center rounded-xl shadow-lg shadow-black/40 flex-shrink-0 border border-white/5"
          />

          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex gap-2 mb-3">
              {topGame.genres.slice(0, 3).map((g) => (
                <span key={g} className="text-xs font-semibold text-purple-300 bg-purple-950/50 border border-purple-800/30 px-3 py-1 rounded-full uppercase tracking-wider">
                  {g}
                </span>
              ))}
            </div>
            
            <h3 className="font-display text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
              {topGame.title}
            </h3>
            
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl line-clamp-3">
              {topGame.synopsis}
            </p>

            {/* Scores row */}
            <div className="grid grid-cols-3 gap-3 mb-6 max-w-md">
              {[
                { label: "Nota UQP", score: topGame.adminScore },
                { label: "Metacritic", score: topGame.metacriticScore ? topGame.metacriticScore / 10 : undefined },
                { label: "Usuários", score: topGame.userScore || undefined },
              ].map((s) => (
                <div key={s.label} className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] rounded-xl p-3 text-center transition-colors">
                  <div className={`text-xl sm:text-2xl font-black tracking-tight ${s.score ? getScoreColor(s.score) : "text-gray-600"}`}>
                    {s.score ? formatScore(s.score) : "—"}
                  </div>
                  <div className="text-[11px] font-medium text-gray-400 mt-1 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Link
                href={`/jogos/${topGame.slug}`}
                className="flex items-center gap-2 px-6 py-3 text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/30 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Ver Review Completa
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

