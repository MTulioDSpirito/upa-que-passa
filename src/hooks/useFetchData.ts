"use client";

import { useEffect, useState, Dispatch, SetStateAction } from "react";

/**
 * Hook genérico para buscar dados de uma API e gerenciar o estado correspondente.
 * 
 * @param url A URL do endpoint a ser chamado.
 * @param initialValue O valor inicial do estado.
 * @param key Chave opcional dentro do JSON retornado para extrair a lista ou dado específico.
 */
export function useFetchData<T>(
  url: string,
  initialValue: T,
  key?: string
): [T, Dispatch<SetStateAction<T>>] {
  const [data, setData] = useState<T>(initialValue);

  useEffect(() => {
    let active = true;

    // Adiciona timestamp para evitar cache no fetch de forma dinâmica
    const fetchUrl = url.includes("?") 
      ? `${url}&_t=${Date.now()}` 
      : `${url}?_t=${Date.now()}`;

    fetch(fetchUrl)
      .then((res) => (res.ok ? res.json() : null))
      .then((resData) => {
        if (!active) return;
        if (resData) {
          const payload = key ? resData[key] : resData;
          if (payload !== undefined) {
            setData(payload);
          }
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [url, key]);

  return [data, setData];
}
