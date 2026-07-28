"use client";

import { useFetchData } from "./useFetchData";
import { Game } from "@/lib/types";

export function useAllGames(): [Game[], (game: Game) => void] {
  const [allGames, setAllGames] = useFetchData<Game[]>("/api/admin/games", [], "games");

  function addGame(game: Game) {
    setAllGames((prev) => {
      const idx = prev.findIndex((g) => g.id === game.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = game;
        return next;
      }
      return [...prev, game];
    });
  }

  return [allGames, addGame];
}

