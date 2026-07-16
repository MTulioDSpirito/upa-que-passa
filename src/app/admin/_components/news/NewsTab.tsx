"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Eye, Edit, Trash2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { NewsArticle } from "@/lib/types";
import { formatDate } from "@/lib/data";
import { type AdminUserSession } from "../layout/AdminUserFooter";
import NewsFormModal from "./NewsFormModal";

interface NewsTabProps {
  adminUser: AdminUserSession;
}

const CATEGORIES = ["Todas", "Notícias", "Lançamentos", "Hardware", "Artigos", "Eventos", "Outros"];

export default function NewsTab({ adminUser }: NewsTabProps) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/news");
      if (!res.ok) {
        throw new Error("Erro ao carregar notícias.");
      }
      const data = await res.json();
      setNews(data.news || []);
    } catch (err: any) {
      setError(err.message || "Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Filter & Search application
  const filteredNews = news.filter((article) => {
    const matchesSearch =
      activeSearchQuery === "" ||
      article.title.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(activeSearchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "Todas" ||
      article.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSearchQuery, selectedCategory]);

  const handleOpenNewModal = () => {
    setEditingArticle(null);
    setIsModalOpen(true);
  };

  const handleStartEdit = (article: NewsArticle) => {
    setEditingArticle(article);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta notícia?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/news?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erro ao excluir notícia.");
      }
      setNews((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(err.message || "Erro de conexão ao excluir.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleFormSubmit = async (payload: any) => {
    setActionLoading(true);
    try {
      const isEditing = !!editingArticle;
      const url = "/api/admin/news";
      const method = isEditing ? "PUT" : "POST";
      const body = isEditing ? { id: editingArticle.id, ...payload } : payload;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erro ao salvar notícia.");
      }

      const data = await res.json();

      if (isEditing) {
        setNews((prev) =>
          prev.map((item) => (item.id === editingArticle.id ? data.news : item))
        );
      } else {
        setNews((prev) => [data.news, ...prev]);
      }
    } catch (err: any) {
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setActiveSearchQuery(searchQuery);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Notícias</h1>
          <p className="text-sm text-gray-400">
            Gerencie o portal de notícias, artigos e novidades do Upa que passa.
          </p>
        </div>
        <button
          onClick={handleOpenNewModal}
          className="btn-press flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-purple-950/20"
        >
          <Plus className="w-4 h-4" /> Nova Notícia
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 bg-[#0f0f18]/60 border border-white/5 p-4 rounded-2xl">
        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyPress}
            placeholder="Buscar por título ou autor... (Pressione Enter)"
            className="w-full bg-[#161624]/60 border border-white/5 focus:border-purple-500/50 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none transition-colors"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveSearchQuery("");
              }}
              className="absolute right-3 top-3 text-xs text-gray-500 hover:text-white"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Filters and Controls */}
        <div className="flex items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#161624]/60 border border-white/5 focus:border-purple-500/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none transition-colors"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-[#0f0f18] text-white">
                {cat}
              </option>
            ))}
          </select>

          <button
            onClick={() => setActiveSearchQuery(searchQuery)}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-semibold transition-all border border-white/5"
          >
            Filtrar
          </button>
        </div>
      </div>

      {/* Listing Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400">Carregando notícias...</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-4 bg-red-950/20 border border-red-500/20 text-red-400 rounded-xl">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-[#0f0f18]/30 border border-white/5 rounded-2xl">
          <AlertCircle className="w-10 h-10 text-gray-600 mb-2" />
          <p className="text-gray-400 font-semibold">Nenhuma notícia encontrada</p>
          <p className="text-xs text-gray-600 mt-1">
            Experimente alterar os termos da busca ou filtros aplicados.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-[#0f0f18]/40 border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5 shadow-xl">
            {paginatedNews.map((article) => (
              <div
                key={article.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-white/[0.01] transition-colors"
              >
                {/* Info Block */}
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-20 h-14 bg-white/5 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                    <img
                      src={article.cover}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-purple-950/50 text-purple-400 border border-purple-800/30 rounded">
                        {article.category}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {formatDate(article.publishedAt)}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white truncate max-w-xl">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Por <span className="text-gray-300 font-medium">{article.author}</span>
                      {article.tags && article.tags.length > 0 && (
                        <>
                          <span className="mx-2 text-gray-600">·</span>
                          <span className="text-[10px] text-gray-500">
                            {article.tags.slice(0, 3).join(", ")}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Status & Actions Block */}
                <div className="flex items-center justify-between sm:justify-end gap-6 flex-shrink-0">
                  {/* View Stats */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span>{article.views?.toLocaleString("pt-BR") || 0}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEdit(article)}
                      disabled={actionLoading}
                      className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/25 rounded-xl transition-all"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      disabled={actionLoading}
                      className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/25 rounded-xl transition-all"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-[#0f0f18]/30 border border-white/5 rounded-2xl">
              <span className="text-xs text-gray-500">
                Página {currentPage} de {totalPages} · {filteredNews.length} notícias no total
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Editor Modal */}
      <NewsFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        article={editingArticle}
        adminUser={adminUser}
        actionLoading={actionLoading}
      />
    </div>
  );
}
