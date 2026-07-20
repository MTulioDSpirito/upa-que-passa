"use client";

import { useState, useEffect } from "react";
import { AdminSiteUser } from "../_components/users/EditUserModal";

export function useAdminUsers(active: boolean, page: number, search: string) {
  const [siteUsers, setSiteUsers] = useState<AdminSiteUser[] | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!active) return;
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "10",
    });
    if (search.trim()) {
      params.append("search", search.trim());
    }
    fetch(`/api/admin/users?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setSiteUsers(data.users);
          setTotalPages(data.pages || 1);
          setTotalItems(data.total || 0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [active, page, search]);

  return { siteUsers, setSiteUsers, totalPages, totalItems, loading };
}
