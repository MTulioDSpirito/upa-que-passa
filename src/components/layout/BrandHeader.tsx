"use client";

import { usePathname } from "next/navigation";

export default function BrandHeader() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  // No painel administrativo, não exibimos o header de marca
  if (isAdmin) {
    return null;
  }

  return (
    <header className="relative w-full bg-[#07070a] border-b border-purple-900/20">
      {/* ─── BANNER SUPERIOR ────────────────────────────────────── */}
      <div className="relative w-full h-44 sm:h-56 md:h-64 overflow-hidden bg-black/40">
        <img
          src="/upa_que_passa_banner.jpeg"
          alt="Upa que Passa Banner"
          className="w-full h-full object-cover object-center opacity-85"
        />
        {/* Gradiente de sombra sobre o banner para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      </div>

      {/* ─── LOGOTIPO E BARRA DE IDENTIDADE ──────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 sm:-mt-20 pb-4 relative z-10">
          {/* Logo do Canal */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-purple-600 bg-[#0f0f18] shadow-2xl shadow-purple-900/50 flex-shrink-0 animate-pulse-slow transition-all duration-300 ease-out cursor-pointer animate-glitch-hover">
            <img
              src="/logo_upa_que_passa.jpg"
              alt="Upa que Passa Logo"
              className="w-full h-full object-cover transition-all duration-300 ease-out"
            />
          </div>

          {/* Nome e Descrição */}
          <div className="mb-2 flex-1 min-w-0">
            {/* Badges/Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[9px] font-mono font-bold tracking-widest text-purple-400 bg-purple-950/20 border-l-2 border-l-purple-500 border-y border-r border-purple-500/20 rounded-r shadow-[0_0_10px_rgba(168,85,247,0.15)] backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                // OFICIAL
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 text-[9px] font-mono font-bold tracking-widest text-[#00a2ff] bg-blue-950/20 border-l-2 border-l-[#00a2ff] border-y border-r border-[#00a2ff]/20 rounded-r shadow-[0_0_10px_rgba(0,162,255,0.15)] backdrop-blur-sm">
                [PS5]
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 text-[9px] font-mono font-bold tracking-widest text-[#39ff14] bg-emerald-950/20 border-l-2 border-l-[#39ff14] border-y border-r border-[#39ff14]/20 rounded-r shadow-[0_0_10px_rgba(57,255,20,0.15)] backdrop-blur-sm">
                [PC]
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 text-[9px] font-mono font-bold tracking-widest text-[#ff0055] bg-rose-950/20 border-l-2 border-l-[#ff0055] border-y border-r border-[#ff0055]/20 rounded-r shadow-[0_0_10px_rgba(255,0,85,0.15)] backdrop-blur-sm">
                [SWITCH]
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center gap-x-2 flex-wrap">
              <span className="text-white bg-clip-text bg-gradient-to-b from-white via-white to-gray-300">
                UPA
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
                QUE
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0072ce] to-[#00d0ff] drop-shadow-[0_0_15px_rgba(0,114,206,0.4)]">
                PASSA
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-xl font-medium leading-relaxed drop-shadow-sm">
              Portal brasileiro de{" "}
              <span className="text-white font-semibold underline decoration-purple-500/40 decoration-2 underline-offset-2">
                reviews
              </span>
              ,{" "}
              <span className="text-white font-semibold underline decoration-purple-500/40 decoration-2 underline-offset-2">
                notícias
              </span>{" "}
              e{" "}
              <span className="text-purple-300 font-semibold underline decoration-[#0072ce]/40 decoration-2 underline-offset-2">
                marketplace
              </span>{" "}
              de jogos para{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a2ff] to-[#00d0ff] font-bold">
                PS5
              </span>
              ,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] to-[#4facfe] font-bold">
                PC
              </span>{" "}
              e{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4b4b] to-[#ff6b6b] font-bold">
                Switch
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
