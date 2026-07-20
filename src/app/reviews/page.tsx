"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ThumbsUp, Calendar, ChevronRight, Gamepad2, Search, SlidersHorizontal, ArrowUpDown, Award, CheckCircle2, XCircle } from "lucide-react";
import { formatScore, formatDate } from "@/lib/data";
import { useAllReviews } from "@/hooks/useAllReviews";
import { useAllGames } from "@/hooks/useAllGames";
import team from "@/mocks/team";
import Pagination from "@/components/ui/Pagination";

// Helper to map author name to avatar and role with accent-insensitivity
const getAuthorInfo = (authorName: string) => {
  const normalize = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const normalizedAuthor = normalize(authorName);
  
  // Try to find a direct match in team
  const found = team.find(member => {
    const normalizedMemberName = normalize(member.name);
    return normalizedAuthor.includes(normalizedMemberName) || 
           normalizedMemberName.includes(normalizedAuthor);
  });

  return found || {
    name: authorName,
    role: "Redator",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`,
  };
};

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

  const imgSize = isLarge ? "w-24 h-32" : "w-16 h-22";
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


export default function ReviewsPage() {
  const REVIEWS = useAllReviews();
  const [GAMES] = useAllGames();
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("recent");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 4;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Map reviews to games
  const reviewsWithGames = REVIEWS.map((r) => ({
    review: r,
    game: GAMES.find((g) => g.id === r.gameId),
  })).filter((r) => r.game);

  // Community games without reviews
  const otherGames = GAMES.filter((g) => !REVIEWS.find((r) => r.gameId === g.id));

  // Determine Highlight of the Month (Destaque do Mês)
  // 1. Filtrar reviews do mês atual (Ano e Mês)
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-indexed

  const currentMonthReviews = reviewsWithGames.filter(({ review }) => {
    const pubDate = new Date(review.publishedAt);
    return pubDate.getFullYear() === currentYear && pubDate.getMonth() === currentMonth;
  });

  // 2. Definir o destaque: se houver reviews no mês atual, pega o de maior nota deste mês.
  // Caso contrário, faz fallback para o de maior nota geral.
  const targetReviews = currentMonthReviews.length > 0 ? currentMonthReviews : reviewsWithGames;

  const highlight = targetReviews.reduce((max, r) => 
    r.review.overallScore > max.review.overallScore ? r : max
  , targetReviews[0]);

  // Filter & Sort reviews
  const filteredReviews = reviewsWithGames.filter(({ review, game }) => {
    const matchesSearch = 
      review.title.toLowerCase().includes(search.toLowerCase()) || 
      game!.title.toLowerCase().includes(search.toLowerCase());
    const matchesScore = review.overallScore >= minScore;
    return matchesSearch && matchesScore;
  });

  // Reset pagination when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, minScore, sortBy]);

  if (!mounted) {
    return <div className="min-h-screen bg-[#050508]" />;
  }

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "score") {
      return b.review.overallScore - a.review.overallScore;
    }
    if (sortBy === "likes") {
      return b.review.likes - a.review.likes;
    }
    return new Date(b.review.publishedAt).getTime() - new Date(a.review.publishedAt).getTime();
  });

  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-16">
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight bg-gradient-to-r from-white via-gray-200 to-purple-400 bg-clip-text text-transparent">
          Reviews da Equipe
        </h1>
        <p className="text-gray-400 text-lg">
          Análises críticas completas e as notas oficiais do time Upa que Passa.
        </p>
      </div>

      {/* Destaque do Mês (Highlight) */}
      {highlight && (
        <section className="relative rounded-3xl border border-purple-500/20 bg-gradient-to-b from-[#121220] to-[#09090f] p-8 md:p-12 shadow-2xl">
          {/* Absolute Award Badge top-right, aligned with top border */}
          <div className="absolute top-0 right-8 md:right-12 z-20">
            {renderUPQBadge(highlight.review.overallScore, true)}
          </div>

          {/* Subtle glowing effect wrapped in an overflow-hidden container */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -mr-48 -mt-48" />
          </div>
          
          <div className="relative w-fit mb-8 select-none transform -rotate-2 hover:rotate-2 hover:scale-105 transition-all duration-300 cursor-pointer">
            {/* Cartoonish thick offset shadow */}
            <div className="absolute inset-0 bg-purple-600 rounded-xl translate-x-1.5 translate-y-1.5 border-2 border-purple-400" />
            
            {/* Main Badge Container */}
            <div className="relative flex items-center gap-2.5 text-xs font-black uppercase tracking-widest text-white bg-gradient-to-r from-purple-500 to-indigo-600 border-2 border-white px-4 py-2 rounded-xl">
              <Award className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span>Destaque do Mês</span>
              
              {/* Mini comic sticker tag */}
              <div className="absolute -top-3.5 -right-3.5 bg-yellow-400 text-black border-2 border-black text-[9px] font-black px-1.5 py-0.5 rounded-md rotate-12 shadow-sm uppercase">
                UQP!
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Cover Image */}
            <div className="lg:col-span-4 relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={highlight.game!.cover}
                  alt={highlight.game!.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Review Content */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Author Info */}
                {(() => {
                  const author = getAuthorInfo(highlight.review.author);
                  return (
                    <div className="flex items-center gap-3">
                      <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full border border-purple-500/30 bg-[#0f0f18] p-0.5" />
                      <div>
                        <div className="text-sm font-bold text-white leading-tight">{author.name}</div>
                        <div className="text-xs text-purple-400/80">{author.role}</div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white hover:text-purple-300 transition-colors mb-3">
                  <Link href={`/reviews/${highlight.game!.slug}#review`}>{highlight.review.title}</Link>
                </h2>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed line-clamp-4">
                  {highlight.review.text}
                </p>
              </div>

              {/* Pros & Cons Preview */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#1b1b2f]/50 border border-green-500/10 rounded-xl p-4 flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-green-400 font-bold uppercase tracking-wider mb-1 block">Pró em destaque</span>
                    <p className="text-xs text-gray-300">{highlight.review.pros[0]}</p>
                  </div>
                </div>
                <div className="bg-[#1b1b2f]/50 border border-red-500/10 rounded-xl p-4 flex gap-3">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-red-400 font-bold uppercase tracking-wider mb-1 block">Contra em destaque</span>
                    <p className="text-xs text-gray-300">{highlight.review.cons[0]}</p>
                  </div>
                </div>
              </div>

              {/* Footer details */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500 border-t border-white/5 pt-4">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(highlight.review.publishedAt)}</span>
                <span className="flex items-center gap-1.5"><ThumbsUp className="w-3.5 h-3.5" /> {highlight.review.likes} curtidas</span>
                <Link
                  href={`/reviews/${highlight.game!.slug}#review`}
                  className="ml-auto flex items-center gap-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-purple-500/20 text-xs"
                >
                  Ler Completo <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search & Filter section */}
      <section className="bg-[#0b0b14] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearch(searchInput);
            }}
            className="flex gap-2 w-full md:flex-1"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por jogo ou título do review..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-[#121220] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-purple-500/20 text-sm whitespace-nowrap"
            >
              Buscar
            </button>
          </form>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {/* Score Filters */}
            <div className="flex items-center gap-2 bg-[#121220] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-300">
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-semibold">Nota mínima:</span>
              <div className="flex gap-1.5">
                {[0, 7.5, 8.5, 9.0].map((score) => (
                  <button
                    key={score}
                    onClick={() => setMinScore(score)}
                    className={`px-2 py-1 rounded-md font-bold transition-all ${
                      minScore === score
                        ? "bg-purple-600 text-white"
                        : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {score === 0 ? "Todas" : `${score}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-[#121220] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-semibold">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value="recent" className="bg-[#121220]">Mais Recentes</option>
                <option value="score" className="bg-[#121220]">Maior Nota</option>
                <option value="likes" className="bg-[#121220]">Mais Curtidas</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* All Reviews Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-purple-400" />
            Todos os Reviews ({sortedReviews.length})
          </h2>
        </div>

        {sortedReviews.length > 0 ? (
          <div className="space-y-8">
            <div className="space-y-6">
              {paginatedReviews.map(({ review, game }) => {
                const author = getAuthorInfo(review.author);
                return (
                  <Link
                    key={review.id}
                    href={`/reviews/${game!.slug}#review`}
                    className="group flex flex-col md:flex-row gap-6 bg-[#0f0f18] border border-white/5 hover:border-purple-500/20 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/5 p-5 relative"
                  >
                    {/* Cover Image */}
                    <div className="relative w-full md:w-44 h-48 md:h-auto aspect-[3/4] md:aspect-auto flex-shrink-0 overflow-hidden rounded-2xl shadow-lg">
                      <img
                        src={game!.cover}
                        alt={game!.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="flex-1 flex flex-col justify-between space-y-4 pr-14 md:pr-20">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 bg-purple-950/40 border border-purple-500/10 px-2.5 py-0.5 rounded-full">
                              Análise Oficial
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium">
                              {formatDate(review.publishedAt)}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-xl font-black text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                          {review.title}
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                          {review.text}
                        </p>
                      </div>

                      {/* Pros and Cons brief */}
                      <div className="grid grid-cols-2 gap-4 text-[11px] bg-white/[0.02] border border-white/5 rounded-xl p-3">
                        <div>
                          <span className="font-bold text-green-400 block mb-0.5">Prós</span>
                          <span className="text-gray-300 line-clamp-1">{review.pros[0]}</span>
                        </div>
                        <div>
                          <span className="font-bold text-red-400 block mb-0.5">Contras</span>
                          <span className="text-gray-300 line-clamp-1">{review.cons[0]}</span>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        {/* Author Info */}
                        <div className="flex items-center gap-2">
                          <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-full border border-purple-500/20 bg-[#0f0f18] p-0.5" />
                          <div>
                            <div className="text-xs font-bold text-white leading-tight">{author.name}</div>
                            <div className="text-[10px] text-purple-400/80">{author.role}</div>
                          </div>
                        </div>

                        <span className="flex items-center gap-1 text-xs font-bold text-purple-400 group-hover:text-purple-300">
                          Ler completa <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>

                    {/* Absolute Award Badge top-right, aligned with top border */}
                    <div className="absolute top-0 right-6 md:right-8 z-20">
                      {renderUPQBadge(review.overallScore, false)}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="pt-4 border-t border-white/5">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500 bg-[#0f0f18] border border-white/5 rounded-3xl">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-white mb-1">Nenhum review encontrado</h3>
            <p className="text-sm">Tente mudar os filtros ou limpar a pesquisa.</p>
          </div>
        )}
      </section>

    </div>
  );
}
