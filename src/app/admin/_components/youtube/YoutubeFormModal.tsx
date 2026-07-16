import React, { useState, useEffect } from "react";
import { X, Loader2, Image as ImageIcon } from "lucide-react";
import { YoutubeVideo } from "@/lib/types";

interface YoutubeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  video: YoutubeVideo | null;
  actionLoading: boolean;
}

const RESOLUTIONS = ["4K UHD", "4K HDR", "1080P", "720P"];

export default function YoutubeFormModal({
  isOpen,
  onClose,
  onSubmit,
  video,
  actionLoading,
}: YoutubeFormModalProps) {
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [duration, setDuration] = useState("");
  const [resolution, setResolution] = useState("4K UHD");
  const [error, setError] = useState<string | null>(null);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Initialize fields if editing
  useEffect(() => {
    if (video) {
      setTitle(video.title);
      setVideoUrl(video.videoUrl);
      setThumbnail(video.thumbnail);
      setDuration(video.duration);
      setResolution(video.resolution);
    } else {
      setTitle("");
      setVideoUrl("");
      setThumbnail("");
      setDuration("");
      setResolution("4K UHD");
    }
    setError(null);
    setUploadError(null);
  }, [video, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Por favor, selecione uma imagem válida.");
      return;
    }

    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError("A imagem excede o limite de 2MB.");
      return;
    }

    setUploadError(null);
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload?type=youtube", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "Erro ao enviar imagem.");
      }

      const data = await res.json();
      setThumbnail(data.url);
    } catch (err: any) {
      setUploadError(err.message || "Erro de conexão ao enviar imagem.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVideoUrlChange = (val: string) => {
    setVideoUrl(val);

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = val.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;

    if (videoId) {
      setThumbnail(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError("O título é obrigatório.");
    if (!videoUrl.trim()) return setError("O link do vídeo é obrigatório.");
    if (!thumbnail.trim()) return setError("A imagem de capa é obrigatória.");
    if (!duration.trim()) return setError("A duração é obrigatória.");

    // Validate YouTube URL
    try {
      new URL(videoUrl);
    } catch (_) {
      return setError("Insira uma URL válida para o vídeo do Youtube.");
    }

    const payload = {
      title,
      videoUrl,
      thumbnail,
      duration,
      resolution,
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar vídeo.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0f0f18] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white font-mono uppercase tracking-tight">
            {video ? "Editar Vídeo do Youtube" : "Cadastrar Vídeo do Youtube"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-4 text-sm text-red-400 bg-red-950/20 border border-red-500/20 rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
              Título do Vídeo
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#07070c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors placeholder-gray-600 font-mono text-sm"
              placeholder="Ex: God of War Ragnarök Vale a Pena em 2026?"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
              Link do Vídeo (YouTube URL)
            </label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => handleVideoUrlChange(e.target.value)}
              className="w-full bg-[#07070c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors placeholder-gray-600 font-mono text-sm"
              placeholder="Ex: https://www.youtube.com/watch?v=..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
                Duração (MM:SS ou HH:MM:SS)
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-[#07070c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors placeholder-gray-600 font-mono text-sm"
                placeholder="Ex: 18:42"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
                Resolução
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full bg-[#07070c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors font-mono text-sm"
              >
                {RESOLUTIONS.map((res) => (
                  <option key={res} value={res} className="bg-[#0f0f18] text-white">
                    {res}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono block">
              Imagem de Capa (Thumbnail)
            </label>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Image Preview */}
              <div className="w-full sm:w-48 aspect-video bg-[#07070c] border border-white/10 rounded-xl flex items-center justify-center overflow-hidden relative group">
                {thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnail}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-600" />
                )}
              </div>

              {/* Upload controls */}
              <div className="flex-1 w-full space-y-2">
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="w-full bg-[#07070c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors placeholder-gray-600 font-mono text-sm"
                  placeholder="URL da imagem externa ou envie abaixo..."
                />
                
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                    id="youtube-image-upload"
                  />
                  <label
                    htmlFor="youtube-image-upload"
                    className={`inline-flex items-center justify-center px-4 py-2 border border-white/10 hover:border-red-500/50 rounded-xl text-xs font-bold text-gray-300 hover:text-white bg-[#07070c] hover:bg-red-950/10 cursor-pointer transition-all duration-300 font-mono uppercase tracking-wider ${
                      uploadingImage ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar Imagem"
                    )}
                  </label>
                </div>

                {uploadError && (
                  <p className="text-[11px] text-red-400 font-mono">{uploadError}</p>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-[#0a0a10] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-sm font-bold text-gray-300 hover:text-white transition-colors font-mono uppercase tracking-wider"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={actionLoading}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-sm font-bold text-white transition-colors font-mono uppercase tracking-wider flex items-center gap-2"
          >
            {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {video ? "Salvar Alterações" : "Cadastrar Vídeo"}
          </button>
        </div>
      </div>
    </div>
  );
}
