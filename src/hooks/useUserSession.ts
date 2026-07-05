"use client";

import { useEffect, useState } from "react";

export interface PublicUserSession {
  id: string;
  nickname: string;
  email: string;
  avatar?: string;
}

// undefined = ainda carregando, null = anônimo, objeto = logado
export function useUserSession() {
  const [user, setUser] = useState<PublicUserSession | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setUser(data.user);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return user;
}
