import React, { useState, useEffect } from "react";
import { X, Loader2, Image as ImageIcon } from "lucide-react";
import { Game } from "@/lib/types";

interface LancamentoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  game: Game | null;
  actionLoading: boolean;
}

const AVAILABLE_PLATFORMS = [
  "PS5",
  "PS4",
  "Xbox Series X|S",
  "Xbox One",
  "PC",
  "Nintendo Switch",
  "Switch 2",
  "iOS",
  "Android"
];

const AVAILABLE_GENRES = [
  "Ação",
  "Aventura",
  "RPG",
  "Terror",
  "Tiro em Primeira Pessoa",
  "Mundo Aberto",
  "Esporte",
  "Corrida",
  "Estratégia",
  "Simulador",
  "Luta"
];

export default function LancamentoFormModal({
  isOpen,
  onClose,
  onSubmit,
  game,
  actionLoading,
}: LancamentoFormModalProps) {
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("");
  const [developer, setDeveloper] = useState("");
  const [publisher, setPublisher] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [suggestedPrice, setSuggestedPrice] = useState(0);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [trailer, setTrailer] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [description, setDescription] = useState("");
  const [metacriticScore, setMetacriticScore] = useState<number | "">("");
  
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Initialize fields if editing
  useEffect(() => {
    if (game) {
      setTitle(game.title);
      setCover(game.cover);
      setDeveloper(game.developer);
      setPublisher(game.publisher || "");
      setReleaseDate(game.releaseDate);
      setSuggestedPrice(game.suggestedPrice || 0);
      setPlatforms(game.platforms || []);
      setGenres(game.genres || []);
      setTrailer(game.trailer || "");
      setSynopsis(game.synopsis || "");
      setDescription(game.description || "");
      setMetacriticScore(game.metacriticScore || "");
    } else {
      setTitle("");
      setCover("");
      setDeveloper("");
      setPublisher("");
      setReleaseDate("");
      setSuggestedPrice(0);
      setPlatforms([]);
      setGenres([]);
      setTrailer("");
      setSynopsis("");
      setDescription("");
      setMetacriticScore("");
    }
    setError(null);
    setUploadError(null);
  }, [game, isOpen]);

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

      const res = await fetch("/api/admin/upload?type=reviews", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "Erro ao enviar imagem.");
      }

      const data = await res.json();
      setCover(data.url);
    } catch (err: any) {
      setUploadError(err.message || "Erro de conexão ao enviar imagem.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleTogglePlatform = (plat: string) => {
    setPlatforms((prev) =>
      prev.includes(plat) ? prev.filter((p) => p !== plat) : [...prev, plat]
    );
  };

  const handleToggleGenre = (genre: string) => {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError("Título é obrigatório.");
    if (!cover.trim()) return setError("Imagem de capa é obrigatória.");
    if (!developer.trim()) return setError("Desenvolvedora é obrigatória.");
    if (!releaseDate) return setError("Data de lançamento é obrigatória.");
    if (platforms.length === 0) return setError("Selecione pelo menos uma plataforma.");
    if (genres.length === 0) return setError("Selecione pelo menos um gênero.");

    try {
      await onSubmit({
        title,
        cover,
        developer,
        publisher: publisher || developer,
        releaseDate,
        suggestedPrice,
        platforms,
        genres,
        trailer,
        synopsis,
        description,
        metacriticScore: metacriticScore === "" ? null : Number(metacriticScore),
      });
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao salvar o lançamento.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0b0b10] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.01]">
          <h2 className="text-xl font-bold text-white">
            {game ? "Editar Lançamento" : "Novo Lançamento / Jogo"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Esquerda: Detalhes do Jogo */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Título do Jogo *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                  placeholder="Ex: GTA VI"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Desenvolvedora *
                  </label>
                  <input
                    type="text"
                    value={developer}
                    onChange={(e) => setDeveloper(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                    placeholder="Ex: Rockstar Games"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Distribuidora
                  </label>
                  <input
                    type="text"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                    placeholder="Ex: Rockstar Games"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Data de Lançamento *
                  </label>
                  <input
                    type="date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Preço Sugerido (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={suggestedPrice}
                    onChange={(e) => setSuggestedPrice(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Link do Trailer (YouTube URL)
                </label>
                <input
                  type="text"
                  value={trailer}
                  onChange={(e) => setTrailer(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Metacritic (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={metacriticScore}
                    onChange={(e) => setMetacriticScore(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                    placeholder="Ex: 95"
                  />
                </div>
              </div>
            </div>

            {/* Direita: Capa & Tags */}
            <div className="space-y-4">
              {/* Capa */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Capa do Jogo *
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={cover}
                    onChange={(e) => setCover(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                    placeholder="URL da Imagem de Capa"
                  />
                  <div className="flex gap-4 items-center">
                    <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors">
                      <ImageIcon className="w-4 h-4" />
                      Fazer Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    {uploadingImage && <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />}
                  </div>
                  {uploadError && <p className="text-red-400 text-xs mt-1">{uploadError}</p>}

                  {cover && (
                    <div className="relative h-28 w-44 rounded-xl overflow-hidden border border-white/10">
                      <img
                        src={cover}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/cover_conteudo_nao_disponivel.png";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Plataformas */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Plataformas *
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_PLATFORMS.map((plat) => {
                    const active = platforms.includes(plat);
                    return (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => handleTogglePlatform(plat)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                          active
                            ? "bg-blue-600/20 text-blue-400 border-blue-500/30"
                            : "bg-white/5 text-gray-400 border-white/5 hover:text-white"
                        }`}
                      >
                        {plat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gêneros */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Gêneros *
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_GENRES.map((genre) => {
                    const active = genres.includes(genre);
                    return (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => handleToggleGenre(genre)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                          active
                            ? "bg-purple-600/20 text-purple-400 border-purple-500/30"
                            : "bg-white/5 text-gray-400 border-white/5 hover:text-white"
                        }`}
                      >
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Sinopse Rápida
              </label>
              <textarea
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                rows={2}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                placeholder="Breve descrição em 1 ou 2 frases..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Descrição Completa
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                placeholder="Texto completo sobre o jogo..."
              />
            </div>
          </div>

          {/* Footer / Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              disabled={actionLoading}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-semibold rounded-xl text-sm transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg hover:shadow-purple-600/20 disabled:opacity-50"
            >
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {game ? "Salvar Alterações" : "Salvar Lançamento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
