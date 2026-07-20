"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, KeyRound } from "lucide-react";
import ChangePasswordModal from "./ChangePasswordModal";

const ROLE_LABELS: Record<string, string> = {
  DEVELOPER: "Developer",
  COLABORADOR: "Colaborador",
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

export default function AdminUserFooter({
  user,
  isCollapsed,
}: {
  user: AdminUserSession;
  isCollapsed?: boolean;
}) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className={`px-2 mt-4 pt-4 border-t border-white/5 transition-all duration-300 ${isCollapsed ? "flex flex-col items-center" : ""}`}>
      {!isCollapsed && (
        <div className="px-3 mb-2 animate-fade-in">
          <p className="text-sm font-semibold text-white truncate">{user.name}</p>
          <p className="text-xs text-purple-400">{ROLE_LABELS[user.role] ?? user.role}</p>
        </div>
      )}

      <button
        onClick={() => setIsChangePasswordOpen(true)}
        title={isCollapsed ? "Alterar Senha" : undefined}
        className={`btn-press flex items-center rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-all mb-1 ${
          isCollapsed ? "w-10 h-10 justify-center" : "w-full gap-3 px-3 py-2"
        }`}
      >
        <KeyRound className="w-4 h-4 flex-shrink-0" />
        {!isCollapsed && <span>Alterar Senha</span>}
      </button>

      <button
        onClick={handleLogout}
        disabled={loggingOut}
        title={isCollapsed ? "Sair" : undefined}
        className={`btn-press flex items-center rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-900/10 transition-all disabled:opacity-60 ${
          isCollapsed ? "w-10 h-10 justify-center" : "w-full gap-3 px-3 py-2"
        }`}
      >
        <LogOut className="w-4 h-4 flex-shrink-0" />
        {!isCollapsed && <span>{loggingOut ? "Saindo..." : "Sair"}</span>}
      </button>

      {isChangePasswordOpen && (
        <ChangePasswordModal onClose={() => setIsChangePasswordOpen(false)} />
      )}
    </div>
  );
}

