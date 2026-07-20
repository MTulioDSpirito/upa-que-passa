"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, LogIn, Lock } from "lucide-react";

export default function AcessoNegado() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-[#07070a] text-white py-12 px-4 md:px-8 relative overflow-hidden hero-glow-bg font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 text-center">
        {/* Retro Game Cabinet / Dialog Frame */}
        <div className="bg-[#121220] border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_#000] hover:shadow-[12px_12px_0px_0px_rgba(245,158,11,0.3)] transition-all duration-300 relative">
          
          {/* Slanted Retro Badge */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 -rotate-3 select-none">
            <div className="absolute inset-0 bg-amber-500 rounded-xl translate-x-1 translate-y-1 border-4 border-black" />
            <div className="relative flex items-center gap-2 text-sm font-black uppercase tracking-wider text-black bg-white border-4 border-black px-5 py-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 animate-pulse" />
              <span>BLOQUEADO</span>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {/* Huge Retro Style Title */}
            <h1 className="text-4xl font-black font-display tracking-tight text-white leading-none uppercase">
              SEM <span className="text-amber-500 bg-black px-2 py-0.5 inline-block transform rotate-1">XP SUFICIENTE</span>
            </h1>

            <div className="flex justify-center py-4">
              <div className="relative w-24 h-24 bg-amber-500/10 border-4 border-black rounded-2xl flex items-center justify-center transform rotate-6">
                <Lock className="w-12 h-12 text-amber-500 animate-bounce" />
              </div>
            </div>

            <p className="text-gray-300 font-bold leading-relaxed text-sm md:text-base border-t-2 border-black/40 pt-4">
              Essa área exige nível de acesso que você ainda não possui ou requer autenticação.
              Por favor, realize o login para continuar sua jornada.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2 font-black uppercase tracking-wider">
              <Link
                href="/login"
                className="btn-press w-full flex items-center justify-center gap-2 py-3 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000] transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Fazer Login</span>
              </Link>
              
              <Link
                href="/"
                className="btn-press w-full flex items-center justify-center gap-2 py-3 bg-[#1b1b30] hover:bg-[#23233e] text-white rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000] transition-all text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar ao Menu Principal</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
