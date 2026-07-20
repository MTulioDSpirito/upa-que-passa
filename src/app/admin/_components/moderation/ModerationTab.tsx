"use client";

import { useEffect, useState } from "react";
import { Trash2, Search, MessageSquare, Star, Users } from "lucide-react";
import { formatDate } from "@/lib/data";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Comment {
  id: string;
  userId: string;
  userNickname: string;
  userAvatar: string | null;
  text: string;
  score: number;
  createdAt: string;
  gameId: string;
  game: {
    title: string;
  };
}

export default function ModerationTab() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Pagination States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchComments();
  }, [page, search]);

  async function fetchComments() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (search.trim()) {
        params.append("search", search.trim());
      }
      const res = await fetch(`/api/admin/comments?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
        setTotalPages(data.pages || 1);
        setTotalItems(data.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/comments?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchComments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setPage(1);
      setSearch(searchInput);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (!value.trim()) {
      setPage(1);
      setSearch("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-purple-400" />
          Moderação de Comentários ({totalItems})
        </h1>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por usuário, jogo ou texto (Enter)..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full bg-[#0f0f18] border border-white/5 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="md" label="Carregando comentários..." />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500">
          Nenhum comentário encontrado.
        </p>
      ) : (
        <div className="space-y-6">
          <div className="bg-[#0f0f18] border border-white/5 rounded-2xl divide-y divide-white/5 overflow-hidden">
            {comments.map((c) => (
              <div key={c.id} className="p-5 flex flex-col md:flex-row md:items-start gap-4 hover:bg-white/[0.01] transition-colors">
                <img
                  src={c.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(c.userNickname)}`}
                  alt=""
                  className="w-10 h-10 rounded-full flex-shrink-0 bg-neutral-800"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5">
                    <span className="font-bold text-white text-sm">{c.userNickname}</span>
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                      avaliou <strong className="text-purple-400 font-semibold">{c.game.title}</strong>
                    </span>
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-xs text-gray-500">{formatDate(c.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex items-center gap-0.5 text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-900/25 border border-purple-500/20 text-purple-300">
                      <Star className="w-3 h-3 text-purple-400 fill-purple-400" />
                      <span>NOTA: {c.score}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed font-sans">{c.text}</p>
                </div>

                <div className="flex-shrink-0 self-end md:self-start">
                  {deletingId === c.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-400 font-mono">Excluir?</span>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold font-mono transition-colors"
                      >
                        Sim
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="px-2.5 py-1 bg-white/10 hover:bg-white/15 text-white rounded text-xs font-bold font-mono transition-colors"
                      >
                        Não
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(c.id)}
                      className="btn-press p-2 bg-red-950/20 text-red-400 border border-red-900/20 rounded-xl hover:bg-red-900/25 hover:border-red-800/30 transition-all"
                      title="Excluir Comentário"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/5 bg-[#0f0f18]/25 px-4 py-4 sm:px-6 rounded-2xl">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:pointer-events-none transition-all"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:pointer-events-none transition-all"
                >
                  Próximo
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-gray-400">
                    Mostrando página <span className="font-semibold text-white">{page}</span> de{" "}
                    <span className="font-semibold text-white">{totalPages}</span> ({totalItems} comentários no total)
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-xl gap-1.5" aria-label="Pagination">
                    <button
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center rounded-xl border border-white/10 bg-[#0f0f18]/60 p-2 text-xs font-medium text-gray-400 hover:bg-purple-600 hover:text-white disabled:opacity-50 disabled:pointer-events-none transition-all"
                    >
                      <span className="sr-only">Anterior</span>
                      &larr;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`relative inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                          p === page
                            ? "z-10 bg-purple-600 text-white"
                            : "text-gray-400 border border-white/10 bg-[#0f0f18]/60 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={page === totalPages}
                      className="relative inline-flex items-center rounded-xl border border-white/10 bg-[#0f0f18]/60 p-2 text-xs font-medium text-gray-400 hover:bg-purple-600 hover:text-white disabled:opacity-50 disabled:pointer-events-none transition-all"
                    >
                      <span className="sr-only">Próximo</span>
                      &rarr;
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
