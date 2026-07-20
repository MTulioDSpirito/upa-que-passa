"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, AlertCircle, ExternalLink } from "lucide-react";
import { YoutubeVideo } from "@/lib/types";
import YoutubeFormModal from "./YoutubeFormModal";
import { useToast } from "@/components/ui/Toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function YoutubeTab() {
  const { toast } = useToast();
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<YoutubeVideo | null>(null);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/youtube");
      if (!res.ok) {
        throw new Error("Erro ao carregar vídeos do Youtube.");
      }
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (err: any) {
      setError(err.message || "Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleOpenNewModal = () => {
    setEditingVideo(null);
    setIsModalOpen(true);
  };

  const handleStartEdit = (video: YoutubeVideo) => {
    setEditingVideo(video);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este vídeo do Youtube?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/youtube?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erro ao deletar vídeo.");
      }
      setVideos((prev) => prev.filter((v) => v.id !== id));
      toast.success("Sucesso", "Vídeo excluído com sucesso!");
    } catch (err: any) {
      toast.error("Erro", err.message || "Erro de conexão ao excluir.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleModalSubmit = async (payload: any) => {
    setActionLoading(true);
    try {
      const method = editingVideo ? "PUT" : "POST";
      const body = editingVideo ? { id: editingVideo.id, ...payload } : payload;

      const res = await fetch("/api/admin/youtube", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erro ao salvar vídeo.");
      }

      const data = await res.json();

      if (editingVideo) {
        setVideos((prev) =>
          prev.map((v) => (v.id === editingVideo.id ? data.video : v))
        );
        toast.success("Sucesso", "Vídeo atualizado com sucesso!");
      } else {
        setVideos((prev) => [data.video, ...prev]);
        toast.success("Sucesso", "Vídeo cadastrado com sucesso!");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error("Erro", err.message || "Erro ao salvar vídeo.");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight font-mono uppercase">
            Vídeos do Youtube
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Gerencie os vídeos do Youtube em exibição na Home.
          </p>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/20"
        >
          <Plus className="w-4 h-4" /> Adicionar Vídeo
        </button>
      </div>

      {/* Warning Alert */}
      <div className="flex items-start gap-3 bg-red-950/20 border border-red-500/20 p-4 rounded-2xl">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-white font-mono uppercase">Importante</h4>
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
            Apenas os <strong>3 vídeos mais recentes</strong> cadastrados no painel serão exibidos na página inicial pública (Home).
          </p>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingSpinner size="md" label="Carregando vídeos..." />
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-red-950/10 border border-red-500/10 rounded-2xl text-red-400 font-mono text-sm">
          {error}
        </div>
      ) : videos.length === 0 ? (
        <div className="p-12 text-center bg-white/5 border border-white/10 rounded-2xl text-gray-500 font-mono text-sm">
          Nenhum vídeo cadastrado no momento. Clique em "Adicionar Vídeo" para começar.
        </div>
      ) : (
        /* Video List/Grid */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, idx) => {
            const isDisplayed = idx < 3;
            return (
              <div
                key={video.id}
                className={`relative group bg-[#0f0f18] border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                  isDisplayed
                    ? "border-red-500/30 hover:border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.05)]"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                {/* Visual Status Indicator */}
                {isDisplayed && (
                  <div className="absolute top-3 left-3 z-10 bg-red-600/90 text-white font-mono font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
                    Exibido na Home
                  </div>
                )}

                {/* Video Info Wrapper */}
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-black/50 overflow-hidden border-b border-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute bottom-3 right-3 text-[10px] bg-black/85 backdrop-blur-md px-2 py-0.5 rounded font-bold font-mono text-white border border-white/10">
                      {video.duration}
                    </div>
                    <div className="absolute top-3 right-3 text-[9px] bg-black/75 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 font-bold font-mono text-gray-300">
                      {video.resolution}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-gray-200 group-hover:text-red-400 transition-colors duration-300 leading-snug line-clamp-2 text-sm font-mono">
                      {video.title}
                    </h3>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="px-5 py-4 border-t border-white/5 bg-[#0a0a10] flex items-center justify-between">
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-white font-mono font-bold transition-colors"
                  >
                    Assistir <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEdit(video)}
                      disabled={actionLoading}
                      className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                      title="Editar vídeo"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => video.id && handleDelete(video.id)}
                      disabled={actionLoading}
                      className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
                      title="Excluir vídeo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit/Create Form Modal */}
      <YoutubeFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        video={editingVideo}
        actionLoading={actionLoading}
      />
    </div>
  );
}
