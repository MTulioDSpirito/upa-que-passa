import Link from "next/link";
import { Users, ArrowRight, Sparkles } from "lucide-react";

export default function AboutUs() {
  const team = [
    { name: "André", role: "O Cara", avatar: "/team/andre-abertura.png" },
    { name: "Capelli", role: "Dev / Player Linear", avatar: "/team/cappeli-abertura.png" },
    { name: "Fael", role: "Lenda", avatar: "/team/fae-abertura.png" },
    { name: "Ique", role: "Pai dos games", avatar: "/team/ique-abertura.png" },
    { name: "Mateus", role: "Manja do Indie", avatar: "/team/mateus-abertura.png" },
    { name: "Patrão", role: "Crítico de Plantão", avatar: "/team/patrao-abertura.png" },
    { name: "inTúlio", role: "Dev / Player FPS", avatar: "/team/tulio-abertura.png" },
  ];

  return (
    <section className="relative max-w-7xl mx-auto px-6 py-20 bg-[#0c0c14]/40 border border-white/5 rounded-3xl mb-16 overflow-hidden backdrop-blur-sm shadow-[0_0_50px_-12px_rgba(168,85,247,0.15)]">
      {/* Luzes de Fundo Gradientes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* A História & Chamada principal */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="relative w-fit mb-8 select-none transform -rotate-2 hover:rotate-2 hover:scale-105 transition-all duration-300 cursor-pointer">
            {/* Cartoonish thick offset shadow */}
            <div className="absolute inset-0 bg-purple-600 rounded-xl translate-x-1.5 translate-y-1.5 border-2 border-purple-400" />
            
            {/* Main Badge Container */}
            <div className="relative flex items-center gap-2.5 text-xs font-black uppercase tracking-widest text-white bg-gradient-to-r from-purple-500 to-indigo-600 border-2 border-white px-4 py-2 rounded-xl">
              <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" />
              <span>Quem Somos</span>
              
              {/* Mini comic sticker tag */}
              <div className="absolute -top-3.5 -right-3.5 bg-yellow-400 text-black border-2 border-black text-[9px] font-black px-1.5 py-0.5 rounded-md rotate-12 shadow-sm uppercase">
                UQP!
              </div>
            </div>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-6">
            De um grupo de <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">WhatsApp</span> para o Brasil!
          </h2>
          
          <p className="text-gray-300 text-base leading-relaxed mb-4">
            Nascemos da amizade e da paixão pura pelos jogos. O que começou como debates diários sobre notas, conquistas e lançamentos entre 7 amigos transformou-se em um portal de entretenimento gamer completo.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Hoje, produzimos análises honestas, reviews técnicas em vídeo, curadoria de ofertas e rankings imperdíveis para ajudar você a decidir sua próxima jornada.
          </p>

          <Link href="/quem-somos" className="group w-fit">
            <div className="inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_30px_rgba(168,85,247,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
              <span>CONHEÇA NOSSA EQUIPE</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </div>
          </Link>
        </div>

        {/* O Time (Visual Teaser) */}
        <div className="lg:col-span-7 bg-white/[0.02] border border-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Os 7 Fundadores do UQP
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {team.map((member) => (
              <div
                key={member.name}
                className="group/card bg-[#121220]/70 border border-white/5 p-4 rounded-xl text-center hover:border-purple-500/30 hover:bg-[#16162a]/90 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(168,85,247,0.1)] hover:-translate-y-1"
              >
                <div className="relative w-16 h-16 mx-auto mb-3">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-full opacity-0 group-hover/card:opacity-100 blur-[8px] transition-all duration-300" />
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="relative w-16 h-16 rounded-full bg-purple-950/20 border border-white/10 group-hover/card:border-purple-400 transition-all duration-300 object-cover"
                  />
                </div>
                <h4 className="font-bold text-white text-sm group-hover/card:text-purple-300 transition-colors truncate">
                  {member.name}
                </h4>
                <p className="text-[11px] text-gray-500 mt-1 truncate">
                  {member.role}
                </p>
              </div>
            ))}

            {/* Card extra em formato de Teaser que instiga curiosidade */}
            <Link 
              href="/quem-somos"
              className="group/teaser flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/10 to-blue-900/10 border border-dashed border-purple-500/20 hover:border-purple-500/50 p-4 rounded-xl text-center transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-3 group-hover/teaser:bg-purple-500/20 transition-all">
                <Sparkles className="w-5 h-5 text-purple-400 group-hover/teaser:rotate-12 transition-transform" />
              </div>
              <h4 className="font-bold text-purple-400 text-xs transition-colors">
                E muito mais...
              </h4>
              <p className="text-[10px] text-gray-500 mt-1">
                Conheça nossa trajetória completa
              </p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
