"use client";

import { Suspense } from "react";
import SearchPageContent from "./SearchPageContent";

export default function BuscarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#06060c] pt-32 text-center text-gray-500 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
          <p className="mt-4 text-sm">Carregando busca...</p>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
