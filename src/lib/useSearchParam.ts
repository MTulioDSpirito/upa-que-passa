"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

/**
 * Lê um parâmetro da query string diretamente de `window.location`, sem usar
 * `useSearchParams()`/`Suspense` (que nesta versão do Next quebra a hidratação
 * de páginas estáticas) nem `searchParams` como prop de servidor (que força a
 * página a ser dinâmica — bug separado que quebra a hidratação por completo).
 */
export function useSearchParam(name: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(name),
    () => null
  );
}
