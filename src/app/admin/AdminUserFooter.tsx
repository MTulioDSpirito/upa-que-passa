"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  EDITOR_CHEFE: "Editor-Chefe",
  REPORTER: "Repórter",
  CURADOR_NOTAS: "Curador(a) de Notas",
  REDATOR_REVIEWS: "Redator(a) de Reviews",
  QA_DADOS: "QA de Dados",
};

export interface AdminUserSession {
  name: string;
  email: string;
  role: string;
}

export default function AdminUserFooter({ user }: { user: AdminUserSession }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="px-2 mt-4 pt-4 border-t border-white/5">
      <div className="px-3 mb-2">
        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
        <p className="text-xs text-purple-400">{ROLE_LABELS[user.role] ?? user.role}</p>
      </div>
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="btn-press w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-900/10 transition-all disabled:opacity-60"
      >
        <LogOut className="w-4 h-4" />
        {loggingOut ? "Saindo..." : "Sair"}
      </button>
    </div>
  );
}
