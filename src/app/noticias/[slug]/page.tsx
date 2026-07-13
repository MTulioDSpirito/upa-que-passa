"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronRight, Eye, Heart, Calendar, User, Share2, Tag } from "lucide-react";
import { NEWS, formatDate } from "@/lib/data";

interface Props { params: Promise<{ slug: string }> }

export default function NewsArticlePage({ params }: Props) {
  const { slug } = use(params);
  const article = NEWS.find((n) => n.slug === slug);
  const related = NEWS.filter((n) => n.slug !== slug).slice(0, 3);

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
        <div className="text-6xl mb-4">📰</div>
        <h1 className="text-2xl font-bold text-white mb-2">Notícia não encontrada</h1>
        <Link href="/noticias" className="text-[#0072ce] hover:text-blue-300">← Voltar às notícias</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/noticias" className="hover:text-white">Notícias</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white truncate">{article.category}</span>
      </div>

      {/* Category */}
      <span className="text-xs text-white bg-[#0072ce] px-3 py-1 rounded-full mb-4 inline-block">{article.category}</span>

      <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">{article.title}</h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
        <span className="flex items-center gap-1.5">
          <User className="w-4 h-4" /> {article.author}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" /> {formatDate(article.publishedAt)}
        </span>
        <span className="flex items-center gap-1.5">
          <Eye className="w-4 h-4" /> {article.views.toLocaleString("pt-BR")} views
        </span>
        <button className="ml-auto flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
          <Share2 className="w-4 h-4" /> Compartilhar
        </button>
      </div>

      {/* Cover */}
      <div className="rounded-3xl overflow-hidden mb-8">
        <img src={article.cover} alt={article.title} className="w-full h-72 object-cover" />
      </div>

      {/* Content */}
      <div className="bg-[#0f0f18] border border-white/5 rounded-3xl p-8 mb-8">
        <p className="text-lg text-gray-300 font-medium leading-relaxed mb-6 border-l-4 border-purple-600 pl-4">
          {article.excerpt}
        </p>
        <div className="text-gray-300 text-sm leading-relaxed space-y-4">
          <p>{article.content}</p>
          <p>
            O anúncio gerou grande repercussão na comunidade gamer brasileira, que aguardava ansiosamente por novidades.
            Fique ligado no Upa que Passa para mais atualizações em primeira mão.
          </p>
          <p>
            Como sempre, o portal irá cobrir todos os detalhes técnicos, análises e reviews assim que o produto ou jogo estiver disponível.
            Nossa equipe especializada garantirá a cobertura mais completa do mercado brasileiro.
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/5">
          <Tag className="w-4 h-4 text-gray-500 mt-0.5" />
          {article.tags.map((tag) => (
            <span key={tag} className="text-xs text-gray-400 bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full cursor-pointer transition-colors">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Reactions */}
      <div className="flex items-center gap-4 mb-10">
        <button className="flex items-center gap-2 px-5 py-2.5 bg-red-900/20 border border-red-800/20 text-red-400 hover:bg-red-900/40 rounded-xl text-sm font-semibold transition-all">
          <Heart className="w-4 h-4" />
          {article.likes} Curtidas
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-gray-400 hover:text-white rounded-xl text-sm font-semibold transition-all">
          <Share2 className="w-4 h-4" />
          Compartilhar
        </button>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-5">Notícias Relacionadas</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {related.map((rel) => (
              <Link key={rel.id} href={`/noticias/${rel.slug}`} className="group bg-[#0f0f18] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/20 transition-all">
                <img src={rel.cover} alt={rel.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform" />
                <div className="p-4">
                  <span className="text-xs text-[#0072ce]">{rel.category}</span>
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#0072ce] transition-colors mt-1 line-clamp-2">{rel.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
