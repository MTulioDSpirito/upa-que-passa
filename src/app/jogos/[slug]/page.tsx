"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Star, Heart, Share2, ExternalLink, ChevronRight, Users, Clock, Globe,
  Monitor, Calendar, Tag, Play, ThumbsUp, ThumbsDown, AlertTriangle,
  MessageSquare, ShoppingBag, BarChart3, Gamepad2
} from "lucide-react";
import { REVIEWS, getScoreColor, formatScore, formatDate, formatPrice } from "@/lib/data";
import ScoreBadge from "@/components/ScoreBadge";
import GameCard from "@/components/GameCard";
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

export default function GamePage({ params }: Props) {
  const { slug } = use(params);
  const [games] = useAllGames();
  const game = games.find((g) => g.slug === slug);
  const review = REVIEWS.find((r) => r.gameId === game?.id);
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
        <Link href="/jogos" className="text-purple-400 hover:text-purple-300">← Voltar ao catálogo</Link>
      </div>
    );
  }

  const tabs = [
    { id: "review", label: "Review" },
    { id: "scores", label: "Notas" },
    { id: "gallery", label: "Galeria" },
    { id: "marketplace", label: "Marketplace" },
  ];

  return (
    <div className="bg-[#07070a]">
      {/* Hero */}
      <div className="relative">
        {/* Background cover blur */}
        <div className="absolute inset-0 h-72 overflow-hidden">
          <img src={game.cover} alt="" className="w-full h-full object-cover blur-xl opacity-20 scale-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#07070a]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-8 pb-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/jogos" className="hover:text-white transition-colors">Jogos</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">{game.title}</span>
          </div>

          <div className="flex gap-6 flex-wrap md:flex-nowrap">
            {/* Cover */}
            <div className="flex-shrink-0">
              <img
                src={game.cover}
                alt={game.title}
                className="w-48 h-64 object-cover rounded-2xl shadow-2xl shadow-black/60 border border-white/10"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pt-2">
              <div className="flex gap-2 flex-wrap mb-3">
                {game.genres.map((g) => (
                  <span key={g} className="text-xs text-purple-400 bg-purple-900/30 border border-purple-800/30 px-3 py-1 rounded-full">
                    {g}
                  </span>
                ))}
                {game.platforms.map((p) => (
                  <span key={p} className="text-xs text-[#0072ce] bg-blue-900/20 border border-blue-800/30 px-3 py-1 rounded-full">
                    {p}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">{game.title}</h1>
              <p className="text-gray-400 mb-4 text-sm">
                {game.developer} · {game.publisher} · {new Date(game.releaseDate).getFullYear()}
              </p>

              {/* Score row */}
              <div className="flex items-center gap-4 flex-wrap mb-5">
                {game.adminScore && (
                  <div className="flex flex-col items-center">
                    <ScoreBadge score={game.adminScore} size="lg" />
                    <span className="text-xs text-gray-500 mt-1">Nota UQP</span>
                  </div>
                )}
                {game.metacriticScore && (
                  <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-xl border flex items-center justify-center text-xl font-black ${getScoreColor(game.metacriticScore / 10)} bg-white/5 border-white/10`}>
                      {game.metacriticScore}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">Metacritic</span>
                  </div>
                )}
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-xl border flex items-center justify-center text-xl font-black bg-white/5 border-white/10 ${game.userScore ? getScoreColor(game.userScore) : "text-gray-500"}`}>
                    {game.userScore ? formatScore(game.userScore) : "—"}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{game.userScore ? "Usuários" : "Sem notas ainda"}</span>
                </div>
                {game.worldAvg && (
                  <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-xl border flex items-center justify-center text-xl font-black ${getScoreColor(game.worldAvg)} bg-white/5 border-white/10`}>
                      {formatScore(game.worldAvg)}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">Média Mundial</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 flex-wrap">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all">
                  <Star className="w-4 h-4" />
                  Avaliar Jogo
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
                >
                  <Heart className={`w-4 h-4 ${favorited ? "fill-red-500 text-red-500" : ""}`} />
                  {favorited ? "Favoritado" : "Favoritar"}
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all">
                  <ShoppingBag className="w-4 h-4" />
                  Ver no Marketplace
                </button>
                <button className="p-2.5 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-8 border-b border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "border-purple-500 text-white"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">

            {/* REVIEW TAB */}
            {activeTab === "review" && (
              <div className="space-y-8">
                {/* Trailer */}
                {game.trailer && (
                  <div>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Play className="w-5 h-5 text-red-500" />
                      Trailer Oficial
                    </h2>
                    <div className="rounded-2xl overflow-hidden aspect-video bg-black">
                      <iframe
                        src={game.trailer}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                      />
                    </div>
                  </div>
                )}

                {/* Review */}
                {review ? (
                  <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xs text-purple-400 bg-purple-900/30 px-2 py-0.5 rounded-full mb-2 inline-block">
                          Review Oficial
                        </span>
                        <h2 className="text-2xl font-black text-white">{review.title}</h2>
                      </div>
                      <div className="text-right">
                        <div className={`text-4xl font-black ${getScoreColor(review.overallScore)}`}>
                          {formatScore(review.overallScore)}
                        </div>
                        <div className="text-xs text-gray-500">Nota Final</div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mb-4">
                      Por <span className="text-white">{review.author}</span> · {formatDate(review.publishedAt)}
                    </p>

                    <div className="prose prose-invert text-gray-300 text-sm leading-relaxed space-y-4 mb-6">
                      {review.text.split("\n\n").map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>

                    {/* Pros & Cons */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-green-900/10 border border-green-800/20 rounded-xl p-4">
                        <h4 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                          <ThumbsUp className="w-4 h-4" /> Prós
                        </h4>
                        <ul className="space-y-1.5">
                          {review.pros.map((p, i) => (
                            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-green-400 mt-0.5">+</span>{p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-red-900/10 border border-red-800/20 rounded-xl p-4">
                        <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                          <ThumbsDown className="w-4 h-4" /> Contras
                        </h4>
                        <ul className="space-y-1.5">
                          {review.cons.map((c, i) => (
                            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-red-400 mt-0.5">-</span>{c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Conclusion */}
                    <div className="bg-purple-900/10 border border-purple-800/20 rounded-xl p-4">
                      <h4 className="text-purple-400 font-semibold mb-2">Conclusão</h4>
                      <p className="text-sm text-gray-300">{review.conclusion}</p>
                    </div>

                    {/* Like review */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
                      <span className="text-sm text-gray-500">Esta review foi útil?</span>
                      <button className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300">
                        <ThumbsUp className="w-4 h-4" /> {review.likes}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-8 text-center">
                    <div className="text-5xl mb-3">✍️</div>
                    <h3 className="text-lg font-bold text-white mb-2">Review em breve</h3>
                    <p className="text-sm text-gray-500">Nossa equipe está preparando a review completa deste jogo.</p>
                  </div>
                )}

                {/* User Comments */}
                <div>
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#0072ce]" />
                    Comentários dos Usuários
                  </h2>

                  {/* User score input */}
                  <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5 mb-4">
                    <p className="text-sm text-gray-400 mb-3">Sua nota para este jogo:</p>
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <button
                          key={n}
                          onClick={() => setUserScore(n)}
                          onMouseEnter={() => setHoveredScore(n)}
                          onMouseLeave={() => setHoveredScore(0)}
                          className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                            n <= (hoveredScore || userScore)
                              ? "bg-purple-600 text-white"
                              : "bg-white/5 text-gray-500"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <textarea
                      placeholder="Escreva seu comentário sobre este jogo (opcional)..."
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm resize-none h-24 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                    <div className="flex justify-end mt-3">
                      <button className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl transition-all">
                        Publicar Comentário
                      </button>
                    </div>
                  </div>

                  {/* Comment list */}
                  <div className="space-y-4">
                    {MOCK_COMMENTS.map((comment) => (
                      <div key={comment.id} className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5">
                        <div className="flex items-start gap-3">
                          <img src={comment.avatar} alt="" className="w-10 h-10 rounded-full" />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-semibold text-white text-sm">{comment.user}</span>
                              <span className={`text-sm font-bold ${getScoreColor(comment.score)}`}>
                                ★ {comment.score}
                              </span>
                              <span className="text-xs text-gray-500">{formatDate(comment.date)}</span>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">{comment.text}</p>
                            <div className="flex items-center gap-4 mt-3">
                              <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-400 transition-colors">
                                <ThumbsUp className="w-3 h-3" /> {comment.likes}
                              </button>
                              <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors">
                                <ThumbsDown className="w-3 h-3" /> {comment.dislikes}
                              </button>
                              <button className="text-xs text-gray-500 hover:text-white transition-colors">Responder</button>
                              <button className="text-xs text-gray-500 hover:text-red-400 transition-colors ml-auto">
                                <AlertTriangle className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SCORES TAB */}
            {activeTab === "scores" && (
              <div className="space-y-6">
                {/* External scores */}
                <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    Notas dos Grandes Portais
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {game.siteScores.map((s) => {
                      const normalizedScore = s.score > 10 ? s.score / 10 : s.score;
                      return (
                        <div key={s.site} className="bg-white/5 rounded-xl p-4 text-center">
                          <div className={`text-2xl font-black mb-1 ${getScoreColor(normalizedScore)}`}>
                            {s.score > 10 ? s.score : `${s.score}/10`}
                          </div>
                          <div className="text-sm text-gray-400">{s.site}</div>
                          <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                normalizedScore >= 9 ? "bg-green-400" :
                                normalizedScore >= 7.5 ? "bg-lime-400" :
                                "bg-yellow-400"
                              }`}
                              style={{ width: `${normalizedScore * 10}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {game.worldAvg && (
                    <div className={`mt-5 text-center p-4 rounded-xl border ${getScoreColor(game.worldAvg)} bg-white/5 border-white/10`}>
                      <div className="text-xs text-gray-500 mb-1">Média Mundial</div>
                      <div className={`text-4xl font-black ${getScoreColor(game.worldAvg)}`}>{formatScore(game.worldAvg)}</div>
                    </div>
                  )}
                </div>

                {/* UQP detailed scores */}
                {review && (
                  <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-5">Notas Detalhadas — Upa que Passa</h2>
                    <div className="space-y-3">
                      {Object.entries(review.scores).map(([key, val]) => {
                        if (val === 0) return null;
                        return (
                          <div key={key} className="flex items-center gap-4">
                            <span className="text-sm text-gray-400 w-32 flex-shrink-0">{SCORE_LABELS[key]}</span>
                            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  val >= 9 ? "bg-green-400" : val >= 7.5 ? "bg-lime-400" : val >= 6 ? "bg-yellow-400" : "bg-red-400"
                                }`}
                                style={{ width: `${val * 10}%` }}
                              />
                            </div>
                            <span className={`text-sm font-bold w-8 text-right ${getScoreColor(val)}`}>{formatScore(val)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* GALLERY TAB */}
            {activeTab === "gallery" && (
              <div>
                <h2 className="text-xl font-bold text-white mb-5">Galeria</h2>
                {game.gallery.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {game.gallery.map((img, i) => (
                      <div key={i} className="rounded-xl overflow-hidden bg-[#0f0f18] border border-white/5">
                        <img src={img} alt={`Screenshot ${i + 1}`} className="w-full h-40 object-cover hover:scale-105 transition-transform" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500">
                    <div className="text-5xl mb-3">🖼️</div>
                    <p>Galeria em breve</p>
                  </div>
                )}
              </div>
            )}

            {/* MARKETPLACE TAB */}
            {activeTab === "marketplace" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-white">Anúncios para este Jogo</h2>
                  <Link href="/marketplace/vender" className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-xl transition-all">
                    <ShoppingBag className="w-4 h-4" />
                    Anunciar
                  </Link>
                </div>
                <div className="text-center py-16 text-gray-500">
                  <div className="text-5xl mb-3">🛒</div>
                  <p>Nenhum anúncio disponível para este jogo</p>
                  <Link href="/marketplace/vender" className="text-green-400 hover:text-green-300 text-sm mt-2 inline-block">
                    Seja o primeiro a anunciar!
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Game details */}
            <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-4">Informações</h3>
              <dl className="space-y-3 text-sm">
                {[
                  { label: "Desenvolvedor", value: game.developer },
                  { label: "Publicador", value: game.publisher },
                  { label: "Lançamento", value: formatDate(game.releaseDate) },
                  { label: "Plataformas", value: game.platforms.join(", ") },
                  { label: "Gêneros", value: game.genres.join(", ") },
                  { label: "Faixa Etária", value: game.ageRating },
                  { label: "Preço", value: formatPrice(game.suggestedPrice) },
                  { label: "Tempo Médio", value: game.avgPlayTime || "—" },
                  { label: "Idiomas", value: game.languages.join(", ") },
                  { label: "Legendas PT-BR", value: game.subtitles.includes("Português (BR)") ? "✅ Sim" : "❌ Não" },
                  { label: "Dublagem PT-BR", value: game.dubbing.includes("Português (BR)") ? "✅ Sim" : "❌ Não" },
                  { label: "Online", value: game.online ? "✅ Sim" : "❌ Não" },
                  { label: "Offline", value: game.offline ? "✅ Sim" : "❌ Não" },
                  { label: "Jogadores", value: `até ${game.maxPlayers}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-2">
                    <dt className="text-gray-500 flex-shrink-0">{label}</dt>
                    <dd className="text-gray-200 text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Related games */}
            <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-4">Você pode gostar</h3>
              <div className="space-y-1">
                {games.filter((g) => g.id !== game.id && g.genres.some((genre) => game.genres.includes(genre))).slice(0, 4).map((g) => (
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
