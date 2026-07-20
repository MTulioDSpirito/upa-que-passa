"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Gamepad2, Newspaper, Loader2, Calendar } from "lucide-react";
import { Game, NewsArticle } from "@/lib/types";

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeSearch, setActiveSearch] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<"tudo" | "jogos" | "noticias">("tudo");

  const [news, setNews] = useState<NewsArticle[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  // Sync state if URL query changes
  useEffect(() => {
    setQuery(initialQuery);
    setActiveSearch(initialQuery);
  }, [initialQuery]);

  // Load data if search term is active
  useEffect(() => {
    if (activeSearch && !hasFetched && !loading) {
      setLoading(true);
      Promise.all([
        fetch(`/api/admin/games?t=${Date.now()}`, { cache: "no-store" }).then((res) =>
          res.ok ? res.json() : null
        ),
        fetch("/api/public/news").then((res) => (res.ok ? res.json() : null)),
      ])
        .then(([gamesData, newsData]) => {
          if (gamesData?.games) setGames(gamesData.games);
          if (newsData?.news) setNews(newsData.news);
          setHasFetched(true);
        })
        .catch((err) => {
          console.error("Erro ao carregar dados de busca:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [activeSearch, hasFetched, loading]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const term = query.trim();
    if (term) {
      router.push(`/buscar?q=${encodeURIComponent(term)}`);
      setActiveSearch(term);
    } else {
      router.push("/buscar");
      setActiveSearch("");
    }
  }

  const { filteredGames, filteredNews, totalResults } = useMemo(() => {
    const term = activeSearch.trim().toLowerCase();
    if (!term) {
      return { filteredGames: [], filteredNews: [], totalResults: 0 };
    }

    const gFiltered = games.filter(
      (g) =>
        g.title.toLowerCase().includes(term) ||
        g.developer.toLowerCase().includes(term) ||
        g.publisher.toLowerCase().includes(term)
    );

    const nFiltered = news.filter(
      (n) =>
        n.title.toLowerCase().includes(term) ||
        (n.excerpt && n.excerpt.toLowerCase().includes(term))
    );

    return {
      filteredGames: gFiltered,
      filteredNews: nFiltered,
      totalResults: gFiltered.length + nFiltered.length,
    };
  }, [activeSearch, games, news]);

  return (
    <div className="min-h-screen bg-[#06060c] pt-28 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header/Title */}
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
            Resultados da Busca
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            {activeSearch ? (
              <span>
                Mostrando resultados para &quot;
                <span className="text-amber-400 font-bold">{activeSearch}</span>
                &quot;
              </span>
            ) : (
              "Digite um termo para pesquisar notícias e reviews."
            )}
          </p>
        </div>

        {/* Input de Busca na Página */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex gap-2 w-full bg-[#0b0b14] border border-white/5 p-2 rounded-2xl shadow-xl"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar jogos, notícias, reviews..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#121220] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 text-sm whitespace-nowrap"
          >
            Buscar
          </button>
        </form>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-amber-500" />
            <p className="text-base font-medium">Buscando no banco de dados...</p>
          </div>
        )}

        {!loading && activeSearch && (
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/5 pb-3">
              <button
                onClick={() => setActiveTab("tudo")}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "tudo"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Tudo ({totalResults})
              </button>
              <button
                onClick={() => setActiveTab("jogos")}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "jogos"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Jogos & Reviews ({filteredGames.length})
              </button>
              <button
                onClick={() => setActiveTab("noticias")}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "noticias"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Notícias ({filteredNews.length})
              </button>
            </div>

            {/* Results Grid/List */}
            <div className="space-y-8">
              {/* Games Section */}
              {(activeTab === "tudo" || activeTab === "jogos") && filteredGames.length > 0 && (
                <div className="space-y-4">
                  {activeTab === "tudo" && (
                    <h2 className="text-lg font-bold text-gray-400 flex items-center gap-2">
                      <Gamepad2 className="w-5 h-5 text-purple-400" />
                      Jogos e Reviews ({filteredGames.length})
                    </h2>
                  )}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {filteredGames.map((game) => (
                      <Link
                        key={game.id}
                        href={`/reviews/${game.slug}`}
                        className="flex items-center gap-4 bg-[#0b0b14]/50 border border-white/5 rounded-2xl p-3 hover:bg-white/5 hover:border-purple-500/20 transition-all group"
                      >
                        <img
                          src={game.cover}
                          alt={game.title}
                          className="w-14 h-20 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors truncate">
                            {game.title}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1 truncate">
                            Desenvolvedor: {game.developer}
                          </p>
                          <p className="text-[10px] text-gray-500 mt-1">
                            Lançamento: {game.releaseDate}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* News Section */}
              {(activeTab === "tudo" || activeTab === "noticias") && filteredNews.length > 0 && (
                <div className="space-y-4">
                  {activeTab === "tudo" && (
                    <h2 className="text-lg font-bold text-gray-400 flex items-center gap-2">
                      <Newspaper className="w-5 h-5 text-amber-400" />
                      Notícias ({filteredNews.length})
                    </h2>
                  )}
                  <div className="space-y-3">
                    {filteredNews.map((article) => (
                      <Link
                        key={article.id}
                        href={`/noticias/${article.slug}`}
                        className="flex items-start gap-4 bg-[#0b0b14]/50 border border-white/5 rounded-2xl p-4 hover:bg-white/5 hover:border-amber-500/20 transition-all group"
                      >
                        <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-500 flex-shrink-0">
                          <Newspaper className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          {article.excerpt && (
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                              {article.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(article.publishedAt || "").toLocaleDateString("pt-BR")}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {totalResults === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 bg-[#0b0b14]/30 rounded-3xl border border-dashed border-white/5">
                  <Gamepad2 className="w-12 h-12 mb-3 text-gray-600" />
                  <p className="text-base font-semibold text-white mb-1">Nenhum resultado encontrado</p>
                  <p className="text-sm max-w-xs">
                    Não encontramos resultados para &quot;{activeSearch}&quot;. Tente outros termos ou palavras-chave.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
