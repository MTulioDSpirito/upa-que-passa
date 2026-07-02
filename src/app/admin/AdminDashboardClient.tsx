"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Gamepad2, Star, ShoppingBag, Users, MessageSquare,
  Newspaper, Trophy, Settings, BarChart3, TrendingUp, TrendingDown,
  Eye, Plus, Edit, Trash2, Shield, Sparkles
} from "lucide-react";
import { GAMES, LISTINGS, NEWS, USERS } from "@/lib/data";
import AdminUserFooter, { type AdminUserSession } from "./AdminUserFooter";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Gamepad2, label: "Jogos", id: "games" },
  { icon: Star, label: "Reviews", id: "reviews" },
  { icon: Users, label: "Usuários", id: "users" },
  { icon: ShoppingBag, label: "Marketplace", id: "marketplace" },
  { icon: Newspaper, label: "Notícias", id: "news" },
  { icon: MessageSquare, label: "Comentários", id: "comments" },
  { icon: Trophy, label: "Ranking", id: "ranking" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: Shield, label: "Moderação", id: "moderation" },
  { icon: Settings, label: "Configurações", id: "settings" },
];

const STATS = [
  { label: "Usuários", value: "12.4k", change: +8.2, icon: Users, color: "text-blue-400 bg-blue-900/20 border-blue-800/20" },
  { label: "Jogos Cadastrados", value: "500+", change: +2.1, icon: Gamepad2, color: "text-purple-400 bg-purple-900/20 border-purple-800/20" },
  { label: "Reviews Publicadas", value: "1.8k", change: +12.5, icon: Star, color: "text-yellow-400 bg-yellow-900/20 border-yellow-800/20" },
  { label: "Anúncios Ativos", value: "324", change: +18.7, icon: ShoppingBag, color: "text-green-400 bg-green-900/20 border-green-800/20" },
  { label: "Comentários Hoje", value: "284", change: -3.4, icon: MessageSquare, color: "text-pink-400 bg-pink-900/20 border-pink-800/20" },
  { label: "Visitas Hoje", value: "18.2k", change: +5.6, icon: Eye, color: "text-cyan-400 bg-cyan-900/20 border-cyan-800/20" },
];

export default function AdminDashboardClient({ user }: { user: AdminUserSession }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [pendentesCount, setPendentesCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/entregas")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setPendentesCount(data.pendentes.length);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0d0d18] border-r border-white/5 py-6 flex-shrink-0 flex flex-col sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="px-4 mb-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <span className="font-bold text-white text-sm">Painel Admin</span>
          </div>
        </div>
        <nav className="space-y-0.5 px-2 flex-1">
          <Link
            href="/admin/sugestoes"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-purple-600/10 border border-purple-700/20 bg-purple-600/5 transition-all mb-2"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="flex-1 text-left">Sugestões da Equipe</span>
            {!!pendentesCount && (
              <span className="text-xs font-bold bg-purple-600 text-white rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
                {pendentesCount}
              </span>
            )}
          </Link>
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                activeSection === item.id
                  ? "bg-purple-600/20 text-purple-300 border border-purple-700/30"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <AdminUserFooter user={user} />
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeSection === "dashboard" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-black text-white">Dashboard</h1>
                <p className="text-gray-500 text-sm">Visão geral do portal</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl transition-all">
                  <Plus className="w-4 h-4" />
                  Adicionar Jogo
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {STATS.map((stat) => (
                <div key={stat.label} className={`bg-[#111118] border rounded-2xl p-5 ${stat.color}`}>
                  <div className="flex items-start justify-between mb-3">
                    <stat.icon className="w-5 h-5" />
                    <span className={`text-xs font-semibold flex items-center gap-0.5 ${stat.change > 0 ? "text-green-400" : "text-red-400"}`}>
                      {stat.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(stat.change)}%
                    </span>
                  </div>
                  <div className="text-2xl font-black text-white mb-0.5">{stat.value}</div>
                  <div className="text-xs opacity-70">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent activity */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent games */}
              <div className="bg-[#111118] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">Jogos Recentes</h3>
                  <button
                    onClick={() => setActiveSection("games")}
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    Ver todos
                  </button>
                </div>
                <div className="space-y-3">
                  {GAMES.slice(0, 4).map((game) => (
                    <div key={game.id} className="flex items-center gap-3">
                      <img src={game.cover} alt="" className="w-10 h-14 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white line-clamp-1">{game.title}</p>
                        <p className="text-xs text-gray-500">{game.developer}</p>
                      </div>
                      <div className="flex gap-1.5">
                        <button className="p-1.5 bg-blue-900/20 text-blue-400 rounded-lg hover:bg-blue-900/40 transition-colors">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/40 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent users */}
              <div className="bg-[#111118] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">Usuários Recentes</h3>
                  <button
                    onClick={() => setActiveSection("users")}
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    Ver todos
                  </button>
                </div>
                <div className="space-y-3">
                  {USERS.map((user) => (
                    <div key={user.id} className="flex items-center gap-3">
                      <img src={user.avatar} alt="" className="w-9 h-9 rounded-full" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{user.nickname}</p>
                        <p className="text-xs text-gray-500">Nível {user.level} · {user.reviewsCount} reviews</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        user.reputation >= 95 ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"
                      }`}>
                        {user.reputation}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Marketplace overview */}
              <div className="bg-[#111118] border border-white/5 rounded-2xl p-5">
                <h3 className="font-bold text-white mb-4">Anúncios Ativos</h3>
                <div className="space-y-3">
                  {LISTINGS.filter((l) => l.active).map((listing) => (
                    <div key={listing.id} className="flex items-center gap-3">
                      <img src={listing.photos[0]} alt="" className="w-10 h-14 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white line-clamp-1">{listing.title}</p>
                        <p className="text-xs text-gray-500">{listing.userNickname} · {listing.city}/{listing.state}</p>
                      </div>
                      <div className="text-sm font-bold text-green-400">
                        R$ {listing.price.toFixed(2)}
                      </div>
                      <div className="flex gap-1.5">
                        <button className="p-1.5 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/40 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* News overview */}
              <div className="bg-[#111118] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">Últimas Notícias</h3>
                  <button className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300">
                    <Plus className="w-3 h-3" /> Nova
                  </button>
                </div>
                <div className="space-y-3">
                  {NEWS.map((article) => (
                    <div key={article.id} className="flex items-start gap-3">
                      <img src={article.cover} alt="" className="w-14 h-9 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white line-clamp-1">{article.title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Eye className="w-3 h-3" /> {article.views.toLocaleString("pt-BR")} views
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <button className="p-1.5 bg-blue-900/20 text-blue-400 rounded-lg">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection !== "dashboard" && (
          <div className="flex items-center justify-center h-64 text-center">
            <div>
              <div className="text-5xl mb-4">🚧</div>
              <h2 className="text-xl font-bold text-white mb-2 capitalize">{activeSection}</h2>
              <p className="text-gray-500 text-sm">Seção em desenvolvimento</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
