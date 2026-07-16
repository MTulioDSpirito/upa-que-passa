"use client";

import { useEffect, useState } from "react";
import {
  Star, ShoppingBag, Users, MessageSquare, Eye, Plus, Edit, Trash2, TrendingUp, TrendingDown
} from "lucide-react";
import { LISTINGS } from "@/lib/data";
import { Game } from "@/lib/types";

const STATS = [
  { label: "Usuários", value: "12.4k", change: +8.2, icon: Users, color: "text-[#0072ce] bg-blue-900/20 border-blue-800/20" },
  { label: "Reviews Publicadas", value: "1.8k", change: +12.5, icon: Star, color: "text-yellow-400 bg-yellow-900/20 border-yellow-800/20" },
  { label: "Anúncios Ativos", value: "324", change: +18.7, icon: ShoppingBag, color: "text-green-400 bg-green-900/20 border-green-800/20" },
  { label: "Comentários Hoje", value: "284", change: -3.4, icon: MessageSquare, color: "text-pink-400 bg-pink-900/20 border-pink-800/20" },
  { label: "Visitas Hoje", value: "18.2k", change: +5.6, icon: Eye, color: "text-cyan-400 bg-cyan-900/20 border-cyan-800/20" },
];

interface DashboardTabProps {
  allGames: Game[];
  setActiveSection: (section: string) => void;
}

export default function DashboardTab({
  allGames,
  setActiveSection,
}: DashboardTabProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.users) {
          setUsers(data.users.slice(0, 4));
        }
      })
      .catch(() => {});

    fetch("/api/admin/news")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.news) {
          setNews(data.news.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm">Visão geral do portal</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {STATS.map((stat) => (
          <div key={stat.label} className={`bg-[#0f0f18] border rounded-2xl p-5 ${stat.color}`}>
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

        {/* Recent users */}
        <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5">
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
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nickname}`} alt="" className="w-9 h-9 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{user.nickname}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  user.active ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                }`}>
                  {user.active ? "Ativo" : "Inativo"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Marketplace overview */}
        <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5">
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
                  <button className="btn-press p-1.5 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/40 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* News overview */}
        <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Últimas Notícias</h3>
            <button
              onClick={() => setActiveSection("news")}
              className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300"
            >
              <Plus className="w-3 h-3" /> Nova
            </button>
          </div>
          <div className="space-y-3">
            {news.map((article) => (
              <div key={article.id} className="flex items-start gap-3">
                <img src={article.cover} alt="" className="w-14 h-9 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white line-clamp-1">{article.title}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Eye className="w-3 h-3" /> {article.views.toLocaleString("pt-BR")} views
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button className="p-1.5 bg-blue-900/20 text-[#0072ce] rounded-lg">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
