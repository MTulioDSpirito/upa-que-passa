"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import AdminUserFooter, { type AdminUserSession } from "./AdminUserFooter";

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  id: string;
}

interface SidebarProps {
  sidebarItems: SidebarItem[];
  activeSection: string;
  setActiveSection: (id: string) => void;
  pendentesCount: number | null;
  user: AdminUserSession;
}

export default function Sidebar({
  sidebarItems,
  activeSection,
  setActiveSection,
  pendentesCount,
  user,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin-sidebar-collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  const toggleCollapse = () => {
    const newValue = !isCollapsed;
    setIsCollapsed(newValue);
    localStorage.setItem("admin-sidebar-collapsed", String(newValue));
  };

  return (
    <aside
      className={`bg-[#0f0f18] border-r border-white/5 py-6 flex-shrink-0 flex flex-col sticky top-0 h-screen overflow-y-auto transition-[width] duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-56"
      }`}
    >
      <div className={`px-4 mb-6 flex items-center justify-between gap-2 h-6`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2 truncate animate-fade-in">
            <Shield className="w-5 h-5 text-purple-400" />
            <span className="font-bold text-white text-sm">Painel Admin</span>
          </div>
        )}
        <button
          onClick={toggleCollapse}
          title={isCollapsed ? "Expandir menu" : "Recolher menu"}
          className={`text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors ${
            isCollapsed ? "mx-auto" : ""
          }`}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      <nav className={`space-y-0.5 px-2 flex-1 ${isCollapsed ? "flex flex-col items-center" : ""}`}>
        <Link
          href="/admin/sugestoes"
          title={isCollapsed ? "Sugestões da Equipe" : undefined}
          className={`btn-press flex items-center rounded-xl text-sm text-gray-300 hover:text-white hover:bg-purple-600/10 border border-purple-700/20 bg-purple-600/5 transition-all mb-2 ${
            isCollapsed ? "w-10 h-10 justify-center px-0 relative" : "w-full gap-3 px-3 py-2.5"
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left truncate">Sugestões da Equipe</span>
              {!!pendentesCount && (
                <span className="text-xs font-bold bg-purple-600 text-white rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
                  {pendentesCount}
                </span>
              )}
            </>
          )}
          {isCollapsed && !!pendentesCount && (
            <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-purple-600 text-white rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
              {pendentesCount}
            </span>
          )}
        </Link>

        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            title={isCollapsed ? item.label : undefined}
            className={`btn-press flex items-center rounded-xl text-sm transition-all ${
              activeSection === item.id
                ? "bg-purple-600/20 text-purple-300 border border-purple-700/30"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            } ${
              isCollapsed ? "w-10 h-10 justify-center px-0" : "w-full gap-3 px-3 py-2.5"
            }`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      <AdminUserFooter user={user} isCollapsed={isCollapsed} />
    </aside>
  );
}
