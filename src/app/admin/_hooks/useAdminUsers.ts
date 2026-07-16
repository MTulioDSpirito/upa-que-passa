"use client";

import { useState, useEffect } from "react";
import { AdminSiteUser } from "../_components/users/EditUserModal";

export function useAdminUsers(active: boolean) {
  const [siteUsers, setSiteUsers] = useState<AdminSiteUser[] | null>(null);

  useEffect(() => {
    if (!active || siteUsers !== null) return;
    fetch("/api/admin/users")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setSiteUsers(data.users);
      })
      .catch(() => {});
  }, [active, siteUsers]);

  return { siteUsers, setSiteUsers };
}
