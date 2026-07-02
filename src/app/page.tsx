"use client";

import Link from "next/link";
import { ArrowRight, Star, Flame, ShoppingBag, Trophy, Newspaper, ChevronRight, TrendingUp, Users, MessageSquare, Gamepad2 } from "lucide-react";
import GameCard from "@/components/GameCard";
import { GAMES, NEWS, LISTINGS, formatPrice, formatDate, getScoreColor, formatScore } from "@/lib/data";

const SITE_SCORES_DISPLAY = [
  { site: "IGN", logo: "🎮" },
  { site: "Metacritic", logo: "📊" },
  { site: "OpenCritic", logo: "🔓" },
  { site: "GameSpot", logo: "🎯" },
  { site: "Push Square", logo: "🔵" },
];

export default function Home() {
  const featuredGames = GAMES.filter((g) => g.featured);
  const topGame = featuredGames[0];
  const latestNews = NEWS.slice(0, 3);
  const activeListings = LISTINGS.filter((l) => l.active).slice(0, 3);

  return (
    <div className="bg-[#0a0a0f]">
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Banner image */}
        <div className="absolute inset-0">
          <img
            src="/banner.jpg"
            alt="Upa que Passa Banner"
            className="w-full h-full object-cover object-center"
          />
          {/* Dark overlay com gradiente para manter legibilidade */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#0a0a0f]" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-transparent to-blue-900/40" />
          {/* Glow effects sobre a imagem */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-purple-900/40 border border-purple-500/30 rounded-full px-4 py-1.5 mb-6">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-purple-300 font-medium">Portal #1 de Jogos PS5 do Brasil</span>
          </div>

          {/* Logo / Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tight">
            <span className="text-white">UPA</span>{" "}
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">QUE</span>{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">PASSA</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            O maior portal brasileiro de <strong className="text-white">reviews</strong>,{" "}
            <strong className="text-white">notas</strong> e{" "}
            <strong className="text-white">compra, venda e troca</strong> de jogos de PlayStation 5.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Link
              href="/reviews"
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60"
            >
              <Star className="w-5 h-5" />
              Ver Reviews
            </Link>
            <Link
              href="/marketplace"
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/40"
            >
              <ShoppingBag className="w-5 h-5" />
              Marketplace
            </Link>
            <Link
              href="/lancamentos"
              className="flex items-center gap-2 px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl transition-all"
            >
              <Gamepad2 className="w-5 h-5" />
              Últimos Lançamentos
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: "Jogos Avaliados", value: "500+", icon: "🎮" },
              { label: "Usuários Ativos", value: "12k+", icon: "👥" },
              { label: "Reviews Publicadas", value: "1.8k+", icon: "✍️" },
              { label: "Trocas Realizadas", value: "850+", icon: "🤝" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DESTAQUE DO MOMENTO ─────────────────────────────── */}
      {topGame && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center gap-3 mb-8">
            <Flame className="w-6 h-6 text-orange-400" />
            <h2 className="text-2xl font-black text-white">Destaque do Momento</h2>
          </div>
          <div className="relative rounded-3xl overflow-hidden bg-[#111118] border border-purple-800/20">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image side */}
              <div className="relative h-72 md:h-auto">
                <img
                  src={topGame.cover}
                  alt={topGame.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#111118] hidden md:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-transparent to-transparent md:hidden" />
              </div>

              {/* Info side */}
              <div className="p-8 flex flex-col justify-center">
                <div className="flex gap-2 mb-3">
                  {topGame.genres.slice(0, 3).map((g) => (
                    <span key={g} className="text-xs text-purple-400 bg-purple-900/30 px-2 py-1 rounded-full">
                      {g}
                    </span>
                  ))}
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-3">{topGame.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">{topGame.synopsis}</p>

                {/* Scores row */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "Nota UQP", score: topGame.adminScore! },
                    { label: "Metacritic", score: topGame.metacriticScore! / 10 },
                    { label: "Usuários", score: topGame.userScore },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
                      <div className={`text-2xl font-black ${getScoreColor(s.score)}`}>
                        {formatScore(s.score)}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/jogos/${topGame.slug}`}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all"
                  >
                    Ver Review Completa
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
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
                <img src={game.cover} alt={game.title} className="w-14 h-20 object-cover rounded-lg flex-shrink-0" />
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
          {latestNews.map((news, i) => (
            <Link
              key={news.id}
              href={`/noticias/${news.slug}`}
              className="group block bg-[#111118] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/20 transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={news.cover}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                <div className="flex items-center justify-between text-xs text-gray-600">
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
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                    i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-orange-400" : "text-gray-600"
                  }`}>
                    #{i + 1}
                  </span>
                  <img src={game.cover} alt={game.title} className="w-10 h-14 object-cover rounded-lg" />
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
