"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Star, Heart, Share2, ChevronRight, Play, ThumbsUp, ThumbsDown, AlertTriangle,
  MessageSquare, ShoppingBag, BarChart3, Calendar, Clock, Layers, Globe,
  Shield, Users, Gamepad2, Info, Check, Eye, Sparkles, Award, Tv
} from "lucide-react";
import { REVIEWS, getScoreColor, getScoreBg, formatScore, formatDate, formatPrice } from "@/lib/data";
import GameCard from "@/components/GameCard";
import team from "@/mocks/team";
import { useUserSession } from "@/hooks/useUserSession";
import { useAllGames } from "@/hooks/useAllGames";

interface Props { params: Promise<{ slug: string }> }

const SCORE_LABELS: Record<string, string> = {
  graphics: "Gráficos", gameplay: "Jogabilidade", fun: "Diversão",
  story: "História", soundtrack: "Trilha Sonora", performance: "Performance",
  replay: "Replay", multiplayer: "Multiplayer", difficulty: "Dificuldade",
  visual: "Visual", ai: "IA", optimization: "Otimização", content: "Conteúdo",
};

const MOCK_COMMENTS = [
  {
    id: "1", user: "KratosFan_BR", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=KratosFan",
    text: "Jogo incrível! A história me deixou de queixo caído. Definitivamente um dos melhores exclusivos do PS5.",
    likes: 42, dislikes: 2, date: "2024-01-10", score: 10,
  },
  {
    id: "2", user: "SpiderMilena", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SpiderMilena",
    text: "Concordo com tudo da review. A relação Kratos e Atreus é simplesmente perfeita. Chorei no final.",
    likes: 28, dislikes: 1, date: "2024-01-12", score: 9.5,
  },
  {
    id: "3", user: "GamerBR_2022", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=GamerBR",
    text: "Achei que o meio do jogo ficou um pouco lento, mas o começo e o final são absurdos. 9/10 pra mim.",
    likes: 15, dislikes: 4, date: "2024-01-15", score: 9,
  },
];

// Helper to render score badge using custom award images (Bronze, Silver, Gold)
const renderUPQBadge = (score: number, isLarge: boolean = false) => {
  let tier = {
    name: "OURO",
    img: "/awards_gold_upq.png",
  };

  if (score <= 5.0) {
    tier = {
      name: "BRONZE",
      img: "/awards_bronze_upq.png",
    };
  } else if (score <= 7.9) {
    tier = {
      name: "PRATA",
      img: "/awards_silver_upq.png",
    };
  }

  const imgSize = isLarge ? "w-24 h-32" : "w-14 h-18";
  const scoreTextSize = isLarge ? "text-2xl" : "text-base";

  return (
    <div className="flex flex-col items-center shrink-0 select-none transform hover:scale-105 transition-all duration-300">
      <img src={tier.img} alt={`Medalha de ${tier.name}`} className={`${imgSize} object-contain`} />
      <div className="mt-1 bg-[#0b0b14]/90 border border-purple-500/30 rounded-xl px-2.5 py-1 text-center shadow-lg backdrop-blur-sm">
        <span className={`${scoreTextSize} font-black text-white block leading-none`}>
          {formatScore(score)}
        </span>
        <span className="text-[7px] font-extrabold uppercase tracking-widest text-purple-400 block mt-0.5 whitespace-nowrap">
          Nota UPQ
        </span>
      </div>
    </div>
  );
};

