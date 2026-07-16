"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard, Star, ShoppingBag, Users, MessageSquare,
  Newspaper, Trophy, Settings, BarChart3, Shield, Play, Calendar
} from "lucide-react";
import { useAllGames } from "@/hooks/useAllGames";

import Sidebar from "./_components/layout/Sidebar";
import DashboardTab from "./_components/dashboard/DashboardTab";
import ReviewsTab from "./_components/reviews/ReviewsTab";
import UsersTab from "./_components/users/UsersTab";
import MarketplaceTab from "./_components/marketplace/MarketplaceTab";
import NewsTab from "./_components/news/NewsTab";
import RankingTab from "./_components/ranking/RankingTab";
import YoutubeTab from "./_components/youtube/YoutubeTab";
import LancamentosTab from "./_components/lancamentos/LancamentosTab";
import NotBuiltTab from "./_components/layout/NotBuiltTab";

import { usePendingSugestoes } from "./_hooks/usePendingSugestoes";
import { useAdminUsers } from "./_hooks/useAdminUsers";
import { type AdminUserSession } from "./_components/layout/AdminUserFooter";
import { type AdminSiteUser } from "./_components/users/EditUserModal";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Star, label: "Reviews", id: "reviews" },
  { icon: Newspaper, label: "Notícias", id: "news" },
  { icon: Trophy, label: "Ranking", id: "ranking" },
  { icon: Play, label: "Youtube", id: "youtube" },
  { icon: Calendar, label: "Lançamentos", id: "releases" },
  { icon: Users, label: "Usuários", id: "users" },
  { icon: MessageSquare, label: "Comentários", id: "comments" },
  { icon: ShoppingBag, label: "Marketplace", id: "marketplace" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: Shield, label: "Moderação", id: "moderation" },
  { icon: Settings, label: "Configurações", id: "settings" },
];

const NOT_YET_BUILT = ["comments", "analytics", "moderation", "settings"];

export default function AdminDashboardClient({ user }: { user: AdminUserSession }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [editingUser, setEditingUser] = useState<AdminSiteUser | null>(null);
  const [allGames] = useAllGames();

  // Load from localStorage on mount
  useEffect(() => {
    const savedSection = localStorage.getItem("admin_active_section");
    if (savedSection) {
      setActiveSection(savedSection);
    }
  }, []);

  const handleSetActiveSection = (section: string) => {
    setActiveSection(section);
    localStorage.setItem("admin_active_section", section);
  };

  // Custom Hooks to separate data fetching logic
  const pendentesCount = usePendingSugestoes();
  const { siteUsers, setSiteUsers } = useAdminUsers(activeSection === "users");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        sidebarItems={SIDEBAR_ITEMS}
        activeSection={activeSection}
        setActiveSection={handleSetActiveSection}
        pendentesCount={pendentesCount}
        user={user}
      />

      <main className="flex-1 p-6 overflow-y-auto h-full">
        {activeSection === "dashboard" && (
          <DashboardTab
            allGames={allGames}
            setActiveSection={handleSetActiveSection}
          />
        )}

        {activeSection === "reviews" && (
          <ReviewsTab allGames={allGames} adminUser={user} />
        )}

        {activeSection === "users" && (
          <UsersTab
            siteUsers={siteUsers}
            setSiteUsers={setSiteUsers}
            editingUser={editingUser}
            setEditingUser={setEditingUser}
          />
        )}

        {activeSection === "marketplace" && (
          <MarketplaceTab />
        )}

        {activeSection === "news" && (
          <NewsTab adminUser={user} />
        )}

        {activeSection === "ranking" && (
          <RankingTab allGames={allGames} />
        )}

        {activeSection === "youtube" && (
          <YoutubeTab />
        )}

        {activeSection === "releases" && (
          <LancamentosTab />
        )}

        {NOT_YET_BUILT.includes(activeSection) && (
          <NotBuiltTab label={SIDEBAR_ITEMS.find((i) => i.id === activeSection)?.label || ""} />
        )}
      </main>
    </div>
  );
}

