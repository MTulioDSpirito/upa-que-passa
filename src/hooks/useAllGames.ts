"use client";

import { useEffect, useState } from "react";
import { Game } from "@/lib/types";

export function useAllGames(): [Game[], (game: Game) => void] {
  const [allGames, setAllGames] = useState<Game[]>([]);

  useEffect(() => {
    fetch(`/api/admin/games?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.games) {
          setAllGames(data.games);
        }
      })
      .catch(() => {});
  }, []);

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
