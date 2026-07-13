"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, X, Gamepad2, Newspaper } from "lucide-react";
import { NEWS } from "@/lib/data";
import { useAllGames } from "@/hooks/useAllGames";

export const OPEN_SEARCH_EVENT = "upa:open-search";

export function openSearch() {
  window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
}

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    function onOpenEvent() {
      setOpen(true);
    }
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setQuery("");
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener(OPEN_SEARCH_EVENT, onOpenEvent);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpenEvent);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const [games] = useAllGames();

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setQuery("");
  }

  const term = query.trim().toLowerCase();
  const gameResults = term
    ? games.filter((g) => g.title.toLowerCase().includes(term) || g.developer.toLowerCase().includes(term)).slice(0, 5)
    : [];
  const newsResults = term
    ? NEWS.filter((n) => n.title.toLowerCase().includes(term)).slice(0, 5)
    : [];
  const hasResults = gameResults.length > 0 || newsResults.length > 0;

  function goTo(href: string) {
    handleOpenChange(false);
    router.push(href);
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-[100]" />
        <Dialog.Content
          className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg bg-[#0f0f18] border border-white/10 rounded-2xl p-4 z-[101]"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            document.getElementById("upa-search-input")?.focus();
          }}
        >
          <Dialog.Title className="sr-only">Buscar</Dialog.Title>
          <div className="flex items-center gap-2 border border-white/10 bg-white/5 rounded-xl px-3 py-2.5 mb-3">
            <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <input
              id="upa-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar jogos, notícias..."
              className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
            />
            <Dialog.Close className="text-gray-500 hover:text-white transition-colors flex-shrink-0">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          {term && (
            <div className="max-h-96 overflow-y-auto space-y-1">
              {gameResults.map((g) => (
                <button
                  key={g.id}
                  onClick={() => goTo(`/jogos/${g.slug}`)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-left"
                >
                  <img src={g.cover} alt="" className="w-8 h-11 object-cover rounded-md flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{g.title}</p>
                    <p className="text-xs text-gray-500 truncate">{g.developer}</p>
                  </div>
                </button>
              ))}
              {newsResults.map((n) => (
                <button
                  key={n.id}
                  onClick={() => goTo(`/noticias/${n.slug}`)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-left"
                >
                  <Newspaper className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <p className="text-sm text-white truncate">{n.title}</p>
                </button>
              ))}
              {!hasResults && (
                <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                  <Gamepad2 className="w-8 h-8 mb-2" />
                  <p className="text-sm">Nenhum resultado para &quot;{query}&quot;</p>
                </div>
              )}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
