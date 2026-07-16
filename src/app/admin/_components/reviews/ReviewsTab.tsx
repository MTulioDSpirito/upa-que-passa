"use client";

import { useEffect, useState } from "react";
import { Plus, AlertCircle, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Game, Review } from "@/lib/types";
import { type AdminUserSession } from "../layout/AdminUserFooter";
import ReviewList from "./ReviewList";
import ReviewFormModal from "./ReviewFormModal";

interface ReviewsTabProps {
  allGames: Game[];
  adminUser: AdminUserSession;
}

export default function ReviewsTab({ allGames, adminUser }: ReviewsTabProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal and form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [selectedScoreRange, setSelectedScoreRange] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSearchQuery, selectedScoreRange]);

  // Fetch reviews on mount
  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/reviews");
      if (!res.ok) {
        throw new Error("Erro ao buscar reviews.");
      }
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err: any) {
      setError(err.message || "Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openNewForm = () => {
    setEditingReview(null);
    setIsFormOpen(true);
  };

  const startEdit = (review: Review) => {
    setEditingReview(review);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta review?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erro ao excluir review.");
      }
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      alert(err.message || "Erro de conexão ao excluir.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetFeatured = async (reviewId: string) => {
    if (adminUser.role !== "DEVELOPER") {
      alert("Apenas administradores com cargo DEVELOPER podem alterar a review em destaque.");
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/reviews/featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erro ao definir review em destaque.");
      }
      setReviews((prev) =>
        prev.map((r) => ({
          ...r,
          featured: r.id === reviewId,
        }))
      );
    } catch (err: any) {
      alert(err.message || "Erro de conexão ao definir destaque.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleFormSubmit = async (payload: any) => {
    setActionLoading(true);
    try {
      let finalGameId = payload.gameId;

      if (payload.isNewGame && payload.newGameDetails) {
        const method = payload.isEditingExistingGame ? "PUT" : "POST";
        const body = {
          id: finalGameId,
          title: payload.newGameDetails.title,
          cover: payload.newGameDetails.cover,
          developer: payload.newGameDetails.developer,
          releaseDate: payload.newGameDetails.releaseDate,
          genres: payload.newGameDetails.genres,
          platforms: payload.newGameDetails.platforms,
          suggestedPrice: payload.newGameDetails.price,
          trailer: payload.newGameDetails.trailer,
          gallery: payload.newGameDetails.gallery,
          description: payload.newGameDetails.description,
          metacriticScore: payload.newGameDetails.metacriticScore,
        };

        const gameRes = await fetch("/api/admin/games", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!gameRes.ok) {
          const gameErr = await gameRes.json();
          throw new Error(gameErr.error || `Erro ao ${payload.isEditingExistingGame ? 'atualizar' : 'cadastrar'} jogo no catálogo.`);
        }

        if (!payload.isEditingExistingGame) {
          const gameData = await gameRes.json();
          finalGameId = gameData.game.id;
        }
      }

      const url = "/api/admin/reviews";
      const method = editingReview ? "PUT" : "POST";
      
      const cleanPayload = {
        gameId: finalGameId,
        title: payload.title,
        text: payload.text,
        pros: payload.pros,
        cons: payload.cons,
        conclusion: payload.conclusion,
        scores: payload.scores,
        overallScore: payload.overallScore,
        author: payload.author,
        publishedAt: payload.publishedAt,
        imageCredits: payload.imageCredits,
      };

      const body = editingReview ? { id: editingReview.id, ...cleanPayload } : cleanPayload;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erro ao salvar review.");
      }

      setIsFormOpen(false);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Erro de conexão ao salvar.");
    } finally {
      setActionLoading(false);
    }
  };

  // Filter logic
  const filteredReviews = reviews.filter((review) => {
    const game = allGames.find((g) => g.id === review.gameId);

    // Search query filter: check review title or game title
    if (activeSearchQuery.trim() !== "") {
      const query = activeSearchQuery.toLowerCase();
      const matchesReviewTitle = review.title.toLowerCase().includes(query);
      const matchesGameTitle = game ? game.title.toLowerCase().includes(query) : false;
      if (!matchesReviewTitle && !matchesGameTitle) {
        return false;
      }
    }

    // Score range filter
    if (selectedScoreRange !== "") {
      const score = review.overallScore;
      if (selectedScoreRange === "exceptional" && score < 9.0) return false;
      if (selectedScoreRange === "recommended" && (score < 7.0 || score >= 9.0)) return false;
      if (selectedScoreRange === "mixed" && (score < 5.0 || score >= 7.0)) return false;
      if (selectedScoreRange === "negative" && score >= 5.0) return false;
    }

    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  const activePage = Math.min(currentPage, Math.max(1, totalPages));
  const paginatedReviews = filteredReviews.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Reviews da Equipe ({reviews.length})</h1>
          <p className="text-gray-500 text-sm">
            Gerenciamento das análises completas publicadas manualmente ou revisadas da IA.
          </p>
        </div>
        <button
          onClick={openNewForm}
          className="btn-press flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl transition-all"
        >
          <Plus className="w-4 h-4" /> Nova Review
        </button>
      </div>

      {/* Filter Bar */}
      {!loading && !error && reviews.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-6 bg-[#0f0f18]/60 border border-white/5 p-4 rounded-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setActiveSearchQuery(searchQuery);
            }}
            className="flex flex-1 min-w-[280px] gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por título ou jogo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white/[0.03] hover:bg-white/[0.05] focus:bg-white/[0.07] border border-white/10 focus:border-purple-500/50 rounded-xl text-white placeholder-gray-500 text-sm outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveSearchQuery("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-500 hover:text-white rounded-md hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-medium text-sm rounded-xl border border-white/10 transition-colors"
            >
              Buscar
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Select Nota */}
            <select
              value={selectedScoreRange}
              onChange={(e) => setSelectedScoreRange(e.target.value)}
              className="px-3 py-2.5 bg-[#0f0f18] hover:bg-white/[0.02] border border-white/10 rounded-xl text-white text-sm outline-none cursor-pointer min-w-[150px] transition-colors"
            >
              <option value="" className="bg-[#0f0f18] text-white">Todas as Notas</option>
              <option value="exceptional" className="bg-[#0f0f18] text-white">Excepcional (9.0 - 10)</option>
              <option value="recommended" className="bg-[#0f0f18] text-white">Recomendado (7.0 - 8.9)</option>
              <option value="mixed" className="bg-[#0f0f18] text-white">Misto (5.0 - 6.9)</option>
              <option value="negative" className="bg-[#0f0f18] text-white">Negativo (&lt; 5.0)</option>
            </select>

            {/* Reset button if any filter is active */}
            {(activeSearchQuery || selectedScoreRange) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveSearchQuery("");
                  setSelectedScoreRange("");
                }}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold transition-colors px-2 py-1"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>
      )}

      {loading && <p className="text-gray-500 text-sm">Carregando análises...</p>}

      {!loading && error && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-12 text-center text-gray-500">
          <p className="font-semibold text-white mb-2">Nenhuma review cadastrada ainda</p>
          <p className="text-sm max-w-md mx-auto">
            Adicione uma nova review manual ou revise as sugestões da inteligência artificial para que elas apareçam aqui.
          </p>
        </div>
      )}

      {!loading && !error && reviews.length > 0 && filteredReviews.length === 0 && (
        <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-12 text-center text-gray-500">
          <p className="font-semibold text-white mb-2">Nenhuma review encontrada</p>
          <p className="text-sm max-w-md mx-auto">
            Nenhum resultado corresponde aos filtros aplicados. Tente limpar os filtros ou ajustar sua busca.
          </p>
        </div>
      )}

      {!loading && !error && filteredReviews.length > 0 && (
        <>
          <ReviewList
            reviews={paginatedReviews}
            allGames={allGames}
            actionLoading={actionLoading}
            adminUser={adminUser}
            onEdit={startEdit}
            onDelete={handleDelete}
            onSetFeatured={handleSetFeatured}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 bg-[#0f0f18]/40 border border-white/5 px-4 py-3 rounded-xl">
              <span className="text-xs text-gray-400">
                Mostrando <span className="text-white font-medium">{(activePage - 1) * ITEMS_PER_PAGE + 1}</span> a{" "}
                <span className="text-white font-medium">
                  {Math.min(activePage * ITEMS_PER_PAGE, filteredReviews.length)}
                </span>{" "}
                de <span className="text-white font-medium">{filteredReviews.length}</span> reviews
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={activePage === 1}
                  className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 flex items-center justify-center text-sm font-semibold rounded-lg transition-colors border ${
                      page === activePage
                        ? "bg-purple-600 border-purple-500 text-white"
                        : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={activePage === totalPages}
                  className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <ReviewFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        allGames={allGames}
        initialReview={editingReview}
        adminUser={adminUser}
        actionLoading={actionLoading}
      />
    </div>
  );
}
