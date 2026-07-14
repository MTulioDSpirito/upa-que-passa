"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Eye, Heart, Calendar, User, Share2, Tag, Check, Clock } from "lucide-react";
import { NEWS, formatDate } from "@/lib/data";
import team from "@/mocks/team";

interface Props { params: Promise<{ slug: string }> }

const getAuthorInfo = (authorName: string) => {
  const cleanName = authorName.split("·")[0].trim().toLowerCase();
  return team.find((t) => t.name.toLowerCase() === cleanName) || {
    name: authorName,
    role: "Redator",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`,
  };
};

export default function NewsArticlePage({ params }: Props) {
  const { slug } = use(params);
  const article = NEWS.find((n) => n.slug === slug);

  // States
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(article ? article.likes : 0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (article) {
      setLikesCount(article.likes);
      setLiked(false);
    }
  }, [article]);

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
        <div className="text-6xl mb-4">📰</div>
        <h1 className="text-2xl font-bold text-white mb-2">Notícia não encontrada</h1>
        <Link href="/noticias" className="text-[#0072ce] hover:text-blue-300">← Voltar às notícias</Link>
      </div>
    );
  }

  // Prioritize related articles in the same category
  const related = NEWS.filter((n) => n.slug !== slug)
    .sort((a, b) => {
      if (a.category === article.category && b.category !== article.category) return -1;
      if (a.category !== article.category && b.category === article.category) return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, 3);

  const getReadTime = (content: string) => {
    const words = content.split(/\s+/).length;
    return Math.ceil(words / 200) || 1;
  };

  const handleLike = () => {
    if (liked) {
      setLikesCount((prev) => prev - 1);
    } else {
      setLikesCount((prev) => prev + 1);
    }
    setLiked(!liked);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const articleParagraphs = article.content.split("\n\n").filter(Boolean);
  const authorInfo = getAuthorInfo(article.author);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 hero-glow-bg">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/noticias" className="hover:text-white transition-colors">Notícias</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white truncate">{article.category}</span>
      </div>

      {/* Category */}
      <span className="text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#0072ce] to-[#7c3aed] px-3.5 py-1.5 rounded-full mb-5 inline-block shadow-lg">
        {article.category}
      </span>

      <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
        {article.title}
      </h1>

      {/* Info bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <img src={authorInfo.avatar} alt={authorInfo.name} className="w-10 h-10 rounded-full border border-white/10 bg-[#0f0f18]" />
          <div>
            <div className="text-sm font-bold text-white leading-tight">{authorInfo.name}</div>
            <div className="text-[11px] text-gray-500">{authorInfo.role}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> {formatDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> {getReadTime(article.content)} min de leitura
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" /> {article.views.toLocaleString("pt-BR")} views
          </span>
        </div>
      </div>

      {/* Cover */}
      <div className="rounded-3xl overflow-hidden mb-8 shadow-2xl relative max-h-[450px]">
        <img src={article.cover} alt={article.title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="bg-[#0f0f18] border border-white/5 rounded-3xl p-6 sm:p-10 mb-8 shadow-xl">
        {/* Excerpt */}
        <p className="text-lg text-gray-200 font-medium leading-relaxed mb-8 border-l-4 border-[#7c3aed] pl-4 sm:pl-6">
          {article.excerpt}
        </p>

        {/* Dynamic Paragraphs */}
        <div className="text-gray-300 text-base md:text-lg leading-relaxed space-y-6">
          {articleParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <p className="pt-4 text-sm text-gray-400 italic border-t border-white/5">
            Fique ligado no Upa que Passa para mais atualizações em primeira mão. Nossa equipe especializada cobrirá todos os detalhes técnicos, análises e reviews de novos lançamentos de PlayStation 5!
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/5">
          <Tag className="w-4 h-4 text-gray-500 mt-1" />
          {article.tags.map((tag) => (
            <span key={tag} className="text-xs text-gray-400 bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full cursor-pointer transition-colors">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Reactions */}
      <div className="flex items-center gap-4 mb-14">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 btn-press ${
            liked 
              ? "bg-red-500 text-white shadow-lg shadow-red-500/20" 
              : "bg-red-900/10 border border-red-800/20 text-red-400 hover:bg-red-900/25"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-white" : ""}`} />
          {likesCount} Curtidas
        </button>
        <button 
          onClick={handleShare}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 btn-press ${
            copied
              ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
              : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copiado!
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              Compartilhar
            </>
          )}
        </button>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="border-t border-white/5 pt-10">
          <h2 className="text-2xl font-black text-white mb-6">Notícias Relacionadas</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((rel) => (
              <Link 
                key={rel.id} 
                href={`/noticias/${rel.slug}`} 
                className="group game-card bg-[#0f0f18] border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/20 transition-all flex flex-col"
              >
                <div className="h-40 overflow-hidden relative">
                  <img src={rel.cover} alt={rel.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" />
                  <span className="absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-wider text-white bg-[#0072ce] px-2 py-0.5 rounded-full">
                    {rel.category}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-2 leading-snug mb-2">
                    {rel.title}
                  </h3>
                  <div className="text-[11px] text-gray-500 mt-auto flex items-center justify-between">
                    <span>{formatDate(rel.publishedAt)}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {getReadTime(rel.content)} min</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
