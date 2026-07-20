"use client";

import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Star, Newspaper, Trophy, Play, Calendar, Users, MessageSquare, AlertTriangle, ArrowLeft
} from "lucide-react";
import Sidebar from "../_components/layout/Sidebar";
import { usePendingSugestoes } from "../_hooks/usePendingSugestoes";
import { type AdminUserSession } from "../_components/layout/AdminUserFooter";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Star, label: "Reviews", id: "reviews" },
  { icon: Newspaper, label: "Notícias", id: "news" },
  { icon: Trophy, label: "Ranking", id: "ranking" },
  { icon: Play, label: "Youtube", id: "youtube" },
  { icon: Calendar, label: "Lançamentos", id: "releases" },
  { icon: Users, label: "Usuários", id: "users" },
  { icon: MessageSquare, label: "Comentários", id: "comments" },
];

export default function AdminNotFoundClient({ user }: { user: AdminUserSession }) {
  const router = useRouter();
  const pendentesCount = usePendingSugestoes();

  const handleSetActiveSection = (section: string) => {
    localStorage.setItem("admin_active_section", section);
    router.push("/admin");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#07070a] text-white">
      <Sidebar
        sidebarItems={SIDEBAR_ITEMS}
        activeSection="404"
        setActiveSection={handleSetActiveSection}
        pendentesCount={pendentesCount}
        user={user}
      />

      <main className="flex-1 p-6 overflow-y-auto h-full flex items-center justify-center relative">
        {/* Glow effect background */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-lg w-full relative z-10 text-center">
          <div className="bg-[#0f0f18]/60 border-2 border-white/5 rounded-3xl p-8 backdrop-blur-xl relative">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl border border-purple-500/30 flex items-center justify-center text-purple-400">
                <AlertTriangle className="w-8 h-8" />
              </div>
            </div>

            <h1 className="text-3xl font-black text-white mb-2">Página Não Encontrada</h1>
            <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
              A seção do painel administrativo que você tentou acessar não existe ou foi removida.
            </p>

            <button
              onClick={() => handleSetActiveSection("dashboard")}
              className="btn-press inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Dashboard</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
