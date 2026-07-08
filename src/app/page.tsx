"use client";

import Link from "next/link";
import { ArrowRight, Star, Flame, ShoppingBag, Trophy, Newspaper, ChevronRight, TrendingUp, Users, MessageSquare } from "lucide-react";
import GameCard from "@/components/GameCard";
import { NEWS, LISTINGS, formatPrice, formatDate, getScoreColor, formatScore } from "@/lib/data";
import { useAllGames } from "@/hooks/useAllGames";

const SITE_SCORES_DISPLAY = [
  { site: "IGN", logo: "🎮" },
  { site: "Metacritic", logo: "📊" },
  { site: "OpenCritic", logo: "🔓" },
  { site: "GameSpot", logo: "🎯" },
  { site: "Push Square", logo: "🔵" },
];

export default function Home() {
  const [GAMES] = useAllGames();
  const featuredGames = GAMES.filter((g) => g.featured);
  // Prefer a featured game that already has an editorial "Nota UQP" (adminScore) for the hero,
  // since the scores row below is built around that field — falls back to the first featured
  // game if none has one yet (e.g. freshly added titles awaiting a full review).
  const topGame = featuredGames.find((g) => g.adminScore) ?? featuredGames[0];
  const sortedNews = [...NEWS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const latestNews = sortedNews.slice(0, 3);
  const moreNews = sortedNews.slice(3, 6);
  const activeListings = LISTINGS.filter((l) => l.active).slice(0, 3);

  const secondGame = featuredGames[1] ?? GAMES[1];

  const trendingCards = [
    ...latestNews.map((n) => ({
      href: `/noticias/${n.slug}`,
      image: n.cover,
      badge: n.category,
      title: n.title,
    })),
    secondGame && {
      href: `/jogos/${secondGame.slug}`,
      image: secondGame.cover,
      badge: "Review",
      title: secondGame.title,
    },
  ].filter((c): c is { href: string; image: string; badge: string; title: string } => !!c).slice(0, 4);

  return (
    <div className="bg-[#0a0a0f]">
      {/* ─── TRENDING STRIP ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {trendingCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-[#111118] border border-white/5"
            >
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
              <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wide bg-purple-600 text-white px-2 py-0.5 rounded">
                {card.badge}
              </span>
              <h3 className="absolute bottom-0 left-0 right-0 p-3 text-white font-bold text-sm leading-tight line-clamp-3">
                {card.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── NOTÍCIAS ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Newspaper className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-black text-white">Últimas Notícias</h2>
          </div>
          <Link href="/noticias" className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors">
            Ver todas <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {moreNews.map((news) => (
            <Link
              key={news.id}
              href={`/noticias/${news.slug}`}
              className="group block bg-[#111118] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/20 transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={news.cover}
                  alt={news.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {news.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors leading-tight mb-2 line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{news.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatDate(news.publishedAt)}</span>
                  <span>{news.views.toLocaleString("pt-BR")} views</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── MARKETPLACE ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-black text-white">Marketplace</h2>
            <span className="text-xs bg-green-900/30 text-green-400 border border-green-800/30 px-2 py-0.5 rounded-full">
              Compre e Troque
            </span>
          </div>
          <Link href="/marketplace" className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300 transition-colors">
            Ver todos <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {activeListings.map((listing) => (
            <Link
              key={listing.id}
              href={`/marketplace/${listing.id}`}
              className="group bg-[#111118] border border-white/5 rounded-2xl overflow-hidden hover:border-green-500/20 transition-all"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={listing.photos[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    listing.condition === "lacrado" ? "bg-green-600 text-white" :
                    listing.condition === "como novo" ? "bg-blue-600 text-white" :
                    "bg-yellow-600 text-white"
                  }`}>
                    {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}
                  </span>
                  {listing.acceptsTrade && (
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-purple-600 text-white">
                      Aceita Troca
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors mb-1 line-clamp-2">
                  {listing.title}
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-black text-green-400">{formatPrice(listing.price)}</span>
                  <span className="text-xs text-gray-500">{listing.city} / {listing.state}</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={listing.userAvatar} alt="" className="w-6 h-6 rounded-full" />
                  <span className="text-xs text-gray-500">{listing.userNickname}</span>
                  <span className="ml-auto text-xs text-yellow-400">⭐ {listing.userReputation}%</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── DESTAQUE DO MOMENTO ─────────────────────────────── */}
      {topGame && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-5">
            <Flame className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl font-black text-white">Destaque do Momento</h2>
          </div>
          <div className="relative rounded-2xl overflow-hidden bg-[#111118] border border-purple-800/20 p-5 flex gap-5 flex-wrap sm:flex-nowrap">
            {/* Cover */}
            <img
              src={topGame.cover}
              alt={topGame.title}
              className="w-32 h-44 sm:w-40 sm:h-56 object-cover object-center rounded-xl shadow-lg shadow-black/40 flex-shrink-0"
            />

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
              <div className="flex gap-2 mb-2">
                {topGame.genres.slice(0, 3).map((g) => (
                  <span key={g} className="text-xs text-purple-400 bg-purple-900/30 px-2 py-1 rounded-full">
                    {g}
                  </span>
                ))}
              </div>
              <h3 className="font-display text-xl sm:text-2xl text-white mb-2">{topGame.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{topGame.synopsis}</p>

              {/* Scores row */}
              <div className="grid grid-cols-3 gap-2 mb-4 max-w-sm">
                {[
                  { label: "Nota UQP", score: topGame.adminScore },
                  { label: "Metacritic", score: topGame.metacriticScore ? topGame.metacriticScore / 10 : undefined },
                  { label: "Usuários", score: topGame.userScore || undefined },
                ].map((s) => (
                  <div key={s.label} className="bg-white/5 rounded-lg p-2 text-center">
                    <div className={`text-lg font-black ${s.score ? getScoreColor(s.score) : "text-gray-500"}`}>
                      {s.score ? formatScore(s.score) : "—"}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/jogos/${topGame.slug}`}
                  className="flex items-center gap-2 px-5 py-2 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all"
                >
                  Ver Review Completa
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── JOGOS EM DESTAQUE ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-black text-white">Melhores Avaliados</h2>
          </div>
          <Link href="/jogos" className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors">
            Ver todos <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {GAMES.slice(0, 5).map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* ─── NOTAS DOS GRANDES SITES ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl font-black text-white">Notas dos Maiores Portais</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {GAMES.slice(0, 4).map((game) => (
            <div key={game.id} className="bg-[#111118] border border-white/5 rounded-2xl p-5 hover:border-purple-500/20 transition-all">
              <div className="flex gap-4 mb-4">
                <img src={game.cover} alt={game.title} className="w-14 h-20 object-cover object-center rounded-lg flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-white mb-1">{game.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{game.developer} · {new Date(game.releaseDate).getFullYear()}</p>
                  <div className={`text-xl font-black ${getScoreColor(game.worldAvg || 0)}`}>
                    Média Mundial: {formatScore(game.worldAvg || 0)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {game.siteScores.map((s) => (
                  <div key={s.site} className="bg-white/5 rounded-lg p-2 text-center">
                    <div className={`text-sm font-bold ${getScoreColor(s.score > 10 ? s.score / 10 : s.score)}`}>
                      {s.score > 10 ? s.score : `${s.score}/10`}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{s.site}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── RANKING ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Ranking */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-black text-white">Top Jogos 2024</h2>
            </div>
            <div className="space-y-3">
              {[...GAMES].sort((a, b) => (b.adminScore || 0) - (a.adminScore || 0)).slice(0, 5).map((game, i) => (
                <Link
                  key={game.id}
                  href={`/jogos/${game.slug}`}
                  className="flex items-center gap-4 bg-[#111118] border border-white/5 rounded-xl p-3 hover:border-purple-500/20 transition-all group"
                >
                  <span className={`text-2xl font-black w-8 text-center ${
                    i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-orange-400" : "text-gray-500"
                  }`}>
                    #{i + 1}
                  </span>
                  <img src={game.cover} alt={game.title} className="w-10 h-14 object-cover object-center rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white group-hover:text-purple-300 transition-colors text-sm line-clamp-1">
                      {game.title}
                    </p>
                    <p className="text-xs text-gray-500">{game.developer}</p>
                  </div>
                  <div className={`text-lg font-black ${getScoreColor(game.adminScore || 0)}`}>
                    {formatScore(game.adminScore || 0)}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Cards */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/10 border border-purple-700/30 rounded-2xl p-6">
              <Users className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">Comunidade Gamer</h3>
              <p className="text-sm text-gray-400 mb-4">
                Participe de debates, compartilhe suas análises e conecte-se com outros gamers brasileiros.
              </p>
              <Link
                href="/cadastrar"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl transition-all"
              >
                Criar Conta Grátis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/10 border border-blue-700/30 rounded-2xl p-6">
              <TrendingUp className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">Alerta de Preços</h3>
              <p className="text-sm text-gray-400 mb-4">
                Receba notificações quando seus jogos favoritos estiverem em promoção nas lojas parceiras.
              </p>
              <Link
                href="/cadastrar"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all"
              >
                Ativar Alertas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-green-900/40 to-green-800/10 border border-green-700/30 rounded-2xl p-6">
              <MessageSquare className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">Venda ou Troque Seus Jogos</h3>
              <p className="text-sm text-gray-400 mb-4">
                Anuncie gratuitamente e negocie com segurança pelo chat interno.
              </p>
              <Link
                href="/marketplace/vender"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-xl transition-all"
              >
                Anunciar Agora
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
