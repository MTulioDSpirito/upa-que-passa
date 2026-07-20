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
import ModerationTab from "./_components/moderation/ModerationTab";
import AdminManagementTab from "./_components/admin-users/AdminManagementTab";

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
];

const SECTION_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  reviews: "Reviews",
  news: "Notícias",
  ranking: "Ranking",
  youtube: "Youtube",
  releases: "Lançamentos",
  users: "Usuários",
  comments: "Comentários",
  admin_users: "Gerenciar Equipe",
  marketplace: "Marketing Place",
  analytics: "Analytics",
  settings: "Configurações",
};

const NOT_YET_BUILT = ["marketplace", "analytics", "settings"];

export default function AdminPanelLayout({ user }: { user: AdminUserSession }) {
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

  const [usersPage, setUsersPage] = useState(1);
  const [usersSearch, setUsersSearch] = useState("");

  // Custom Hooks to separate data fetching logic
  const pendentesCount = usePendingSugestoes();
  const {
    siteUsers,
    setSiteUsers,
    totalPages: usersTotalPages,
    totalItems: usersTotalItems,
    loading: usersLoading,
  } = useAdminUsers(activeSection === "users", usersPage, usersSearch);

  // Dynamic sidebar items: add "Gerenciar Equipe" only for DEVELOPER
  const sidebarItems = [
    ...SIDEBAR_ITEMS,
    ...(user.role === "DEVELOPER" ? [{ icon: Shield, label: "Gerenciar Equipe", id: "admin_users" }] : []),
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        sidebarItems={sidebarItems}
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
            user={user}
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
            page={usersPage}
            setPage={setUsersPage}
            search={usersSearch}
            setSearch={setUsersSearch}
            totalPages={usersTotalPages}
            totalItems={usersTotalItems}
            loading={usersLoading}
          />
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

        {activeSection === "admin_users" && user.role === "DEVELOPER" && (
          <AdminManagementTab adminUser={user} />
        )}

        {(activeSection === "comments" || activeSection === "moderation") && (
          <ModerationTab />
        )}

        {NOT_YET_BUILT.includes(activeSection) && (
          <NotBuiltTab label={SECTION_LABELS[activeSection] || ""} />
        )}
      </main>
    </div>
  );
}

