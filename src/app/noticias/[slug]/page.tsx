import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Calendar, Clock, Tag } from "lucide-react";
import { formatDate } from "@/lib/data";
import { readAdminNews } from "@/lib/adminNews";
import { SITE_URL } from "@/lib/site";
import team from "@/mocks/team";
import CardCover from "@/components/ui/CardCover";
import { ViewsCounter, ReactionBar } from "./NewsInteractions";

interface Props { params: Promise<{ slug: string }> }

const getAuthorInfo = (authorName: string) => {
  const parts = authorName.split("·");
  const name = parts[0].trim();
  const avatarUrl = parts[1]?.trim();
  const cleanName = name.toLowerCase();

  return team.find((t) => t.name.toLowerCase() === cleanName) || {
    name,
    role: "Redator",
    avatar: avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
  };
};

const getReadTime = (content: string) => {
  const words = content.split(/\s+/).length;
  return Math.ceil(words / 200) || 1;
};

export const revalidate = 60;

async function getArticle(slug: string) {
  const news = await readAdminNews();
  const article = news.find((n) => n.slug === slug) ?? null;
  const related = article
    ? news
        .filter((n) => n.slug !== slug)
        .sort((a, b) => {
          if (a.category === article.category && b.category !== article.category) return -1;
          if (a.category !== article.category && b.category === article.category) return 1;
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        })
        .slice(0, 3)
    : [];
  return { article, related };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { article } = await getArticle(slug);
  if (!article) return { title: "Notícia não encontrada — Upa que Passa" };

  const url = `${SITE_URL}/noticias/${article.slug}`;
  return {
    title: `${article.title} — Upa que Passa`,
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url,
      images: article.cover ? [{ url: article.cover }] : undefined,
      publishedTime: article.publishedAt,
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.cover ? [article.cover] : undefined,
    },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const { article, related } = await getArticle(slug);

  if (!article) notFound();

  const articleParagraphs = article.content.split("\n\n").filter(Boolean);
  const authorInfo = getAuthorInfo(article.author);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.cover ? [article.cover] : undefined,
    datePublished: article.publishedAt,
    author: [{ "@type": "Person", name: authorInfo.name }],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 hero-glow-bg">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/noticias" className="hover:text-white transition-colors">Notícias</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white truncate">{article.category}</span>
      </div>

      {/* Category */}
      <span className="text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-neon to-purple px-3.5 py-1.5 rounded-full mb-5 inline-block shadow-lg">
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
          <ViewsCounter articleId={article.id} initialViews={article.views} />
        </div>
      </div>

      {/* Cover */}
      <div className="mb-8">
        <div className="rounded-3xl overflow-hidden shadow-2xl relative h-[280px] sm:h-[380px] md:h-[450px]">
          <CardCover src={article.cover} alt={article.title} priority />
        </div>
        {article.imageCredits && (
          <p className="text-xs text-gray-500 mt-2 text-right italic">
            Créditos da imagem: {article.imageCredits}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="bg-[#0f0f18] border border-white/5 rounded-3xl p-6 sm:p-10 mb-8 shadow-xl">
        {/* Excerpt */}
        <p className="text-lg text-gray-200 font-medium leading-relaxed mb-8 border-l-4 border-purple pl-4 sm:pl-6">
          {article.excerpt}
        </p>

        {/* Dynamic Paragraphs */}
        <div className="text-gray-300 text-base md:text-lg leading-relaxed space-y-6 animate-fade-in">
          {articleParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <p className="pt-4 text-sm text-gray-400 italic border-t border-white/5">
            Fique ligado no Upa que Passa para mais atualizações em primeira mão. Nossa equipe especializada cobrirá todos os detalhes técnicos, análises e reviews de novos lançamentos de PlayStation 5!
          </p>
        </div>

        {/* Fontes */}
        {article.fontes && (
          <div className="mt-8 pt-4 border-t border-white/5 text-sm text-gray-400 flex items-center gap-2">
            <span className="font-semibold text-white">Fontes:</span>
            <span className="bg-white/5 px-2.5 py-1 rounded-lg text-xs font-mono">{article.fontes}</span>
          </div>
        )}

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
      <ReactionBar articleId={article.id} initialLikes={article.likes} />

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
                  <CardCover src={rel.cover} alt={rel.title} className="group-hover:scale-103 transition-transform duration-500" />
                  <span className="absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-wider text-white bg-blue-neon px-2 py-0.5 rounded-full">
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
