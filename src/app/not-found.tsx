"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, ArrowLeft, RefreshCw, AlertTriangle, ShieldAlert } from "lucide-react";

export default function NotFound() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#07070a] text-white py-12 px-4 md:px-8 relative overflow-hidden hero-glow-bg font-sans">
        {/* Background glow effects matching admin color palette */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-md w-full relative z-10 text-center">
          {/* Admin styled container */}
          <div className="bg-[#0f0f18]/80 border border-purple-500/20 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative">
            
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 select-none">
              <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-purple-300 bg-purple-950/80 border border-purple-500/30 px-4 py-1.5 rounded-full">
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                <span>Painel Administrativo</span>
              </span>
            </div>

            <div className="mt-4 space-y-6">
              <div className="flex justify-center pt-2">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl border border-purple-500/20 flex items-center justify-center text-purple-400 animate-pulse">
                  <AlertTriangle className="w-8 h-8" />
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-black text-white mb-2">Erro 404: Seção Não Encontrada</h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                  A rota administrativa solicitada não existe ou foi removida do painel.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Link
                  href="/admin"
                  className="btn-press w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold text-sm transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar ao Painel</span>
                </Link>
                
                <button
                  onClick={() => window.location.reload()}
                  className="btn-press w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-semibold border border-white/10 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Tentar Novamente</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-[#07070a] text-white py-12 px-4 md:px-8 relative overflow-hidden hero-glow-bg font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 text-center">
        {/* Retro Game Cabinet / Dialog Frame */}
        <div className="bg-[#121220] border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_#000] hover:shadow-[12px_12px_0px_0px_rgba(168,85,247,0.3)] transition-all duration-300 relative">
          
          {/* Slanted Retro Badge */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 -rotate-3 select-none">
            <div className="absolute inset-0 bg-red-500 rounded-xl translate-x-1 translate-y-1 border-4 border-black" />
            <div className="relative flex items-center gap-2 text-sm font-black uppercase tracking-wider text-black bg-white border-4 border-black px-5 py-2">
              <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />
              <span>ERRO 404</span>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {/* Huge Retro Style Title */}
            <h1 className="text-4xl font-black font-display tracking-tight text-white leading-none uppercase">
              GAME <span className="text-red-500 bg-black px-2 py-0.5 inline-block transform rotate-1">OVER</span>
            </h1>

            <div className="flex justify-center py-4">
              <div className="relative w-24 h-24 bg-red-500/10 border-4 border-black rounded-2xl flex items-center justify-center transform -rotate-6">
                <Gamepad2 className="w-12 h-12 text-red-500 animate-bounce" />
              </div>
            </div>

            <p className="text-gray-300 font-bold leading-relaxed text-sm md:text-base border-t-2 border-black/40 pt-4">
              A rota solicitada não existe ou foi removida pelo chefe da fase. 
              Cheque o endereço ou volte ao ponto de salvamento!
            </p>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2 font-black uppercase tracking-wider">
              <Link
                href="/"
                className="btn-press w-full flex items-center justify-center gap-2 py-3 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000] transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Ponto de Respawn (Home)</span>
              </Link>
              
              <button
                onClick={() => window.location.reload()}
                className="btn-press w-full flex items-center justify-center gap-2 py-3 bg-[#1b1b30] hover:bg-[#23233e] text-white rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000] transition-all text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Tentar Novamente</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

