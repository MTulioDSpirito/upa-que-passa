import React, { useState, useMemo, useEffect } from "react";
import { X, Loader2, Upload, Check, Search, Sparkles } from "lucide-react";
import { type Sugestao } from "../SugestoesClient";
import { slugify } from "../SugestoesClient";
import { type Game } from "@/lib/types";

interface SugestaoFormProps {
  sugestao: Sugestao;
  cancelEdit: () => void;
  handleAprovar: (id: string) => void;
  busy: string | null;
  getSugestaoTipoLabel: (tipo: string) => string;
  uploadingImage: boolean;
  uploadError: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;

  editTitulo: string;
  setEditTitulo: (val: string) => void;
  editSlug: string;
  setEditSlug: (val: string) => void;
  editCover: string;
  setEditCover: (val: string) => void;
  editImageCredits: string;
  setEditImageCredits: (val: string) => void;
  editFontes: string;
  setEditFontes: (val: string) => void;
  editExcerpt: string;
  setEditExcerpt: (val: string) => void;
  editBody: string;
  setEditBody: (val: string) => void;
  editOverallScore: number;
  setEditOverallScore: (val: number) => void;
  editDeveloper: string;
  setEditDeveloper: (val: string) => void;
  editReleaseDate: string;
  setEditReleaseDate: (val: string) => void;
  editPrice: number;
  setEditPrice: (val: number) => void;
  editPlatforms: string;
  setEditPlatforms: (val: string) => void;
  editGenres: string;
  setEditGenres: (val: string) => void;
  editPros: string;
  setEditPros: (val: string) => void;
  editCons: string;
  setEditCons: (val: string) => void;
  editBuyLink: string;
  setEditBuyLink: (val: string) => void;

  allGames: Game[];
  editGameId: string;
  setEditGameId: (val: string) => void;
  editCategory: string;
  setEditCategory: (val: string) => void;
  editTags: string;
  setEditTags: (val: string) => void;
}