export default function GamePage({ params }: Props) {
  const { slug } = use(params);
  const [games] = useAllGames();
  const game = games.find((g) => g.slug === slug);
  const review = REVIEWS.find((r) => r.gameId === game?.id);
  const authorInfo = review ? team.find((t: any) => t.name.toLowerCase() === review.author.toLowerCase()) : null;
  const authorAvatar = authorInfo?.avatar || (review ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.author}` : "");
  const [activeTab, setActiveTab] = useState<"review" | "scores" | "gallery" | "marketplace">("review");
  const [userScore, setUserScore] = useState(0);
  const [hoveredScore, setHoveredScore] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const currentUser = useUserSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!currentUser || !game) return;
    fetch("/api/favorites")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setFavorited(data.gameIds.includes(game.id));
      })
      .catch(() => {});
  }, [currentUser, game]);

  async function handleToggleFavorite() {
    if (!game) return;
    if (!currentUser) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId: game.id }),
    });
    if (res.ok) {
      const data = await res.json();
      setFavorited(data.favorited);
    }
  }

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
        <div className="text-6xl mb-4">😢</div>
        <h1 className="text-2xl font-bold text-white mb-2">Jogo não encontrado</h1>
        <Link href="/reviews" className="text-purple-400 hover:text-purple-300">← Voltar às reviews</Link>
      </div>
    );
  }

  const tabs = [
    { id: "review", label: "Review Oficial" },
    { id: "scores", label: "Notas e Análises" },
    { id: "gallery", label: "Galeria de Capturas" },
    { id: "marketplace", label: "Marketplace" },
  ];

  // Helper function to get text level based on score
  function getScoreVerdict(val: number): string {
    if (val >= 9.5) return "LENDÁRIO";
    if (val >= 9.0) return "OBRA-PRIMA";
    if (val >= 8.0) return "EXCELENTE";
    if (val >= 7.0) return "MUITO BOM";
    if (val >= 6.0) return "BOM";
    if (val >= 5.0) return "MEDIANO";
    return "NÃO RECOMENDADO";
  }

  return (
    <div className="bg-[#050508] min-h-screen text-[#f0f0f5] selection:bg-purple-600/30 selection:text-white relative overflow-hidden">
      {/* Background ambient grid and glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.015)_1px,_transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

      {/* Hero Section */}
      <div className="relative pt-6 md:pt-10 pb-0 border-b border-white/5">
        {/* Parallax Background blur */}
        <div className="absolute inset-0 h-[380px] overflow-hidden">
          <img src={game.cover} alt="" className="w-full h-full object-cover blur-2xl opacity-20 scale-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/20 via-[#050508]/80 to-[#050508]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb HUD */}
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-widest mb-6">
            <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-gray-700" />
            <Link href="/reviews" className="hover:text-purple-400 transition-colors">Reviews</Link>
            <ChevronRight className="w-3 h-3 text-gray-700" />
            <span className="text-gray-300">{game.title}</span>
          </div>

          <div className="flex gap-8 flex-col md:flex-row items-start">
            {/* Immersive Cover HUD */}
            <div className="relative group mx-auto md:mx-0 flex-shrink-0">
              <div className="absolute -inset-1.5 bg-gradient-to-t from-purple-600 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
              <div className="relative rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl shadow-black/80">
                <img
                  src={game.cover}
                  alt={game.title}
                  className="w-56 h-76 object-cover transform scale-100 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                  <span className="text-xs font-mono text-white/80 bg-black/60 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                    POSSUI TRAILER
                  </span>
                </div>
              </div>
            </div>

            {/* Game Main Info */}
            <div className="flex-1 min-w-0 pt-2 w-full">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-y-3 gap-x-6 mb-5 justify-center md:justify-start">
                    {/* Gêneros */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-purple-400/70 uppercase tracking-widest">Gêneros</span>
                      <div className="flex flex-wrap gap-1.5">
                        {game.genres.map((g) => (
                          <span key={g} className="text-[10px] font-mono font-semibold uppercase tracking-wider text-purple-300 bg-purple-950/40 border border-purple-500/20 px-2.5 py-0.5 rounded transition duration-300 hover:border-purple-500/50">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Divider on desktop */}
                    <span className="hidden sm:inline text-gray-800 font-mono text-xs">|</span>

                    {/* Plataformas */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-blue-400/70 uppercase tracking-widest">Plataformas</span>
                      <div className="flex flex-wrap gap-1.5">
                        {game.platforms.map((p) => (
                          <span key={p} className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-950/45 border border-blue-500/20 px-2.5 py-0.5 rounded transition duration-300 hover:border-blue-500/50 shadow-[0_0_8px_rgba(59,130,246,0.1)]">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-display tracking-tight text-center md:text-left leading-none mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-purple-400 text-glow-purple">
                    {game.title}
                  </h1>

                  <p className="text-gray-400 text-center md:text-left mb-6 text-sm font-mono flex items-center justify-center md:justify-start gap-2 flex-wrap">
                    <span className="text-purple-400">{game.developer}</span>
                    <span className="text-gray-700">|</span>
                    <span>{game.publisher}</span>
                    <span className="text-gray-700">|</span>
                    <span className="text-gray-500">{new Date(game.releaseDate).getFullYear()}</span>
                  </p>
                </div>

                {game.adminScore && (
                  <div className="flex-shrink-0 flex justify-center lg:self-start lg:mt-2">
                    {renderUPQBadge(game.adminScore, true)}
                  </div>
                )}
              </div>

              {/* Score HUD Gauges */}
              {(game.metacriticScore || game.worldAvg) && (
                <div className="grid grid-cols-2 gap-4 max-w-sm bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl p-5 mb-6 shadow-xl">
                  {/* METACRITIC */}
                  {game.metacriticScore && (
                    <div className="flex flex-col items-center border-r border-white/5 last:border-r-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-2">Metacritic</span>
                      <div className="relative flex items-center justify-center">
                        <svg className="w-18 h-18 transform -rotate-90">
                          <circle cx="36" cy="36" r="30" className="stroke-white/[0.05]" strokeWidth="4.5" fill="transparent" />
                          <circle cx="36" cy="36" r="30" className={`stroke-current ${getScoreColor(game.metacriticScore / 10)}`} strokeWidth="4.5" fill="transparent"
                            strokeDasharray={2 * Math.PI * 30}
                            strokeDashoffset={2 * Math.PI * 30 * (1 - game.metacriticScore / 100)}
                          />
                        </svg>
                        <div className="absolute text-center">
                          <span className={`text-xl font-black font-display ${getScoreColor(game.metacriticScore / 10)}`}>
                            {game.metacriticScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WORLD AVG */}
                  {game.worldAvg && (
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-2">Média Mundial</span>
                      <div className="relative flex items-center justify-center">
                        <svg className="w-18 h-18 transform -rotate-90">
                          <circle cx="36" cy="36" r="30" className="stroke-white/[0.05]" strokeWidth="4.5" fill="transparent" />
                          <circle cx="36" cy="36" r="30" className={`stroke-current ${getScoreColor(game.worldAvg)}`} strokeWidth="4.5" fill="transparent"
                            strokeDasharray={2 * Math.PI * 30}
                            strokeDashoffset={2 * Math.PI * 30 * (1 - game.worldAvg / 10)}
                          />
                        </svg>
                        <div className="absolute text-center">
                          <span className={`text-xl font-black font-display ${getScoreColor(game.worldAvg)}`}>
                            {formatScore(game.worldAvg)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap justify-center md:justify-start pb-6">
                <button
                  onClick={handleToggleFavorite}
                  className={`flex items-center gap-2 px-6 py-3 font-bold rounded-xl transition-all duration-300 btn-press border ${
                    favorited
                      ? "bg-red-950/20 border-red-500/40 text-red-400 hover:bg-red-950/35 hover:shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                      : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorited ? "fill-red-500 text-red-500 animate-pulse-slow" : "text-gray-400"}`} />
                  {favorited ? "Favoritado" : "Favoritar Jogo"}
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 text-white font-bold rounded-xl hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all duration-300 btn-press">
                  <ShoppingBag className="w-4 h-4 text-purple-400" />
                  Ver no Marketplace
                </button>
                <button className="p-3.5 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 btn-press" title="Compartilhar">
                  <Share2 className="w-4 h-4 text-gray-400 hover:text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Futuristic Tabs Navigation */}
          <div className="flex gap-2 mt-8 overflow-x-auto no-scrollbar border-b border-white/5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-4 text-xs font-mono uppercase tracking-widest font-semibold transition-all relative flex-shrink-0 ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.8)] animate-pulse-glow" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Page Layout Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Left Side Column */}
          <div className="lg:col-span-2 space-y-10">

            {/* TAB: REVIEW */}
            {activeTab === "review" && (
              <div className="space-y-10">
                {/* Immersive Trailer HUD */}
                {game.trailer && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-mono font-bold text-white flex items-center gap-2 tracking-widest uppercase">
                      <Play className="w-4 h-4 text-red-500" />
                      Visualização Cinemática
                    </h2>
                    <div className="relative group">
                      <div className="absolute -inset-1.5 bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl blur opacity-15 group-hover:opacity-30 transition duration-700" />
                      <div className="relative rounded-2xl overflow-hidden aspect-video bg-black/90 border border-white/5 shadow-2xl">
                        <iframe
                          src={game.trailer}
                          className="w-full h-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Review Article */}
                {review ? (
                  <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative">
  
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/5">
                      <div className="flex-1">
                        <h2 className="text-2xl md:text-4xl font-extrabold font-display text-white leading-tight mb-3">
                          {review.title}
                        </h2>
                        <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                          {authorAvatar && (
                            <div className="relative flex-shrink-0">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xs opacity-50" />
                              <img
                                src={authorAvatar}
                                alt={review.author}
                                className="relative w-8 h-8 rounded-full border border-white/10 object-cover"
                              />
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span>Por <strong className="text-purple-400">{review.author}</strong></span>
                            <span>·</span>
                            <span>{formatDate(review.publishedAt)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-4 py-2 rounded-xl flex-shrink-0">
                        <div className="text-left">
                          <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest leading-none mb-0.5">NOTA UQP</div>
                          <div className="text-[10px] font-mono font-bold text-gray-400">{getScoreVerdict(review.overallScore)}</div>
                        </div>
                        
                        <div className="h-6 w-px bg-white/10" />

                        <div className="flex items-baseline gap-0.5">
                          <span className={`text-2xl font-black font-display tracking-tight ${getScoreColor(review.overallScore)}`}>
                            {formatScore(review.overallScore)}
                          </span>
                          <span className="text-[10px] text-gray-600 font-bold font-mono">/10</span>
                        </div>
                      </div>
                    </div>

                    {/* Review text with dropped capital */}
                    <div className="text-gray-300 text-base leading-relaxed space-y-6 mb-8 font-sans">
                      {review.text.split("\n\n").map((p, i) => {
                        if (i === 0) {
                          // Dropcap design
                          return (
                            <p key={i} className="first-letter:text-5xl first-letter:font-black first-letter:text-purple-500 first-letter:mr-3 first-letter:float-left first-letter:leading-none">
                              {p}
                            </p>
                          );
                        }
                        return <p key={i}>{p}</p>;
                      })}
                    </div>

                    {/* Pros & Cons combat layout */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      {/* PROS */}
                      <div className="bg-green-500/[0.02] border border-green-500/10 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-full blur-2xl pointer-events-none" />
                        <h4 className="text-green-400 font-mono font-bold text-sm tracking-wider mb-4 flex items-center gap-2 uppercase">
                          <Check className="w-4 h-4 text-green-400" /> + PRÓS
                        </h4>
                        <ul className="space-y-3">
                          {review.pros.map((p, i) => (
                            <li key={i} className="text-sm text-gray-300 flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CONS */}
                      <div className="bg-red-500/[0.02] border border-red-500/10 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
                        <h4 className="text-red-400 font-mono font-bold text-sm tracking-wider mb-4 flex items-center gap-2 uppercase">
                          <AlertTriangle className="w-4 h-4 text-red-400" /> - CONTRAS
                        </h4>
                        <ul className="space-y-3">
                          {review.cons.map((c, i) => (
                            <li key={i} className="text-sm text-gray-300 flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Veredict / Conclusion box */}
                    <div className="bg-gradient-to-r from-purple-950/30 to-blue-950/20 border border-purple-500/10 rounded-2xl p-6 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-blue-500" />
                      <h4 className="text-purple-400 font-mono font-bold text-xs tracking-widest uppercase mb-2">Conclusão Detalhada</h4>
                      <p className="text-sm text-gray-300 leading-relaxed italic">"{review.conclusion}"</p>
                    </div>

                    {/* Like & Interaction bar */}
                    <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/5">
                      <span className="text-xs font-mono text-gray-500">Esta review foi útil?</span>
                      <button className="flex items-center gap-2 text-xs font-mono text-green-400 bg-green-400/5 border border-green-500/20 hover:bg-green-400/10 px-3.5 py-2 rounded-xl transition-all duration-300 btn-press">
                        <ThumbsUp className="w-3.5 h-3.5" /> 
                        <span>Útil</span>
                        <span className="text-green-500 font-bold bg-green-500/10 px-1.5 py-0.5 rounded text-[10px]">{review.likes}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-10 text-center backdrop-blur-md">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                      <Sparkles className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-mono font-bold text-white mb-2 uppercase tracking-wider">Review Oficial em Breve</h3>
                    <p className="text-sm text-gray-400 max-w-md mx-auto">Nossa equipe gamer está jogando e preparando a análise completa de {game.title}. Fique de olho!</p>
                  </div>
                )}

                {/* User Reviews Section */}
                <div className="space-y-6">
                  <h2 className="text-lg font-mono font-bold text-white flex items-center gap-2 tracking-widest uppercase">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    Comentários da Comunidade
                  </h2>

                  {/* Add comment Form */}
                  <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden">
                    <p className="text-xs font-mono text-gray-400 mb-4 uppercase tracking-wider">Atribua sua nota gamer:</p>
                    
                    {/* User Rating buttons */}
                    <div className="flex gap-1.5 mb-6 overflow-x-auto no-scrollbar pb-2">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <button
                          key={n}
                          onClick={() => setUserScore(n)}
                          onMouseEnter={() => setHoveredScore(n)}
                          onMouseLeave={() => setHoveredScore(0)}
                          className={`w-10 h-10 rounded-xl text-xs font-mono font-bold transition-all flex-shrink-0 flex items-center justify-center border ${
                            n <= (hoveredScore || userScore)
                              ? "bg-purple-600 border-purple-500 text-white shadow-[0_0_10px_rgba(124,58,237,0.4)]"
                              : "bg-white/5 border-white/5 text-gray-500 hover:border-white/10 hover:text-gray-300"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>

                    <textarea
                      placeholder="Deixe sua review curta sobre o jogo, jogabilidade ou enredo..."
                      className="w-full bg-white/5 border border-white/5 text-white placeholder-gray-600 rounded-2xl px-4 py-3.5 text-sm resize-none h-28 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />

                    <div className="flex justify-end mt-4">
                      <button className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase font-mono tracking-wider rounded-xl transition-all duration-300 btn-press">
                        Enviar Comentário
                      </button>
                    </div>
                  </div>

                  {/* Comment List */}
                  <div className="space-y-4">
                    {MOCK_COMMENTS.map((comment) => (
                      <div key={comment.id} className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 md:p-6 backdrop-blur-md">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full blur opacity-30" />
                            <img src={comment.avatar} alt="" className="relative w-10 h-10 rounded-full bg-black border border-white/10" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap mb-2">
                              <span className="font-bold text-white text-sm">{comment.user}</span>
                              <span className="text-gray-700">|</span>
                              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 ${getScoreColor(comment.score)}`}>
                                NOTA: {comment.score}
                              </span>
                              <span className="text-gray-700">|</span>
                              <span className="text-xs text-gray-500 font-mono">{formatDate(comment.date)}</span>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed font-sans">{comment.text}</p>
                            
                            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/[0.03]">
                              <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-400 transition-colors font-mono">
                                <ThumbsUp className="w-3.5 h-3.5" /> {comment.likes}
                              </button>
                              <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors font-mono">
                                <ThumbsDown className="w-3.5 h-3.5" /> {comment.dislikes}
                              </button>
                              <button className="text-xs text-gray-500 hover:text-white transition-colors font-mono ml-auto">Responder</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SCORES AND STATS */}
            {activeTab === "scores" && (
              <div className="space-y-8">
                {/* External Portal Scores */}
                <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
                  <h2 className="text-lg font-mono font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-widest">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    Grandes Portais da Mídia
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {game.siteScores.map((s) => {
                      const normalizedScore = s.score > 10 ? s.score / 10 : s.score;
                      return (
                        <div key={s.site} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-center relative group">
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="w-3.5 h-3.5 text-gray-500" />
                          </div>
                          <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">{s.site}</div>
                          <div className={`text-3xl font-black font-display ${getScoreColor(normalizedScore)} text-glow-purple mb-3`}>
                            {s.score > 10 ? s.score : `${s.score}/10`}
                          </div>
                          
                          {/* Progress Line */}
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${getScoreBg(normalizedScore)} shadow-[0_0_8px_rgba(168,85,247,0.5)]`}
                              style={{ width: `${normalizedScore * 10}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* UQP Subscores breakdown */}
                {review && (
                  <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
                    <h2 className="text-lg font-mono font-bold text-white mb-6 uppercase tracking-widest">
                      Aspectos Analisados — UQP
                    </h2>
                    <div className="space-y-4">
                      {Object.entries(review.scores).map(([key, val]) => {
                        if (val === 0) return null;
                        return (
                          <div key={key} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs font-mono">
                              <span className="text-gray-400 uppercase tracking-widest">{SCORE_LABELS[key]}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600 text-[10px] uppercase font-bold">{getScoreVerdict(val)}</span>
                                <span className={`font-bold ${getScoreColor(val)}`}>{formatScore(val)}</span>
                              </div>
                            </div>
                            <div className="h-2 bg-white/5 rounded-lg overflow-hidden relative">
                              <div
                                className={`h-full rounded-lg ${getScoreBg(val)} shadow-[0_0_8px_rgba(124,58,237,0.3)] transition-all`}
                                style={{ width: `${val * 10}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: GALLERY */}
            {activeTab === "gallery" && (
              <div className="space-y-6">
                <h2 className="text-lg font-mono font-bold text-white tracking-widest uppercase">Capturas de Tela</h2>
                {game.gallery.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {game.gallery.map((img, i) => (
                      <div key={i} className="rounded-2xl overflow-hidden bg-black border border-white/5 group relative">
                        <img src={img} alt={`Screenshot ${i + 1}`} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button className="px-4 py-2 bg-black/60 border border-white/10 text-xs font-mono uppercase rounded-lg">Ampliar Imagem</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                      <Tv className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="text-sm font-mono text-gray-500 uppercase tracking-widest">Nenhuma captura de tela disponível</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: MARKETPLACE */}
            {activeTab === "marketplace" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-mono font-bold text-white tracking-widest uppercase">Ofertas da Comunidade</h2>
                  <Link href="/marketplace/vender" className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all duration-300 btn-press">
                    <ShoppingBag className="w-4 h-4" />
                    Anunciar
                  </Link>
                </div>
                <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <ShoppingBag className="w-6 h-6 text-gray-500" />
                  </div>
                  <p className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-3">Nenhum anúncio disponível para este jogo</p>
                  <Link href="/marketplace/vender" className="text-xs font-mono uppercase text-green-400 hover:text-green-300 underline">
                    Seja o primeiro a anunciar!
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Technical Column */}
          <div className="space-y-8">
            
            {/* System Technical Specifications */}
            <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
              <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-white mb-6 flex items-center gap-2 pb-3 border-b border-white/5">
                <Info className="w-4 h-4 text-purple-400" />
                Especificações Técnicas
              </h3>
              
              <dl className="space-y-4 text-xs font-mono">
                {[
                  { icon: <Award className="w-4 h-4 text-purple-400" />, label: "Desenvolvedora", value: game.developer },
                  { icon: <Layers className="w-4 h-4 text-blue-400" />, label: "Publicadora", value: game.publisher },
                  { icon: <Calendar className="w-4 h-4 text-green-400" />, label: "Lançamento", value: formatDate(game.releaseDate) },
                  { icon: <Gamepad2 className="w-4 h-4 text-pink-400" />, label: "Plataformas", value: game.platforms.join(", ") },
                  { icon: <Shield className="w-4 h-4 text-red-400" />, label: "Faixa Etária", value: game.ageRating },
                  { icon: <ShoppingBag className="w-4 h-4 text-yellow-400" />, label: "Preço Sugerido", value: formatPrice(game.suggestedPrice) },
                  { icon: <Clock className="w-4 h-4 text-teal-400" />, label: "Tempo de Campanha", value: game.avgPlayTime || "—" },
                  { icon: <Globe className="w-4 h-4 text-indigo-400" />, label: "Idiomas Suportados", value: game.languages.join(", ") },
                  { icon: <Users className="w-4 h-4 text-orange-400" />, label: "Multijogador", value: game.online ? `Sim, até ${game.maxPlayers} jog.` : "Apenas Offline" },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex justify-between items-start gap-4">
                    <dt className="text-gray-500 flex items-center gap-2 flex-shrink-0">
                      {icon}
                      <span>{label}</span>
                    </dt>
                    <dd className="text-gray-200 text-right leading-tight max-w-[150px]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Related Games Deck */}
            <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 backdrop-blur-md shadow-2xl">
              <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-white mb-6 pb-3 border-b border-white/5">
                Você pode gostar
              </h3>
              <div className="space-y-4">
                {games.filter((g) => g.id !== game.id && g.genres.some((genre) => game.genres.includes(genre))).slice(0, 3).map((g) => (
                  <GameCard key={g.id} game={g} compact />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
