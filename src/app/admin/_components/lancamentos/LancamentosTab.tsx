"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, Search, Calendar, Clock, Edit, Trash2, Sparkles, ExternalLink, RefreshCw, AlertCircle } from "lucide-react";
import { Game } from "@/lib/types";
import LancamentoFormModal from "./LancamentoFormModal";
import Link from "next/link";

export default function LancamentosTab() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "upcoming" | "recent">("all");
  
  // Pending Agent suggestions for Launches
  const [pendingLaunchesCount, setPendingLaunchesCount] = useState<number>(0);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/games");
      if (res.ok) {
        const data = await res.json();
        setGames(data.games || []);
      }
    } catch (err) {
      console.error("Erro ao carregar jogos:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingSugestoes = async () => {
    try {
      const res = await fetch("/api/admin/entregas");
      if (res.ok) {
        const data = await res.json();
        const pending = data.pendentes || [];
        const launches = pending.filter((s: any) => s.tipo === "LANCAMENTO");
        setPendingLaunchesCount(launches.length);
      }
    } catch (err) {
      console.error("Erro ao buscar sugestões:", err);
    }
  };

  useEffect(() => {
    fetchGames();
    fetchPendingSugestoes();
  }, []);

  const handleOpenNew = () => {
    setEditingGame(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (game: Game) => {
    setEditingGame(game);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    setActionLoading(true);
    try {
      const method = editingGame ? "PUT" : "POST";
      const url = "/api/admin/games";
      const body = editingGame ? { id: editingGame.id, ...formData } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Ocorreu um erro ao salvar o lançamento.");
      }

      await fetchGames();
      setIsModalOpen(false);
      setEditingGame(null);
    } catch (err: any) {
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/games?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erro ao deletar jogo.");
      }

      setGames((prev) => prev.filter((g) => g.id !== id));
      setDeletingId(null);
    } catch (err: any) {
      console.error("Erro ao deletar lançamento:", err);
      alert(err.message || "Erro ao excluir o lançamento.");
    }
  };

  const filteredGames = useMemo(() => {
    const now = Date.now();
    const recentCutoff = now - 60 * 24 * 60 * 60 * 1000;

    return games
      .filter((game) => {
        // Search filter
        if (search.trim() && !game.title.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }

        // Tab filters
        const releaseTime = new Date(game.releaseDate).getTime();
        if (filterTab === "upcoming") {
          return releaseTime > now;
        } else if (filterTab === "recent") {
          return releaseTime <= now && releaseTime >= recentCutoff;
        }

        return true;
      })
      .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
  }, [games, search, filterTab]);

  return (
    <div className="space-y-6">
      {/* Top Bar / Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Grade de Lançamentos</h1>
          <p className="text-gray-400 text-sm">Organize e gerencie os novos jogos e datas de lançamento públicas.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchGames}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl transition-all"
            title="Atualizar lista"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleOpenNew}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-purple-600/20 text-sm"
          >
            <Plus className="w-4 h-4" /> Novo Lançamento
          </button>
        </div>
      </div>

      {/* Sugestões de Agentes Banner */}
      {pendingLaunchesCount > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-purple-900/10 border border-purple-500/20 rounded-2xl p-4 animate-pulse-slow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/15 rounded-xl">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Novas Sugestões de Lançamento!</h4>
              <p className="text-xs text-gray-400">
                Os agentes encontraram {pendingLaunchesCount} jogo(s) novo(s) que podem entrar no calendário.
              </p>
            </div>
          </div>
          <Link
            href="/admin/sugestoes"
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all self-start sm:self-center"
          >
            Revisar Sugestões <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0f0f18] border border-white/5 p-4 rounded-2xl">
        <div className="flex bg-white/5 p-1 rounded-xl w-full sm:w-auto">
          {(["all", "upcoming", "recent"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize ${
                filterTab === tab
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab === "all" ? "Todos" : tab === "upcoming" ? "Em Breve" : "Recentes"}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar lançamentos..."
            className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-500 text-sm">
          Carregando lançamentos...
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-[#0f0f18]/40 border border-dashed border-white/5 rounded-2xl text-gray-500">
          <Calendar className="w-12 h-12 mb-3 opacity-30" />
          <p className="font-semibold text-white mb-1">Nenhum lançamento encontrado</p>
          <p className="text-xs">Não há jogos cadastrados ou nenhum corresponde aos filtros atuais.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredGames.map((game) => {
            const isUpcoming = new Date(game.releaseDate).getTime() > Date.now();
            const { formattedDate, countdown } = (() => {
              const releaseDateObj = new Date(game.releaseDate + "T12:00:00");
              const formattedDate = releaseDateObj.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });

              const diff = releaseDateObj.getTime() - Date.now();
              const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
              const countdown = isUpcoming
                ? days > 0
                  ? `Faltam ${days} dias`
                  : "Hoje!"
                : "Já lançado";

              return { formattedDate, countdown };
            })();

            const isConfirmingDelete = deletingId === game.id;

            return (
              <div
                key={game.id}
                className="group relative bg-[#0f0f18]/60 border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/30 hover:bg-[#141422] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Cover Preview */}
                <div className="relative h-40 overflow-hidden shrink-0">
                  <img
                    src={game.cover}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/cover_conteudo_nao_disponivel.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f18] via-transparent to-black/40" />

                  {/* Status Badge */}
                  <div
                    className={`absolute top-3 right-3 px-2 py-0.5 rounded-lg text-[10px] font-bold border backdrop-blur-md ${
                      isUpcoming
                        ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                        : "bg-green-500/10 text-green-400 border-green-500/20"
                    }`}
                  >
                    {isUpcoming ? "Em Breve" : "Lançado"}
                  </div>

                  {/* Countdown / Days left Badge */}
                  <div className="absolute bottom-3 left-3 bg-black/60 border border-white/10 rounded-lg px-2 py-0.5 text-[9px] font-mono text-gray-300">
                    {countdown}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-white text-sm group-hover:text-purple-400 transition-colors line-clamp-1 mb-0.5">
                      {game.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">{game.developer}</p>
                  </div>

                  {/* Date & Tags */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      <span>{formattedDate}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {game.platforms.slice(0, 2).map((p) => (
                        <span
                          key={p}
                          className="text-[9px] font-mono bg-blue-900/10 text-blue-400 border border-blue-800/10 px-1.5 py-0.2 rounded"
                        >
                          {p}
                        </span>
                      ))}
                      {game.genres.slice(0, 1).map((g) => (
                        <span
                          key={g}
                          className="text-[9px] font-mono bg-purple-900/10 text-purple-400 border border-purple-800/10 px-1.5 py-0.2 rounded"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="px-4 pb-4 pt-1 border-t border-white/5 bg-white/[0.01] flex justify-between items-center h-12">
                  {isConfirmingDelete ? (
                    <div className="flex items-center justify-between w-full gap-2 animate-fade-in">
                      <span className="text-[10px] font-bold text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Excluir?
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleDelete(game.id)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold rounded-lg transition-colors"
                        >
                          Sim
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          className="px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[10px] font-bold rounded-lg transition-colors"
                        >
                          Não
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="text-xs font-bold text-gray-400">
                        {game.suggestedPrice > 0 ? `R$ ${game.suggestedPrice.toFixed(2)}` : "Grátis / N/A"}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenEdit(game)}
                          className="p-1.5 text-gray-400 hover:text-purple-400 hover:bg-purple-950/20 rounded-lg transition-all"
                          title="Editar lançamento"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(game.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-all"
                          title="Excluir lançamento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      <LancamentoFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        game={editingGame}
        actionLoading={actionLoading}
      />
    </div>
  );
}
