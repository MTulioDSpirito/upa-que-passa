"use client";

import Link from "next/link";
import { Eye, Heart, Calendar, Search, Clock, User, X } from "lucide-react";
import { formatDate } from "@/lib/data";
import { useState, useEffect, useMemo } from "react";
import Pagination from "@/components/ui/Pagination";
import CardCover from "@/components/ui/CardCover";
import team from "@/mocks/team";
import { NewsArticle } from "@/lib/types";

const CATEGORIES = ["Todas", "Notícias", "Hardware", "Eventos", "Lançamentos", "Reviews", "Análises"];

export default function NoticiasClient({ initialNews }: { initialNews: NewsArticle[] }) {
  const NEWS = initialNews;
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 6;

  const filtered = useMemo(() => {
    const searchLower = search.toLowerCase();
    return NEWS.filter((n) => {
      const matchSearch = n.title.toLowerCase().includes(searchLower) ||
                          n.excerpt.toLowerCase().includes(searchLower);
      const matchCat = category === "Todas" || n.category === category;
      return matchSearch && matchCat;
    });
  }, [NEWS, search, category]);

  const [featured, ...rest] = filtered;

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  const getReadTime = (content: string) => {
    const words = content.split(/\s+/).length;
    return Math.ceil(words / 200) || 1;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setSearch("");
    setCategory("Todas");
  };

  const getAuthorInfo = (authorName: string) => {
    const cleanName = authorName.split("·")[0].trim().toLowerCase();
    return team.find((t) => t.name.toLowerCase() === cleanName) || {
      name: authorName,
      role: "Redator",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`,
    };
  };

  const totalPages = Math.ceil(rest.length / newsPerPage);
  const paginatedRest = useMemo(
    () => rest.slice((currentPage - 1) * newsPerPage, currentPage * newsPerPage),
    [rest, currentPage]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 hero-glow-bg">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Notícias</h1>
          <p className="text-gray-400">As últimas novidades, lançamentos e coberturas do mundo gamer</p>
        </div>
        <div className="bg-[#0f0f18]/60 border border-white/5 backdrop-blur-md rounded-xl px-4 py-2 text-sm text-gray-400 w-fit">
          <span className="text-white font-bold">{filtered.length}</span> {filtered.length === 1 ? "notícia encontrada" : "notícias encontradas"}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-10">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar notícias por título ou resumo..."
              className="w-full bg-[#0f0f18] border border-white/10 text-white placeholder-gray-500 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-gradient-to-r from-blue-neon to-purple text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap btn-press"
          >
            Buscar
          </button>
        </form>

        {/* Categories Horizontal Scroll/List */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2.5 text-sm rounded-xl transition-all whitespace-nowrap btn-press ${
                category === c
                  ? "bg-gradient-to-r from-blue-neon to-purple text-white font-semibold glow-blue"
                  : "bg-[#0f0f18] border border-white/5 text-gray-400 hover:text-white hover:border-white/15"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      {featured && currentPage === 1 && (
        <Link
          href={`/noticias/${featured.slug}`}
          className="group block bg-gradient-to-b from-[#0f0f18] to-[#0a0a0f] border border-white/5 rounded-3xl overflow-hidden mb-12 hover:border-blue-500/20 transition-all duration-300"
        >
          <div className="grid lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto min-h-[320px] overflow-hidden">
              <CardCover
                src={featured.cover}
                alt={featured.title}
                className="group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:hidden" />
              <div className="absolute bottom-4 left-4 lg:hidden">
                <span className="text-xs text-white bg-blue-neon px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {featured.category}
                </span>
              </div>
            </div>
            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-center">
              <span className="hidden lg:inline-block text-xs font-bold uppercase tracking-wider text-blue-neon bg-blue-950/40 border border-blue-900/30 px-3 py-1 rounded-full mb-4 w-fit">
                {featured.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-blue-neon transition-colors mb-4 leading-tight">
                {featured.title}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                {featured.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-y-3 gap-x-4 text-xs text-gray-500 border-t border-white/5 pt-4 mt-auto">
                {featured.author && (() => {
                  const authorInfo = getAuthorInfo(featured.author);
                  return (
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <img src={authorInfo.avatar} alt={authorInfo.name} className="w-4 h-4 rounded-full border border-white/10" />
                      {authorInfo.name}
                    </span>
                  );
                })()}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> {formatDate(featured.publishedAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {getReadTime(featured.content)} min
                </span>
                <span className="flex items-center gap-1.5 ml-auto">
                  <Eye className="w-3.5 h-3.5" /> {featured.views.toLocaleString("pt-BR")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-red-500/80" /> {featured.likes}
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* News grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedRest.map((article) => (
          <Link
            key={article.id}
            href={`/noticias/${article.slug}`}
            className="group game-card bg-[#0f0f18] border border-white/5 rounded-2xl overflow-hidden hover:border-purple/20 transition-all flex flex-col"
          >
            <div className="relative h-52 overflow-hidden">
              <CardCover
                src={article.cover}
                alt={article.title}
                className="group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple to-blue-neon px-2.5 py-1 rounded-full shadow-lg">
                  {article.category}
                </span>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-bold text-base text-white group-hover:text-purple transition-colors leading-snug mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                {article.excerpt}
              </p>

              <div className="flex items-center justify-between text-[11px] text-gray-500 border-t border-white/5 pt-3 mt-auto">
                <div className="flex items-center gap-3">
                  <span>{formatDate(article.publishedAt)}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {getReadTime(article.content)} min
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {article.views.toLocaleString("pt-BR")}
                  </span>
                  {article.likes > 0 && (
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-500/70" /> {article.likes}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-8 border-t border-white/5 mt-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-20 bg-[#0f0f18]/30 border border-white/5 rounded-3xl animate-slide-up">
          <div className="text-6xl mb-4 opacity-80">📰</div>
          <h3 className="text-xl font-bold text-white mb-2">Nenhuma notícia encontrada</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
            Não encontramos nenhum artigo correspondente à sua pesquisa ou filtro de categoria.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors text-sm font-medium btn-press"
          >
            Limpar Filtros
          </button>
        </div>
      )}
    </div>
  );
}
