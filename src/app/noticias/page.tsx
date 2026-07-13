"use client";

import Link from "next/link";
import { Eye, Heart, Calendar, Search } from "lucide-react";
import { NEWS, formatDate } from "@/lib/data";
import { useState } from "react";

const CATEGORIES = ["Todas", "Notícias", "Hardware", "Eventos", "Lançamentos", "Reviews", "Análises"];

export default function NoticiasPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");

  const filtered = NEWS.filter((n) => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "Todas" || n.category === category;
    return matchSearch && matchCat;
  });

  const [featured, ...rest] = filtered;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2">Notícias</h1>
        <p className="text-gray-400">As últimas novidades do mundo gamer</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar notícias..."
            className="bg-[#0f0f18] border border-white/10 text-white placeholder-gray-500 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-2 text-sm rounded-xl transition-all ${
                category === c ? "bg-[#0072ce] text-white" : "bg-[#0f0f18] border border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      {featured && (
        <Link href={`/noticias/${featured.slug}`} className="group block bg-[#0f0f18] border border-white/5 rounded-3xl overflow-hidden mb-10 hover:border-blue-500/20 transition-all">
          <div className="grid md:grid-cols-2">
            <div className="relative h-64 md:h-auto overflow-hidden">
              <img src={featured.cover} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <span className="text-xs text-[#0072ce] bg-blue-900/30 px-2 py-1 rounded-full mb-3 inline-block w-fit">
                {featured.category}
              </span>
              <h2 className="text-2xl font-black text-white group-hover:text-[#0072ce] transition-colors mb-3 leading-tight">
                {featured.title}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(featured.publishedAt)}</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {featured.views.toLocaleString("pt-BR")}</span>
                <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {featured.likes}</span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* News grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rest.map((article) => (
          <Link
            key={article.id}
            href={`/noticias/${article.slug}`}
            className="group bg-[#0f0f18] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/20 transition-all"
          >
            <div className="relative h-48 overflow-hidden">
              <img src={article.cover} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute top-3 left-3">
                <span className="text-xs text-white bg-[#0072ce] px-2 py-1 rounded-full">{article.category}</span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-white group-hover:text-[#0072ce] transition-colors leading-tight mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{article.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{formatDate(article.publishedAt)}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {article.views.toLocaleString("pt-BR")}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <div className="text-6xl mb-4">📰</div>
          <p className="text-xl">Nenhuma notícia encontrada</p>
        </div>
      )}
    </div>
  );
}
