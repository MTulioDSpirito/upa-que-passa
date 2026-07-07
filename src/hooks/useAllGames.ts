"use client";

import { useEffect, useState } from "react";
import { GAMES } from "@/lib/data";
import { Game } from "@/lib/types";

export function useAllGames(): [Game[], (game: Game) => void] {
  const [extraGames, setExtraGames] = useState<Game[]>([]);

  useEffect(() => {
    fetch("/api/admin/games")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.games) setExtraGames(data.games);
      })
      .catch(() => {});
  }, []);

  function addGame(game: Game) {
    setExtraGames((prev) => [...prev, game]);
  }

  return [[...GAMES, ...extraGames], addGame];
}
