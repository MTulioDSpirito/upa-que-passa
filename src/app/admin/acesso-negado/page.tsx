"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home, Lock } from "lucide-react";

export default function AdminAcessoNegado() {
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
                <Lock className="w-8 h-8" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-black text-white mb-2">Acesso Restrito</h1>
              <p className="text-gray-400 text-sm leading-relaxed">
                Você não possui o nível de permissão necessário para visualizar esta seção ou realizar esta ação.
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
              
              <Link
                href="/"
                className="btn-press w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-semibold border border-white/10 transition-all"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Ir para o Site Público</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
