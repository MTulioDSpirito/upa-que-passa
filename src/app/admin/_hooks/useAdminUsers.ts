"use client";

import { useState, useEffect } from "react";
import { AdminSiteUser } from "../_components/users/EditUserModal";

export function useAdminUsers(active: boolean, page: number, search: string) {
  const [siteUsers, setSiteUsers] = useState<AdminSiteUser[] | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Evita 1 requisição por tecla digitada — só busca 300ms depois de parar de digitar.
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "10",
    });
    if (debouncedSearch.trim()) {
      params.append("search", debouncedSearch.trim());
    }
    fetch(`/api/admin/users?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setSiteUsers(data.users);
        setTotalPages(data.pages || 1);
        setTotalItems(data.total || 0);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [active, page, debouncedSearch]);

  return { siteUsers, setSiteUsers, totalPages, totalItems, loading };
}
