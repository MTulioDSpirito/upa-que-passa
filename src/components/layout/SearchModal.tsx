"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, X } from "lucide-react";

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

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setQuery("");
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = query.trim();
    if (term) {
      handleOpenChange(false);
      router.push(`/buscar?q=${encodeURIComponent(term)}`);
    }
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
          <form onSubmit={handleSearch} className="flex items-center gap-2 border border-white/10 bg-white/5 rounded-xl px-3 py-2.5">
            <button type="submit" className="text-gray-500 hover:text-white transition-colors flex-shrink-0" title="Buscar">
              <Search className="w-4 h-4" />
            </button>
            <input
              id="upa-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar jogos, notícias..."
              className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
            />
            <Dialog.Close type="button" className="text-gray-500 hover:text-white transition-colors flex-shrink-0">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
