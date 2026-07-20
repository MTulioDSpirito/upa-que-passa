import { Play, ChevronRight } from "lucide-react";
import { useAllYoutubeVideos } from "@/hooks/useAllYoutubeVideos";

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const FALLBACK_VIDEOS = [
  {
    id: "yt1",
    title: "God of War Ragnarök Vale a Pena em 2026? Análise Completa PS5",
    duration: "18:42",
    thumbnail: "https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/library_hero.jpg",
    views: "14k visualizações",
    date: "Há 3 dias",
    resolution: "4K UHD",
    videoUrl: "https://www.youtube.com/watch?v=kY31w0e80bY",
  },
  {
    id: "yt2",
    title: "Marvel's Spider-Man 2: Detalhes do Venom e Campanha Sem Spoilers",
    duration: "22:15",
    thumbnail: "https://upload.wikimedia.org/wikipedia/en/0/0f/SpiderMan2PS5BoxArt.jpeg",
    views: "28k visualizações",
    date: "Há 1 semana",
    resolution: "1080P",
    videoUrl: "https://www.youtube.com/watch?v=q6d_gsk5f4M",
  },
  {
    id: "yt3",
    title: "Será que Hogwarts Legacy ainda impressiona no PS5? Review Técnico",
    duration: "15:30",
    thumbnail: "https://cdn.cloudflare.steamstatic.com/steam/apps/990080/library_600x900.jpg",
    views: "9.5k visualizações",
    date: "Há 2 semanas",
    resolution: "4K HDR",
    videoUrl: "https://www.youtube.com/watch?v=BtyBj1NDZbA",
  },
];

