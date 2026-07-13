"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Game } from "@/lib/types";

export default function AddGameModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: (game: Game) => void;
}) {
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("");
  const [developer, setDeveloper] = useState("");
  const [publisher, setPublisher] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [genres, setGenres] = useState("");
  const [platforms, setPlatforms] = useState("");
  const [suggestedPrice, setSuggestedPrice] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          cover,
          developer,
          publisher,
          releaseDate,
          synopsis,
          suggestedPrice,
          genres: genres.split(",").map((g) => g.trim()).filter(Boolean),
          platforms: platforms.split(",").map((p) => p.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível salvar o jogo.");
        return;
      }
      onSaved(data.game);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-[100]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[#0f0f18] border border-white/10 rounded-2xl p-6 z-[101]">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-lg font-bold text-white">Adicionar jogo</Dialog.Title>
            <Dialog.Close className="text-gray-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="text-sm text-red-400 bg-red-900/20 border border-red-800/30 rounded-xl px-4 py-2.5">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Título *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Ghost of Yōtei"
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">URL da capa *</label>
              <input
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                placeholder="https://..."
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
              />
              <p className="text-xs text-gray-500 mt-1">A URL é verificada (HTTP 200) antes de entrar no catálogo.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Desenvolvedora *</label>
                <input
                  value={developer}
                  onChange={(e) => setDeveloper(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Publicadora</label>
                <input
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Data de lançamento *</label>
                <input
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Preço sugerido (R$)</label>
                <input
                  type="number"
                  value={suggestedPrice}
                  onChange={(e) => setSuggestedPrice(e.target.value)}
                  placeholder="299.90"
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Gêneros * (separados por vírgula)</label>
                <input
                  value={genres}
                  onChange={(e) => setGenres(e.target.value)}
                  placeholder="Ação, Aventura"
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Plataformas * (separadas por vírgula)</label>
                <input
                  value={platforms}
                  onChange={(e) => setPlatforms(e.target.value)}
                  placeholder="PS5, PC"
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sinopse</label>
              <textarea
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                rows={3}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 text-sm font-semibold text-gray-300 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !title || !cover || !developer || !releaseDate || !genres || !platforms}
                className="flex-1 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl transition-all disabled:opacity-60"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
