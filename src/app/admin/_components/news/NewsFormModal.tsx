import React, { useState, useEffect } from "react";
import { X, Loader2, Image as ImageIcon } from "lucide-react";
import { NewsArticle } from "@/lib/types";
import { type AdminUserSession } from "../layout/AdminUserFooter";

interface NewsFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  article: NewsArticle | null;
  adminUser: AdminUserSession;
  actionLoading: boolean;
}

const CATEGORIES = ["Notícias", "Lançamentos", "Hardware", "Artigos", "Eventos", "Outros"];

export default function NewsFormModal({
  isOpen,
  onClose,
  onSubmit,
  article,
  adminUser,
  actionLoading,
}: NewsFormModalProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [category, setCategory] = useState("Notícias");
  const [tagsInput, setTagsInput] = useState("");
  const [imageCredits, setImageCredits] = useState("");
  const [fontes, setFontes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [team, setTeam] = useState<Array<{ id: string; name: string }>>([]);

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

  // Initialize fields if editing
  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setSlug(article.slug);
      setExcerpt(article.excerpt);
      setContent(article.content);
      setCover(article.cover);
      setAuthor(article.author);
      setPublishedAt(article.publishedAt);
      setCategory(article.category);
      setTagsInput(article.tags?.join(", ") || "");
      setImageCredits(article.imageCredits || "");
      setFontes(article.fontes || "");
    } else {
      setTitle("");
      setSlug("");
      setExcerpt("");
      setContent("");
      setCover("");
      setAuthor(adminUser?.name || "");
      setPublishedAt(new Date().toISOString().split("T")[0]);
      setCategory("Notícias");
      setTagsInput("");
      setImageCredits("");
      setFontes("");
    }
    setError(null);
  }, [article, adminUser, isOpen]);

  // Auto-generate slug from title
  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9\s-]/g, "") // Remove spec chars
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/-+/g, "-"); // Collapse dashes
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(generateSlug(val));
  };

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

      const res = await fetch("/api/admin/upload?type=news", {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError("O título é obrigatório.");
    if (!slug.trim()) return setError("O slug é obrigatório.");
    if (!excerpt.trim()) return setError("O resumo é obrigatório.");
    if (!content.trim()) return setError("O conteúdo é obrigatório.");
    if (!cover.trim()) return setError("A imagem de capa é obrigatória.");
    if (!author.trim()) return setError("O autor é obrigatório.");
    if (!publishedAt.trim()) return setError("A data é obrigatória.");

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title,
      slug,
      excerpt,
      content,
      cover,
      author,
      publishedAt,
      category,
      tags,
      imageCredits: imageCredits.trim() || undefined,
      fontes: fontes.trim() || undefined,
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar a notícia.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0f0f18] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#121220]">
          <h2 className="text-xl font-bold text-white">
            {article ? "Editar Notícia" : "Nova Notícia"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-950/30 border border-red-500/20 text-red-400 text-sm rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Ex: Sony anuncia novidades para o PS5"
                className="w-full bg-[#161624] border border-white/5 focus:border-purple-500 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none transition-colors"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Slug (URL amigável)
              </label>
              <input
                type="text"
                value={slug}
                readOnly
                disabled
                placeholder="Gerado automaticamente"
                className="w-full bg-[#161624]/50 border border-white/5 rounded-xl px-4 py-2.5 text-gray-500 placeholder-gray-600 text-sm cursor-not-allowed focus:outline-none transition-colors"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#161624] border border-white/5 focus:border-purple-500 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Tags (Separadas por vírgula)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="PS5, Sony, Lançamentos"
                className="w-full bg-[#161624] border border-white/5 focus:border-purple-500 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none transition-colors"
              />
            </div>

            {/* Cover URL & Upload */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Imagem de Capa
                </label>
                {uploadError && (
                  <span className="text-xs text-red-400 font-semibold">{uploadError}</span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 block">Digitar URL da imagem</span>
                  <input
                    type="text"
                    value={cover}
                    onChange={(e) => setCover(e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="w-full bg-[#161624] border border-white/5 focus:border-purple-500 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 block">Ou enviar arquivo (Máx. 2MB)</span>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="w-full bg-[#161624] border border-white/5 focus:border-purple-500 rounded-xl px-4 py-2 text-white placeholder-gray-600 text-sm focus:outline-none transition-colors file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer disabled:opacity-50"
                    />
                    {uploadingImage && (
                      <div className="absolute right-3 top-2.5 flex items-center gap-1.5 text-xs text-purple-400">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Enviando...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Preview */}
            {cover && (
              <div className="md:col-span-2 flex justify-center bg-[#161624]/30 border border-white/5 rounded-xl p-4">
                <div className="relative max-h-48 rounded-lg overflow-hidden border border-white/10">
                  <img
                    src={cover}
                    alt="Preview da capa"
                    className="max-h-40 object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Author */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Autor
              </label>
              {adminUser.role === "DEVELOPER" ? (
                <select
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-[#161624] border border-white/5 focus:border-purple-500 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none transition-colors"
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
                  className="w-full bg-[#161624] border border-white/5 rounded-xl px-4 py-2.5 text-gray-500 text-sm cursor-not-allowed focus:outline-none transition-colors opacity-60"
                />
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Data de Publicação
              </label>
              <input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full bg-[#161624] border border-white/5 focus:border-purple-500 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none transition-colors"
              />
            </div>

            {/* Image Credits */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Créditos da Imagem (Opcional)
              </label>
              <input
                type="text"
                value={imageCredits}
                onChange={(e) => setImageCredits(e.target.value)}
                placeholder="Ex: PlayStation Blog"
                className="w-full bg-[#161624] border border-white/5 focus:border-purple-500 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none transition-colors"
              />
            </div>

            {/* Fontes */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Fontes (Origem da informação)
              </label>
              <input
                type="text"
                value={fontes}
                onChange={(e) => setFontes(e.target.value)}
                placeholder="Ex: PlayStation Blog, IGN, Eurogamer"
                className="w-full bg-[#161624] border border-white/5 focus:border-purple-500 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none transition-colors"
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Resumo / Chamada
                </label>
                <span className="text-[10px] text-gray-500">{excerpt.length} caracteres</span>
              </div>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="Escreva uma breve introdução cativante sobre a notícia..."
                className="w-full bg-[#161624] border border-white/5 focus:border-purple-500 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Content Body */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Conteúdo da Notícia
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                placeholder="Escreva o texto completo da notícia aqui..."
                className="w-full bg-[#161624] border border-white/5 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none transition-colors resize-y font-sans"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end items-center gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-sm font-semibold transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="btn-press flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
