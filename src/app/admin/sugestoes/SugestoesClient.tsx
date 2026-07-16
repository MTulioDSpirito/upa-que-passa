"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, RefreshCw, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import AdminUserFooter, { type AdminUserSession } from "../_components/layout/AdminUserFooter";
import { useAllGames } from "@/hooks/useAllGames";

import FilaRevisao from "./components/FilaRevisao";
import HistoricoSugestoes from "./components/HistoricoSugestoes";
import SugestaoForm from "./components/SugestaoForm";
import SugestaoDetail from "./components/SugestaoDetail";

export interface Sugestao {
  id: string;
  tipo: "NOTICIA" | "REVIEW" | "LANCAMENTO";
  criador: string;
  titulo: string;
  slug: string;
  payload: any;
  fontes: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  motivoRejeicao?: string;
  createdAt: string;
  updatedAt: string;
  revisadoPor?: {
    name: string;
  } | null;
}

export interface EntregasResponse {
  pendentes: Sugestao[];
  aprovados: Sugestao[];
  rejeitados: Sugestao[];
}

export function getSugestaoTipoLabel(tipo: string): string {
  if (tipo === "LANCAMENTO") return "Lançamento";
  if (tipo === "REVIEW") return "Review";
  return "Notícia";
}

export function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}export default function SugestoesClient({ user }: { user: AdminUserSession }) {
  const [allGames] = useAllGames();
  const [data, setData] = useState<EntregasResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [motivo, setMotivo] = useState("");

  // States de Edição
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editFontes, setEditFontes] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editCover, setEditCover] = useState("");
  const [editPros, setEditPros] = useState("");
  const [editCons, setEditCons] = useState("");
  const [editOverallScore, setEditOverallScore] = useState(8.0);
  const [editReleaseDate, setEditReleaseDate] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editPlatforms, setEditPlatforms] = useState("");
  const [editGenres, setEditGenres] = useState("");
  const [editDeveloper, setEditDeveloper] = useState("");
  const [editBuyLink, setEditBuyLink] = useState("");
  const [editImageCredits, setEditImageCredits] = useState("");
  const [editGameId, setEditGameId] = useState("");
  const [editCategory, setEditCategory] = useState("Notícias");
  const [editTags, setEditTags] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (data?.pendentes && data.pendentes.length > 0) {
      const stillPending = data.pendentes.some(s => s.id === selectedId);
      if (!selectedId || !stillPending) {
        setSelectedId(data.pendentes[0].id);
      }
    } else {
      setSelectedId(null);
    }
  }, [data?.pendentes, selectedId]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin-sidebar-collapsed");
    if (saved !== null) {
      setIsSidebarCollapsed(saved === "true");
    }
  }, []);

  const toggleSidebarCollapse = () => {
    const newValue = !isSidebarCollapsed;
    setIsSidebarCollapsed(newValue);
    localStorage.setItem("admin-sidebar-collapsed", String(newValue));
  };

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      setUploadError("Por favor, selecione uma imagem válida.");
      return;
    }

    // Validar tamanho de arquivo: 2MB (2 * 1024 * 1024)
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

      const editingSugestao = data?.pendentes.find((s: any) => s.id === editingId);
      let typeParam = "";
      if (editingSugestao) {
        if (editingSugestao.tipo === "NOTICIA") {
          typeParam = "?type=news";
        } else if (editingSugestao.tipo === "REVIEW") {
          typeParam = "?type=reviews";
        }
      }

      const res = await fetch(`/api/admin/upload${typeParam}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "Erro ao enviar imagem.");
      }

      const uploadRes = await res.json();
      setEditCover(uploadRes.url);
    } catch (err: any) {
      setUploadError(err.message || "Erro de conexão ao enviar imagem.");
    } finally {
      setUploadingImage(false);
    }
  };

  const load = useCallback(() => {
    return fetch("/api/admin/entregas")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function handleRefresh() {
    setLoading(true);
    load();
  }

  function startEdit(sugestao: Sugestao) {
    setEditingId(sugestao.id);
    setEditTitulo(sugestao.titulo);
    setEditSlug(sugestao.slug);
    setEditFontes(sugestao.fontes.join("\n"));
    setEditExcerpt(sugestao.payload?.excerpt || "");
    setEditBody(sugestao.payload?.body || sugestao.payload?.content || "");
    setEditCover(sugestao.payload?.cover || "");
    setEditPros(Array.isArray(sugestao.payload?.pros) ? sugestao.payload.pros.join("\n") : "");
    setEditCons(Array.isArray(sugestao.payload?.cons) ? sugestao.payload.cons.join("\n") : "");
    setEditOverallScore(sugestao.payload?.overallScore || 8.0);
    setEditReleaseDate(sugestao.payload?.releaseDate || sugestao.payload?.gameDetails?.releaseDate || "");
    setEditPrice(sugestao.payload?.price || sugestao.payload?.gameDetails?.price || 0);
    setEditPlatforms(Array.isArray(sugestao.payload?.platforms) ? sugestao.payload.platforms.join(", ") : (Array.isArray(sugestao.payload?.gameDetails?.platforms) ? sugestao.payload.gameDetails.platforms.join(", ") : ""));
    setEditGenres(Array.isArray(sugestao.payload?.genres) ? sugestao.payload.genres.join(", ") : (Array.isArray(sugestao.payload?.gameDetails?.genres) ? sugestao.payload.gameDetails.genres.join(", ") : ""));
    setEditDeveloper(sugestao.payload?.developer || sugestao.payload?.gameDetails?.developer || "");
    setEditBuyLink(sugestao.payload?.buyLink || "");
    setEditImageCredits(sugestao.payload?.imageCredits || "");
    setEditCategory(sugestao.payload?.category || "Notícias");
    setEditTags(Array.isArray(sugestao.payload?.tags) ? sugestao.payload.tags.join(", ") : "");

    const savedGameId = sugestao.payload?.gameId;
    if (savedGameId) {
      setEditGameId(savedGameId);
    } else {
      const matchedGame = allGames.find(g => 
        g.title.toLowerCase() === sugestao.titulo.replace(/ - review$/i, "").toLowerCase() || 
        g.slug === sugestao.slug.replace("-review", "")
      );
      setEditGameId(matchedGame ? matchedGame.id : "");
    }
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function handleAprovar(id: string) {
    setBusy(id);
    const isEditing = id === editingId;
    const body: any = { id };

    if (isEditing) {
      body.titulo = editTitulo;
      body.slug = editSlug;
      body.fontes = editFontes.split("\n").map(f => f.trim()).filter(Boolean);

      const payload: any = {
        cover: editCover,
        excerpt: editExcerpt,
        imageCredits: editImageCredits,
      };

      const original = data?.pendentes.find(s => s.id === id);
      if (original) {
        if (original.tipo === "NOTICIA") {
          payload.body = editBody;
          payload.category = editCategory || "Notícias";
          payload.tags = editTags.split(",").map(t => t.trim()).filter(Boolean);
        } else if (original.tipo === "REVIEW") {
          payload.body = editBody;
          payload.pros = editPros.split("\n").map(p => p.trim()).filter(Boolean);
          payload.cons = editCons.split("\n").map(c => c.trim()).filter(Boolean);
          payload.overallScore = Number(editOverallScore);
          payload.conclusion = original.payload?.conclusion || "Análise concluída pelo portal UQP.";
          payload.gameId = editGameId;
          const selectedGame = allGames.find(g => g.id === editGameId);
          if (selectedGame) {
            payload.gameDetails = {
              developer: selectedGame.developer,
              publisher: selectedGame.publisher || selectedGame.developer || "Independente",
              releaseDate: selectedGame.releaseDate,
              price: selectedGame.suggestedPrice || 0,
              platforms: selectedGame.platforms,
              genres: selectedGame.genres,
            };
          } else {
            payload.gameDetails = {
              developer: editDeveloper,
              publisher: original.payload?.gameDetails?.publisher || editDeveloper || "Independente",
              releaseDate: editReleaseDate,
              price: Number(editPrice),
              platforms: editPlatforms.split(",").map(p => p.trim()).filter(Boolean),
              genres: editGenres.split(",").map(g => g.trim()).filter(Boolean),
            };
          }
        } else if (original.tipo === "LANCAMENTO") {
          payload.developer = editDeveloper;
          payload.releaseDate = editReleaseDate;
          payload.price = Number(editPrice);
          payload.platforms = editPlatforms.split(",").map(p => p.trim()).filter(Boolean);
          payload.genres = editGenres.split(",").map(g => g.trim()).filter(Boolean);
          payload.buyLink = editBuyLink;
        }
      }
      body.payload = payload;
    }

    await fetch("/api/admin/entregas/aprovar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(null);
    setEditingId(null);
    load();
  }

  async function handleRejeitar(id: string) {
    setBusy(id);
    await fetch("/api/admin/entregas/rejeitar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, motivo }),
    });
    setBusy(null);
    setRejectingId(null);
    setMotivo("");
    load();
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={`bg-[#0f0f18] border-r border-white/5 py-6 flex-shrink-0 flex flex-col sticky top-0 h-screen overflow-y-auto transition-[width] duration-300 ease-in-out ${
          isSidebarCollapsed ? "w-16" : "w-56"
        }`}
      >
        <div className={`px-4 mb-6 flex items-center justify-between gap-2 h-6`}>
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2 truncate animate-fade-in">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="font-bold text-white text-sm">Sugestões</span>
            </div>
          )}
          <button
            onClick={toggleSidebarCollapse}
            title={isSidebarCollapsed ? "Expandir menu" : "Recolher menu"}
            className={`text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors ${
              isSidebarCollapsed ? "mx-auto" : ""
            }`}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
        <nav className={`px-2 flex-1 ${isSidebarCollapsed ? "flex flex-col items-center" : ""}`}>
          <Link
            href="/admin"
            title={isSidebarCollapsed ? "Voltar ao Dashboard" : undefined}
            className={`btn-press flex items-center rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-all ${
              isSidebarCollapsed ? "w-10 h-10 justify-center px-0" : "w-full gap-3 px-3 py-2.5"
            }`}
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Voltar ao Dashboard</span>}
          </Link>
        </nav>
        <AdminUserFooter user={user} isCollapsed={isSidebarCollapsed} />
      </aside>

      <main className="flex-1 p-6 overflow-y-auto h-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">Sugestões da Equipe</h1>
            <p className="text-gray-500 text-sm">
              O que Kai, Vera e Theo encontraram na varredura diária — revise, edite e aprove o que entra no site.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="btn-press flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-xl transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
        </div>

        {loading && <p className="text-gray-500 text-sm">Carregando...</p>}

        {!loading && data && data.pendentes.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20 text-gray-500">
            <Inbox className="w-10 h-10 mb-3 opacity-50" />
            <p className="font-semibold text-white mb-1">Nenhuma sugestão pendente</p>
            <p className="text-sm">
              O pipeline diário roda de forma manual e envia os dados diretamente para esta área.
            </p>
          </div>
        )}

        {data && data.pendentes.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 mb-10 items-start">
            {/* Coluna Esquerda: Fila de Tarefas / Checklist */}
            <FilaRevisao
              pendentes={data.pendentes}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              cancelEdit={cancelEdit}
              getSugestaoTipoLabel={getSugestaoTipoLabel}
            />

            {/* Coluna Direita: Espaço de Trabalho / Workspace */}
            <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-6">
              {(() => {
                const sugestao = data.pendentes.find(s => s.id === selectedId);
                if (!sugestao) {
                  return (
                    <div className="flex flex-col items-center justify-center text-center py-20 text-gray-500">
                      <Inbox className="w-10 h-10 mb-3 opacity-50" />
                      <p className="font-semibold text-white mb-1">Selecione um rascunho</p>
                      <p className="text-sm">Escolha uma sugestão na lista à esquerda para revisar.</p>
                    </div>
                  );
                }

                const isEditing = editingId === sugestao.id;

                if (isEditing) {
                  return (
                    <SugestaoForm
                      key={sugestao.id}
                      sugestao={sugestao}
                      cancelEdit={cancelEdit}
                      handleAprovar={handleAprovar}
                      busy={busy}
                      getSugestaoTipoLabel={getSugestaoTipoLabel}
                      uploadingImage={uploadingImage}
                      uploadError={uploadError}
                      handleImageUpload={handleImageUpload}
                      editTitulo={editTitulo}
                      setEditTitulo={setEditTitulo}
                      editSlug={editSlug}
                      setEditSlug={setEditSlug}
                      editCover={editCover}
                      setEditCover={setEditCover}
                      editImageCredits={editImageCredits}
                      setEditImageCredits={setEditImageCredits}
                      editFontes={editFontes}
                      setEditFontes={setEditFontes}
                      editExcerpt={editExcerpt}
                      setEditExcerpt={setEditExcerpt}
                      editBody={editBody}
                      setEditBody={setEditBody}
                      editOverallScore={editOverallScore}
                      setEditOverallScore={setEditOverallScore}
                      editDeveloper={editDeveloper}
                      setEditDeveloper={setEditDeveloper}
                      editReleaseDate={editReleaseDate}
                      setEditReleaseDate={setEditReleaseDate}
                      editPrice={editPrice}
                      setEditPrice={setEditPrice}
                      editPlatforms={editPlatforms}
                      setEditPlatforms={setEditPlatforms}
                      editGenres={editGenres}
                      setEditGenres={setEditGenres}
                      editPros={editPros}
                      setEditPros={setEditPros}
                      editCons={editCons}
                      setEditCons={setEditCons}
                      editBuyLink={editBuyLink}
                      setEditBuyLink={setEditBuyLink}
                      allGames={allGames}
                      editGameId={editGameId}
                      setEditGameId={setEditGameId}
                      editCategory={editCategory}
                      setEditCategory={setEditCategory}
                      editTags={editTags}
                      setEditTags={setEditTags}
                    />
                  );
                }

                return (
                  <SugestaoDetail
                    key={sugestao.id}
                    sugestao={sugestao}
                    busy={busy}
                    startEdit={startEdit}
                    handleAprovar={handleAprovar}
                    rejectingId={rejectingId}
                    setRejectingId={setRejectingId}
                    motivo={motivo}
                    setMotivo={setMotivo}
                    handleRejeitar={handleRejeitar}
                    getSugestaoTipoLabel={getSugestaoTipoLabel}
                  />
                );
              })()}
            </div>
          </div>
        ) : null}

        {data && (data.aprovados.length > 0 || data.rejeitados.length > 0) && (
          <HistoricoSugestoes
            aprovados={data.aprovados}
            rejeitados={data.rejeitados}
            getSugestaoTipoLabel={getSugestaoTipoLabel}
          />
        )}
      </main>
    </div>
  );
}