export default function SugestaoForm({
  sugestao,
  cancelEdit,
  handleAprovar,
  busy,
  getSugestaoTipoLabel,
  uploadingImage,
  uploadError,
  handleImageUpload,
  editTitulo,
  setEditTitulo,
  editSlug,
  setEditSlug,
  editCover,
  setEditCover,
  editImageCredits,
  setEditImageCredits,
  editFontes,
  setEditFontes,
  editExcerpt,
  setEditExcerpt,
  editBody,
  setEditBody,
  editOverallScore,
  setEditOverallScore,
  editDeveloper,
  setEditDeveloper,
  editReleaseDate,
  setEditReleaseDate,
  editPrice,
  setEditPrice,
  editPlatforms,
  setEditPlatforms,
  editGenres,
  setEditGenres,
  editPros,
  setEditPros,
  editCons,
  setEditCons,
  editBuyLink,
  setEditBuyLink,

  allGames,
  editGameId,
  setEditGameId,
  editCategory,
  setEditCategory,
  editTags,
  setEditTags,
}: SugestaoFormProps) {
  const [gameSearch, setGameSearch] = useState("");
  const [showGameDropdown, setShowGameDropdown] = useState(false);

  const selectedGame = useMemo(() => {
    return allGames.find((g) => g.id === editGameId);
  }, [allGames, editGameId]);

  useEffect(() => {
    if (selectedGame) {
      setGameSearch(selectedGame.title);
    } else {
      setGameSearch("");
    }
  }, [selectedGame]);

  const filteredGames = useMemo(() => {
    if (!gameSearch) return allGames.slice(0, 10);
    const query = gameSearch.toLowerCase();
    return allGames.filter(
      (g) =>
        g.title.toLowerCase().includes(query) ||
        g.slug.toLowerCase().includes(query)
    );
  }, [allGames, gameSearch]);

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
    setEditTitulo(g.title);
    setEditSlug(slugify(g.title));
    setEditCover(g.cover);
    setEditReleaseDate(g.releaseDate || "");
    setEditPlatforms(g.platforms?.join(", ") || "");
    setEditGenres(g.genres?.join(", ") || "");
    setShowExternalDropdown(false);
    
    setExternalSearchLoading(true);
    try {
      const res = await fetch(`/api/admin/games/external-search?id=${g.id}`);
      if (res.ok) {
        const data = await res.json();
        setEditDeveloper(data.developer || "Independente");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExternalSearchLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-white/5">
        <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-3 py-1">
          Editando Rascunho ({getSugestaoTipoLabel(sugestao.tipo)})
        </span>
        <button
          onClick={cancelEdit}
          className="text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1">TÍTULO</label>
          <input
            type="text"
            value={editTitulo}
            onChange={(e) => {
              const val = e.target.value;
              setEditTitulo(val);
              setEditSlug(slugify(val));
            }}
            className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1">SLUG (GERADO AUTOMATICAMENTE)</label>
          <input
            type="text"
            disabled
            value={editSlug}
            className="w-full bg-white/5 border border-white/10 text-gray-500 rounded-xl px-3 py-2 text-sm cursor-not-allowed opacity-60 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1 flex items-center justify-between">
            <span>IMAGEM DE CAPA</span>
            <span className="text-[10px] text-gray-500 font-normal">Máx. 2MB</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Insira a URL ou faça o upload..."
              value={editCover}
              onChange={(e) => setEditCover(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
            />
            <label className="btn-press cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all flex-shrink-0">
              {uploadingImage ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>{uploadingImage ? "Enviando..." : "Upload"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          </div>
          {uploadError && (
            <p className="text-red-400 text-[10px] mt-1 font-semibold">{uploadError}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1">CRÉDITOS DA IMAGEM</label>
          <input
            type="text"
            placeholder="Ex: Foto: Sony / Divulgação"
            value={editImageCredits}
            onChange={(e) => setEditImageCredits(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1">FONTES (UMA POR LINHA)</label>
        <textarea
          rows={2}
          value={editFontes}
          onChange={(e) => setEditFontes(e.target.value)}
          className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500 font-mono"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1">RESUMO / EXCERPT</label>
        <textarea
          rows={2}
          value={editExcerpt}
          onChange={(e) => setEditExcerpt(e.target.value)}
          className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
        />
      </div>

      {sugestao.tipo === "NOTICIA" && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">CATEGORIA</label>
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
            >
              {["Notícias", "Lançamentos", "Hardware", "Artigos", "Eventos", "Outros"].map((cat) => (
                <option key={cat} value={cat} className="bg-[#0f0f18] text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">TAGS (SEPARADAS POR VÍRGULA)</label>
            <input
              type="text"
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
              placeholder="PS5, Sony, Lançamentos"
              className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      )}

      {(sugestao.tipo === "NOTICIA" || sugestao.tipo === "REVIEW") && (
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1">CONTEÚDO DO TEXTO (CORPO)</label>
          <textarea
            rows={8}
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
          />
        </div>
      )}

      {sugestao.tipo === "REVIEW" && (
        <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/5 animate-fade-in">
          {/* Autocomplete Selection of Associated Game */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" /> Vincular a um Jogo do Catálogo
            </label>
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Pesquise o jogo no catálogo para preencher os dados..."
                  value={gameSearch}
                  onChange={(e) => {
                    setGameSearch(e.target.value);
                    setShowGameDropdown(true);
                  }}
                  onFocus={() => setShowGameDropdown(true)}
                  className="w-full bg-[#181824] border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              {!editGameId && (
                <button
                  type="button"
                  onClick={() => {
                    setShowGameDropdown(false);
                    handleExternalSearch();
                  }}
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
              {editGameId && (
                <button
                  type="button"
                  onClick={() => {
                    const original = sugestao.payload?.gameDetails;
                    setEditGameId("");
                    setGameSearch("");
                    setEditDeveloper(original?.developer || "");
                    setEditReleaseDate(original?.releaseDate || "");
                    setEditPrice(original?.price || 0);
                    setEditPlatforms(Array.isArray(original?.platforms) ? original.platforms.join(", ") : "");
                    setEditGenres(Array.isArray(original?.genres) ? original.genres.join(", ") : "");
                  }}
                  className="px-3 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/20 rounded-xl text-xs font-bold transition-all"
                >
                  Desvincular
                </button>
              )}
            </div>
            {showExternalDropdown && (
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
            {showGameDropdown && (
              <div className="absolute z-20 left-0 right-0 mt-1 bg-[#181824] border border-white/10 rounded-xl overflow-hidden shadow-xl max-h-60 overflow-y-auto font-sans">
                {filteredGames.length > 0 ? (
                  filteredGames.map((game) => (
                    <button
                      key={game.id}
                      type="button"
                      onClick={() => {
                        setEditGameId(game.id);
                        setGameSearch(game.title);
                        setShowGameDropdown(false);

                        // Auto-fill all official details
                        setEditDeveloper(game.developer);
                        setEditReleaseDate(game.releaseDate);
                        setEditPrice(game.suggestedPrice || 0);
                        setEditPlatforms(game.platforms.join(", "));
                        setEditGenres(game.genres.join(", "));
                        if (game.cover) setEditCover(game.cover);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-white/5 transition-colors ${
                        editGameId === game.id ? "bg-purple-900/30 text-purple-400 font-semibold" : "text-gray-300"
                      }`}
                    >
                      <img src={game.cover} alt="" className="w-6 h-8 object-cover rounded" />
                      <div>
                        <p className="line-clamp-1 font-semibold">{game.title}</p>
                        <p className="text-[10px] text-gray-500">{game.developer}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="p-3 text-xs text-gray-500 text-center">Nenhum jogo encontrado no catálogo.</p>
                )}
              </div>
            )}
          </div>

          {editGameId ? (
            <div className="bg-purple-950/10 border border-purple-500/20 px-3 py-2 rounded-xl text-xs text-purple-400 flex items-center gap-2">
              <Check className="w-4 h-4 text-purple-400" />
              <span>Vinculado ao jogo do catálogo. Os campos abaixo foram preenchidos, mas você ainda pode editá-los se necessário.</span>
            </div>
          ) : (
            <div className="bg-yellow-500/5 border border-yellow-500/10 px-3 py-2 rounded-xl text-xs text-yellow-500/80 flex items-center gap-2">
              <span className="text-sm">ℹ</span>
              <span>Jogo não cadastrado. Os dados abaixo vieram da sugestão da IA. Preencha ou corrija os campos vazios.</span>
            </div>
          )}

          {/* Official details are displayed as EDITABLE inputs, prefilled automatically */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-white/5">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">DESENVOLVEDORA</label>
              <input
                type="text"
                value={editDeveloper}
                onChange={(e) => setEditDeveloper(e.target.value)}
                className="w-full bg-[#181824] border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">LANÇAMENTO</label>
              <input
                type="text"
                placeholder="YYYY-MM-DD"
                value={editReleaseDate}
                onChange={(e) => setEditReleaseDate(e.target.value)}
                className="w-full bg-[#181824] border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">PREÇO SUGERIDO (R$)</label>
              <input
                type="number"
                step="0.01"
                value={editPrice}
                onChange={(e) => setEditPrice(Number(e.target.value))}
                className="w-full bg-[#181824] border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">NOTA GERAL DA EQUIPE *</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                required
                value={editOverallScore}
                onChange={(e) => setEditOverallScore(Number(e.target.value))}
                className="w-full bg-[#181824] border border-white/10 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">PLATAFORMAS (VIRGULAS)</label>
              <input
                type="text"
                value={editPlatforms}
                onChange={(e) => setEditPlatforms(e.target.value)}
                className="w-full bg-[#181824] border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">GÊNEROS (VIRGULAS)</label>
              <input
                type="text"
                value={editGenres}
                onChange={(e) => setEditGenres(e.target.value)}
                className="w-full bg-[#181824] border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-green-400 mb-1">PONTOS POSITIVOS (PRÓS) - Um por linha</label>
              <textarea
                rows={3}
                value={editPros}
                onChange={(e) => setEditPros(e.target.value)}
                className="w-full bg-[#181824] border border-green-500/20 focus:border-green-500 text-white rounded-xl px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-red-400 mb-1">PONTOS NEGATIVOS (CONTRAS) - Um por linha</label>
              <textarea
                rows={3}
                value={editCons}
                onChange={(e) => setEditCons(e.target.value)}
                className="w-full bg-[#181824] border border-red-500/20 focus:border-red-500 text-white rounded-xl px-3 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {sugestao.tipo === "LANCAMENTO" && (
        <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">DESENVOLVEDORA</label>
              <input
                type="text"
                value={editDeveloper}
                onChange={(e) => setEditDeveloper(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">DATA DE LANÇAMENTO</label>
              <input
                type="text"
                placeholder="YYYY-MM-DD"
                value={editReleaseDate}
                onChange={(e) => setEditReleaseDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">PREÇO SUGERIDO (R$)</label>
              <input
                type="number"
                step="0.01"
                value={editPrice}
                onChange={(e) => setEditPrice(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 mb-1">LINK DE COMPRA</label>
              <input
                type="text"
                value={editBuyLink}
                onChange={(e) => setEditBuyLink(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">PLATAFORMAS (VIRGULAS)</label>
              <input
                type="text"
                value={editPlatforms}
                onChange={(e) => setEditPlatforms(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">GÊNEROS (VIRGULAS)</label>
            <input
              type="text"
              value={editGenres}
              onChange={(e) => setEditGenres(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      )}

      <div className="flex gap-2 justify-end pt-3">
        <button
          onClick={cancelEdit}
          className="btn-press px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-sm font-semibold rounded-xl transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={() => handleAprovar(sugestao.id)}
          disabled={busy === sugestao.id}
          className="btn-press flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
        >
          <Check className="w-4 h-4" /> Salvar e Aprovar
        </button>
      </div>
    </div>
  );
}
