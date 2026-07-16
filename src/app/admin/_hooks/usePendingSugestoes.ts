"use client";

import { useState, useEffect } from "react";

export function usePendingSugestoes() {
  const [pendentesCount, setPendentesCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/entregas")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setPendentesCount(data.pendentes.length);
      })
      .catch(() => {});
  }, []);

  return pendentesCount;
}
