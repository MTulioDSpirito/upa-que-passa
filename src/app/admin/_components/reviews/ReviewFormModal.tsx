"use client";

import React, { useEffect, useState, useMemo } from "react";
import { X, Search, Sparkles, Loader2 } from "lucide-react";
import { Game, Review, ReviewScores } from "@/lib/types";
import { type AdminUserSession } from "../layout/AdminUserFooter";
import { useToast } from "@/components/ui/Toast";

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => Promise<void>;
  allGames: Game[];
  initialReview?: Review | null;
  adminUser: AdminUserSession;
  actionLoading: boolean;
}

const DEFAULT_SCORES: ReviewScores = {
  graphics: 8,
  gameplay: 8,
  fun: 8,
  story: 8,
  soundtrack: 8,
  performance: 8,
  replay: 8,
  multiplayer: 0,
  difficulty: 0,
  visual: 0,
  ai: 0,
  optimization: 0,
  content: 0,
};

export default function ReviewFormModal({
  isOpen,
  onClose,
  onSubmit,
  allGames,
  initialReview,
  adminUser,
  actionLoading,
}: ReviewFormModalProps) {
  const { toast } = useToast();
  const [selectedGameId, setSelectedGameId] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [prosText, setProsText] = useState("");
  const [consText, setConsText] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [scores, setScores] = useState<ReviewScores>({ ...DEFAULT_SCORES });
  const [overallScore, setOverallScore] = useState(8.0);
  const [author, setAuthor] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [imageCredits, setImageCredits] = useState("");
  const [team, setTeam] = useState<Array<{ id: string; name: string }>>([]);

  // New game creation states
  const [isNewGame, setIsNewGame] = useState(false);
  const [newGameCover, setNewGameCover] = useState("");
  const [newGameDeveloper, setNewGameDeveloper] = useState("");
  const [newGameReleaseDate, setNewGameReleaseDate] = useState("");
  const [newGamePrice, setNewGamePrice] = useState(0);
  const [newGamePlatforms, setNewGamePlatforms] = useState("");
  const [newGameGenres, setNewGameGenres] = useState("");
  const [newGameTrailer, setNewGameTrailer] = useState("");
  const [newGameGalleryText, setNewGameGalleryText] = useState("");
  const [newGameDescription, setNewGameDescription] = useState("");
  const [newGameMetacritic, setNewGameMetacritic] = useState<number | string>("");

  // Autocomplete states
  const [gameSearch, setGameSearch] = useState("");
  const [showGameDropdown, setShowGameDropdown] = useState(false);

  // Initialize form on mount or when initialReview/adminUser changes
  useEffect(() => {
    if (initialReview) {
      setSelectedGameId(initialReview.gameId);
      const game = allGames.find((g) => g.id === initialReview.gameId);
      setGameSearch(game ? game.title : "");
      setTitle(initialReview.title);
      setText(initialReview.text);
      setProsText(initialReview.pros.join("\n"));
      setConsText(initialReview.cons.join("\n"));
      setConclusion(initialReview.conclusion);
      setScores({ ...DEFAULT_SCORES, ...initialReview.scores });
      setOverallScore(initialReview.overallScore);
      setAuthor(initialReview.author);
      setPublishedAt(initialReview.publishedAt);
      setImageCredits(initialReview.imageCredits || "");
      
      setIsNewGame(false);
      setNewGameCover(game ? game.cover || "" : "");
      setNewGameDeveloper(game ? game.developer || "" : "");
      setNewGameReleaseDate(game ? game.releaseDate || "" : "");
      setNewGamePrice(game ? game.suggestedPrice || 0 : 0);
      setNewGamePlatforms(game ? game.platforms?.join(", ") || "" : "");
      setNewGameGenres(game ? game.genres?.join(", ") || "" : "");
      setNewGameTrailer(game ? game.trailer || "" : "");
      setNewGameGalleryText(game ? game.gallery?.join(", ") || "" : "");
      setNewGameDescription(game ? game.description || "" : "");
      setNewGameMetacritic(game ? (game.metacriticScore !== null && game.metacriticScore !== undefined ? game.metacriticScore : "") : "");
    } else {
      setSelectedGameId("");
      setGameSearch("");
      setTitle("");
      setText("");
      setProsText("");
      setConsText("");
      setConclusion("");
      setScores({ ...DEFAULT_SCORES });
      setOverallScore(8.0);
      setAuthor(adminUser.name || "");
      setPublishedAt(new Date().toISOString().split("T")[0]);
      setImageCredits("");

      setIsNewGame(false);
      setNewGameCover("");
      setNewGameDeveloper("");
      setNewGameReleaseDate(new Date().toISOString().split("T")[0]);
      setNewGamePrice(0);
      setNewGamePlatforms("PS5");
      setNewGameGenres("");
      setNewGameTrailer("");
      setNewGameGalleryText("");
      setNewGameDescription("");
      setNewGameMetacritic("");
    }
  }, [initialReview, adminUser, allGames, isOpen]);

  // Fetch team members when modal opens
  useEffect(() => {
    if (isOpen) {
      fetch("/api/admin/team")
        .then((res) => res.json())
        .then((data) => {
          if (data.team) {
            setTeam(data.team);
          }
        })
        .catch((err) => console.error("Erro ao carregar equipe:", err));
    }
  }, [isOpen]);

  // External search states
  const [externalSearchLoading, setExternalSearchLoading] = useState(false);
  const [externalGames, setExternalGames] = useState<any[]>([]);
  const [showExternalDropdown, setShowExternalDropdown] = useState(false);

  const handleExternalSearch = async () => {
    if (!gameSearch.trim()) return;
    setExternalSearchLoading(true);
    try {
      const res = await fetch(`/api/admin/games/external-search?query=${encodeURIComponent(gameSearch)}`);
      if (res.ok) {
        const data = await res.json();
        setExternalGames(data.games || []);
        setShowExternalDropdown(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExternalSearchLoading(false);
    }
  };

  const selectExternalGame = async (g: any) => {
    setGameSearch(g.title);
    setNewGameCover(g.cover);
    setNewGameReleaseDate(g.releaseDate || "");
    setNewGamePlatforms(g.platforms?.join(", ") || "");
    setNewGameGenres(g.genres?.join(", ") || "");
    setShowExternalDropdown(false);
    
    setExternalSearchLoading(true);
    try {
      const res = await fetch(`/api/admin/games/external-search?id=${g.id}`);
      if (res.ok) {
        const data = await res.json();
        setNewGameDeveloper(data.developer || "Independente");
        setNewGameDescription(data.description || "");
        setNewGameMetacritic(data.metacriticScore !== null && data.metacriticScore !== undefined ? data.metacriticScore : "");
        if (Array.isArray(data.gallery)) {
          setNewGameGalleryText(data.gallery.join(", "));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExternalSearchLoading(false);
    }
  };

  // Filtered games for autocomplete selection
  const filteredGames = useMemo(() => {
    if (!gameSearch) return allGames.slice(0, 10);
    const query = gameSearch.toLowerCase();
    return allGames.filter(
      (g) =>
        g.title.toLowerCase().includes(query) ||
        g.slug.toLowerCase().includes(query)
    );
  }, [allGames, gameSearch]);

  const selectedGame = useMemo(() => {
    return allGames.find((g) => g.id === selectedGameId);
  }, [allGames, selectedGameId]);

  // Calculate average of active scores
  const calculatedAverage = useMemo(() => {
    const activeScores = Object.entries(scores).filter(
      ([key, val]) => !(key === "multiplayer" && val === 0)
    );
    if (activeScores.length === 0) return 0;
    const sum = activeScores.reduce((acc, [_, val]) => acc + val, 0);
    return Math.round((sum / activeScores.length) * 10) / 10;
  }, [scores]);

  const handleScoreChange = (key: keyof ReviewScores, val: number) => {
    const newScores = { ...scores, [key]: val };
    setScores(newScores);
    const activeScores = Object.entries(newScores).filter(
      ([k, v]) => !(k === "multiplayer" && v === 0)
    );
    if (activeScores.length > 0) {
      const sum = activeScores.reduce((acc, [_, v]) => acc + v, 0);
      const avg = Math.round((sum / activeScores.length) * 10) / 10;
      setOverallScore(avg);
    }
  };

  const getYoutubeEmbedUrl = (url: string): string => {
    if (!url) return "";
    if (url.includes("embed/")) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNewGame && !selectedGameId) {
      toast.warning("Aviso", "Selecione o jogo correspondente.");
      return;
    }
    if (isNewGame && !gameSearch.trim()) {
      toast.warning("Aviso", "Digite o título do novo jogo.");
      return;
    }

    const payload = {
      isNewGame,
      newGameDetails: isNewGame ? {
        title: gameSearch.trim(),
        cover: newGameCover.trim() || "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800",
        developer: newGameDeveloper.trim() || "Independente",
        releaseDate: newGameReleaseDate.trim() || new Date().toISOString().split("T")[0],
        price: Number(newGamePrice) || 0,
        platforms: newGamePlatforms.split(",").map((p) => p.trim()).filter(Boolean),
        genres: newGameGenres.split(",").map((g) => g.trim()).filter(Boolean),
        trailer: getYoutubeEmbedUrl(newGameTrailer.trim()),
        gallery: newGameGalleryText.split(",").map((img) => img.trim()).filter(Boolean),
        description: newGameDescription.trim(),
        metacriticScore: newGameMetacritic !== "" ? Number(newGameMetacritic) : null,
      } : null,
      gameId: selectedGameId,
      title,
      text,
      pros: prosText.split("\n").map((p) => p.trim()).filter(Boolean),
      cons: consText.split("\n").map((c) => c.trim()).filter(Boolean),
      conclusion,
      scores,
      overallScore: Number(overallScore),
      author,
      publishedAt,
      imageCredits: imageCredits || undefined,
    };

    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 bg-[#0f0f18] border border-white/10 w-full max-w-3xl h-full max-h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              {initialReview ? "Editar Review" : "Nova Review"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Preencha todos os campos para publicar a análise</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Game Selection */}
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                  {isNewGame ? "Título do Novo Jogo *" : "Jogo Associado *"}
                </label>
                {initialReview ? (
                  <label className="flex items-center gap-1 text-xs text-purple-400 font-bold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isNewGame}
                      onChange={(e) => {
                        setIsNewGame(e.target.checked);
                      }}
                      className="rounded border-white/10 bg-white/5 text-purple-600 focus:ring-purple-500"
                    />
                    <span>Editar dados do jogo?</span>
                  </label>
                ) : (
                  <label className="flex items-center gap-1 text-xs text-purple-400 font-bold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isNewGame}
                      onChange={(e) => {
                        setIsNewGame(e.target.checked);
                        setSelectedGameId("");
                        setGameSearch("");
                      }}
                      className="rounded border-white/10 bg-white/5 text-purple-600 focus:ring-purple-500"
                    />
                    <span>Novo Jogo?</span>
                  </label>
                )}
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    disabled={!!initialReview}
                    placeholder={isNewGame ? "Digite o nome do novo jogo..." : "Pesquise o jogo no catálogo..."}
                    value={gameSearch}
                    onChange={(e) => {
                      setGameSearch(e.target.value);
                      if (!isNewGame) setShowGameDropdown(true);
                    }}
                    onFocus={() => {
                      if (!isNewGame) setShowGameDropdown(true);
                    }}
                    className="w-full bg-[#181824] border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-60"
                  />
                </div>
                {isNewGame && (
                  <button
                    type="button"
                    onClick={handleExternalSearch}
                    disabled={externalSearchLoading}
                    className="btn-press cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all flex-shrink-0 disabled:opacity-50"
                  >
                    {externalSearchLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    <span>{externalSearchLoading ? "Buscando..." : "Buscar API"}</span>
                  </button>
                )}
              </div>
              {isNewGame && showExternalDropdown && (
                <div className="absolute z-20 left-0 right-0 mt-1 bg-[#181824] border border-white/10 rounded-xl overflow-hidden shadow-xl max-h-60 overflow-y-auto">
                  {externalGames.length > 0 ? (
                    externalGames.map((game) => (
                      <button
                        key={game.id}
                        type="button"
                        onClick={() => selectExternalGame(game)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-white/5 transition-colors text-gray-300"
                      >
                        <img src={game.cover} alt="" className="w-6 h-8 object-cover rounded" />
                        <div>
                          <p className="line-clamp-1 font-semibold">{game.title}</p>
                          <p className="text-[10px] text-gray-500">{game.releaseDate || "Sem data"}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="p-3 text-xs text-gray-500 text-center">Nenhum jogo encontrado na API externa.</p>
                  )}
                </div>
              )}
              {!isNewGame && showGameDropdown && (
                <div className="absolute z-10 left-0 right-0 mt-1 bg-[#181824] border border-white/10 rounded-xl overflow-hidden shadow-xl max-h-60 overflow-y-auto">
                  {filteredGames.length > 0 ? (
                    filteredGames.map((game) => (
                      <button
                        key={game.id}
                        type="button"
                        onClick={() => {
                          setSelectedGameId(game.id);
                          setGameSearch(game.title);
                          setShowGameDropdown(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-white/5 transition-colors ${
                          selectedGameId === game.id ? "bg-purple-900/30 text-purple-400 font-semibold" : "text-gray-300"
                        }`}
                      >
                        <img src={game.cover} alt="" className="w-6 h-8 object-cover rounded" />
                        <div>
                          <p className="line-clamp-1">{game.title}</p>
                          <p className="text-[10px] text-gray-500">{game.developer}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="p-3 text-xs text-gray-500 text-center">Nenhum jogo encontrado.</p>
                  )}
                </div>
              )}
              {!isNewGame && selectedGame && (
                <div className="mt-2 flex items-center gap-2 text-xs text-purple-400 bg-purple-950/20 border border-purple-900/30 p-2 rounded-lg">
                  <img src={selectedGame.cover} alt="" className="w-5 h-7 object-cover rounded" />
                  <span>Jogo selecionado: <strong>{selectedGame.title}</strong> ({selectedGame.developer})</span>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Título da Análise *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Análise Completa: God of War Ragnarok"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#181824] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* New Game official details fields */}
          {isNewGame && (
            <div className="space-y-4 bg-purple-950/10 border border-purple-500/20 p-4 rounded-2xl animate-fade-in">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 pb-2 border-b border-purple-500/20">
                Informações Oficiais do Novo Jogo
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">URL DA CAPA DO JOGO *</label>
                  <input
                    type="text"
                    required
                    placeholder="https://exemplo.com/capa.jpg"
                    value={newGameCover}
                    onChange={(e) => setNewGameCover(e.target.value)}
                    className="w-full bg-[#181824] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">DESENVOLVEDORA *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Santa Monica Studio"
                    value={newGameDeveloper}
                    onChange={(e) => setNewGameDeveloper(e.target.value)}
                    className="w-full bg-[#181824] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">LANÇAMENTO *</label>
                  <input
                    type="text"
                    required
                    placeholder="YYYY-MM-DD"
                    value={newGameReleaseDate}
                    onChange={(e) => setNewGameReleaseDate(e.target.value)}
                    className="w-full bg-[#181824] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">PREÇO SUGERIDO (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newGamePrice}
                    onChange={(e) => setNewGamePrice(Number(e.target.value))}
                    className="w-full bg-[#181824] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">PLATAFORMAS (VIRGULAS)</label>
                  <input
                    type="text"
                    placeholder="Ex: PS5, PS4, PC"
                    value={newGamePlatforms}
                    onChange={(e) => setNewGamePlatforms(e.target.value)}
                    className="w-full bg-[#181824] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">GÊNEROS (VIRGULAS)</label>
                  <input
                    type="text"
                    placeholder="Ex: Ação, Aventura, RPG"
                    value={newGameGenres}
                    onChange={(e) => setNewGameGenres(e.target.value)}
                    className="w-full bg-[#181824] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">LINK DO TRAILER (YOUTUBE)</label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={newGameTrailer}
                    onChange={(e) => setNewGameTrailer(e.target.value)}
                    className="w-full bg-[#181824] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">NOTA METACRITIC</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Ex: 94"
                    value={newGameMetacritic}
                    onChange={(e) => setNewGameMetacritic(e.target.value)}
                    className="w-full bg-[#181824] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">GALERIA (URLS SEPARADAS POR VÍRGULA)</label>
                <textarea
                  placeholder="https://imagem1.jpg, https://imagem2.jpg..."
                  value={newGameGalleryText}
                  onChange={(e) => setNewGameGalleryText(e.target.value)}
                  className="w-full bg-[#181824] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors h-20 resize-y"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">DESCRIÇÃO DO JOGO</label>
                <textarea
                  placeholder="Sinopse ou descrição do jogo..."
                  value={newGameDescription}
                  onChange={(e) => setNewGameDescription(e.target.value)}
                  className="w-full bg-[#181824] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors h-28 resize-y"
                />
              </div>
            </div>
          )}

          {/* Text */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Texto Principal da Análise *
            </label>
            <textarea
              required
              rows={6}
              placeholder="Escreva a análise detalhada aqui..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-[#181824] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-y"
            />
          </div>

          {/* Pros and Cons */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-green-400 mb-2">
                Pontos Positivos (Prós) - Um por linha
              </label>
              <textarea
                rows={4}
                placeholder="Gráficos espetaculares&#10;História emocionante"
                value={prosText}
                onChange={(e) => setProsText(e.target.value)}
                className="w-full bg-[#181824] border border-green-500/20 focus:border-green-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors resize-y"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-red-400 mb-2">
                Pontos Negativos (Contras) - Um por linha
              </label>
              <textarea
                rows={4}
                placeholder="Bugs eventuais&#10;Ritmo arrastado no início"
                value={consText}
                onChange={(e) => setConsText(e.target.value)}
                className="w-full bg-[#181824] border border-red-500/20 focus:border-red-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors resize-y"
              />
            </div>
          </div>

          {/* Conclusion */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Conclusão *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Escreva o veredito final..."
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              className="w-full bg-[#181824] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-y"
            />
          </div>

          {/* Sub-scores Section */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 border-b border-white/5 pb-2">
              Notas de Componentes (0 a 10)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.keys(scores).map((k) => {
                const key = k as keyof ReviewScores;
                return (
                  <div key={key} className="bg-[#181824] p-3 border border-white/5 rounded-xl flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold capitalize text-gray-400">
                        {key === "ai" ? "IA" : key}
                      </span>
                      <span className="text-xs font-black text-purple-400 bg-purple-900/20 px-1.5 py-0.5 rounded">
                        {scores[key]}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={scores[key]}
                      onChange={(e) => handleScoreChange(key, Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Metadata Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Nota Geral
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={overallScore}
                  onChange={(e) => setOverallScore(Number(e.target.value))}
                  className="w-full bg-[#181824] border border-white/5 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setOverallScore(calculatedAverage)}
                  title="Calcular média automática"
                  className="px-2 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/20 rounded-xl hover:bg-purple-600/30 text-xs font-bold"
                >
                  Média
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Autor *
              </label>
              {adminUser.role === "DEVELOPER" ? (
                <select
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-[#181824] border border-white/5 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">Selecione o autor</option>
                  {team.map((member) => (
                    <option key={member.id} value={member.name}>
                      {member.name}
                    </option>
                  ))}
                  {author && !team.some((m) => m.name === author) && (
                    <option value={author}>{author}</option>
                  )}
                </select>
              ) : (
                <input
                  type="text"
                  disabled
                  value={author}
                  className="w-full bg-[#181824] border border-white/5 rounded-xl px-3 py-2 text-sm text-white opacity-60 cursor-not-allowed focus:outline-none"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Publicado em *
              </label>
              <input
                type="date"
                required
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full bg-[#181824] border border-white/5 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Créditos da Imagem
              </label>
              <input
                type="text"
                placeholder="Ex: Steam/Sony"
                value={imageCredits}
                onChange={(e) => setImageCredits(e.target.value)}
                className="w-full bg-[#181824] border border-white/5 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Actions Footer */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={actionLoading}
              className="px-4 py-2 border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl text-sm font-semibold transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-900/20 disabled:opacity-50 transition-all"
            >
              {actionLoading ? "Salvando..." : "Salvar Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