export default function YouTubeVideos() {
  const dynamicVideos = useAllYoutubeVideos();
  const videos = dynamicVideos.length > 0 ? dynamicVideos : FALLBACK_VIDEOS;

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 border-t border-white/5 relative">
      {/* Custom Styles for retro CRT TV screen effects */}
      <style>{`
        @keyframes hud-scan {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
        @keyframes hud-flicker {
          0% { opacity: 0.18; }
          50% { opacity: 0.35; }
          100% { opacity: 0.18; }
        }
        .hud-scanner {
          animation: hud-scan 3s infinite linear;
        }
        .hud-flicker {
          animation: hud-flicker 0.15s infinite;
        }
      `}</style>

      {/* Cyberpunk Tech Lines Background Decorative */}
      <div className="absolute top-0 right-10 w-24 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
      <div className="absolute bottom-0 left-10 w-32 h-px bg-gradient-to-r from-transparent via-red-500/10 to-transparent" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative group">
            {/* Neon frame behind YouTube icon */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl blur-md opacity-40 group-hover:opacity-75 transition duration-500" />
            <div className="relative w-12 h-12 bg-[#0d0d12] border border-red-500/30 rounded-xl flex items-center justify-center text-white">
              <YoutubeIcon className="w-6 h-6 fill-red-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-red-500 tracking-widest uppercase font-mono">
                Transmissão Oficial
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase font-mono">
              Análises de Impacto
            </h2>
          </div>
        </div>
        <a
          href="https://www.youtube.com/@upaquepassa"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-red-400 hover:text-white bg-red-950/20 hover:bg-red-600 border border-red-500/20 hover:border-red-500 px-5 py-2.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-red-500/20 self-start sm:self-auto uppercase tracking-wider"
        >
          Inscrever-se no Canal <ChevronRight className="w-4 h-4" />
        </a>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {videos.map((video: any) => (
          <a
            key={video.id}
            href={video.videoUrl || "https://www.youtube.com/@upaquepassa"}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-[1px] bg-white/5 hover:bg-gradient-to-br hover:from-red-600 hover:to-orange-500 rounded-2xl transition-all duration-500 hover:shadow-[0_0_35px_rgba(239,68,68,0.18)] flex flex-col h-full cursor-pointer"
          >
            {/* Outer floating brackets on card corners */}
            <div className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-transparent group-hover:border-red-500 transition-all duration-300 z-20 rounded-tl-sm" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-transparent group-hover:border-red-500 transition-all duration-300 z-20 rounded-tr-sm" />
            <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-transparent group-hover:border-red-500 transition-all duration-300 z-20 rounded-bl-sm" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-transparent group-hover:border-red-500 transition-all duration-300 z-20 rounded-br-sm" />

            {/* Inner Content Wrapper */}
            <div className="bg-[#07070c] rounded-[15px] overflow-hidden flex flex-col h-full w-full relative z-10">
              
              {/* Thumbnail Wrapper with HUD Camera View */}
              <div className="relative aspect-video overflow-hidden bg-neutral-950 flex items-center justify-center border-b border-white/5">
                {/* HUD Screen Scanline Overlay (Always visible, intensified and flickering on hover) */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.45)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40 group-hover:opacity-75 group-hover:hud-flicker transition-all duration-300 z-10" />

                {/* Glowing Scan Line Animation (Intense red beam with double shadow glow) */}
                <div className="hud-scanner absolute left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_10px_#ef4444,0_0_5px_#ef4444] pointer-events-none hidden group-hover:block z-10" />

                {/* REC Badge */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded border border-red-500/30 text-[9px] uppercase font-bold text-red-500 tracking-wider font-mono">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full group-hover:animate-ping" />
                  <span>REC</span>
                </div>

                {/* Video Specs Badge */}
                <div className="absolute top-3 right-3 z-20 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 text-[9px] uppercase font-semibold text-gray-300 tracking-widest font-mono">
                  {video.resolution}
                </div>

                {/* Target Brackets HUD */}
                <div className="absolute inset-3 border border-white/0 group-hover:border-red-500/10 transition-colors duration-500 pointer-events-none z-10">
                  <div className="w-2.5 h-2.5 border-t border-l border-white/30 group-hover:border-red-500/50 absolute top-0 left-0 transition-colors duration-300" />
                  <div className="w-2.5 h-2.5 border-t border-r border-white/30 group-hover:border-red-500/50 absolute top-0 right-0 transition-colors duration-300" />
                  <div className="w-2.5 h-2.5 border-b border-l border-white/30 group-hover:border-red-500/50 absolute bottom-0 left-0 transition-colors duration-300" />
                  <div className="w-2.5 h-2.5 border-b border-r border-white/30 group-hover:border-red-500/50 absolute bottom-0 right-0 transition-colors duration-300" />
                </div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 opacity-60 group-hover:opacity-85 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

                {/* Play Button HUD style */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-all duration-500 z-10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-700 to-red-500 text-white flex items-center justify-center shadow-xl shadow-red-950/50 border border-red-500/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-red-500/30">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Time stamp */}
                <span className="absolute bottom-3 right-3 text-[10px] bg-black/85 backdrop-blur-md px-2 py-0.5 rounded font-bold font-mono text-white border border-white/10 z-10">
                  {video.duration}
                </span>
              </div>

              {/* Video Info Details with technical layout grid pattern */}
              <div className="p-5 flex flex-col flex-grow justify-between relative bg-gradient-to-b from-[#08080d] to-[#040407] bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:12px_12px]">
                {/* Title wrapper with a hover indicator */}
                <div className="relative pl-0 group-hover:pl-3.5 transition-all duration-300">
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-red-500 to-orange-500 rounded-full scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />
                  <h3 className="font-bold text-gray-200 group-hover:text-red-400 transition-colors duration-300 leading-snug mb-5 line-clamp-2 text-base font-mono">
                    {video.title}
                  </h3>
                </div>
                
                <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono pt-3 border-t border-white/5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    {"views" in video ? video.views : "Canal Oficial"}
                  </span>
                  <span>
                    {"date" in video 
                      ? video.date 
                      : (video.createdAt 
                          ? `Postado em ${new Date(video.createdAt).toLocaleDateString('pt-BR')}` 
                          : "Recente")}
                  </span>
                </div>
              </div>

            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
