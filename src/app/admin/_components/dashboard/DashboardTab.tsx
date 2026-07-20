"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Star, ShoppingBag, Users, MessageSquare, Eye, Plus, Edit, Trash2,
  TrendingUp, TrendingDown, Shield, Newspaper, ScrollText, ArrowRight
} from "lucide-react";
import { LISTINGS } from "@/lib/data";
import { Game } from "@/lib/types";
import { type AdminUserSession } from "../layout/AdminUserFooter";

interface DashboardTabProps {
  allGames: Game[];
  setActiveSection: (section: string) => void;
  user: AdminUserSession;
}

export default function DashboardTab({
  allGames,
  setActiveSection,
  user,
}: DashboardTabProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch stats
        const statsRes = await fetch("/api/admin/dashboard/stats");
        const statsData = statsRes.ok ? await statsRes.json() : null;
        if (statsData?.stats) {
          setStats(statsData.stats);
        }

        // Fetch news (needed for both DEVELOPER and COLABORADOR)
        const newsRes = await fetch("/api/admin/news");
        const newsData = newsRes.ok ? await newsRes.json() : null;
        if (newsData?.news) {
          setNews(newsData.news.slice(0, 4));
        }

        if (user.role === "DEVELOPER") {
          // Fetch recent users
          const usersRes = await fetch("/api/admin/users?limit=4");
          const usersData = usersRes.ok ? await usersRes.json() : null;
          if (usersData?.users) {
            setUsers(usersData.users);
          }
        } else {
          // Fetch pending agent suggestions
          const entregasRes = await fetch("/api/admin/entregas");
          const entregasData = entregasRes.ok ? await entregasRes.json() : null;
          if (entregasData?.pendentes) {
            setSuggestions(entregasData.pendentes.slice(0, 4));
          }
        }
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.role]);

  // Construct dynamic stats list depending on role
  const statsItems = [];
  if (user.role === "DEVELOPER") {
    statsItems.push(
      {
        label: "Usuários Registrados",
        value: stats ? stats.users.value.toLocaleString("pt-BR") : "...",
        change: stats ? stats.users.change : 0,
        icon: Users,
        color: "text-blue-400 bg-blue-900/10 border-blue-800/30",
        description: "Controle de acessos do site",
      },
      {
        label: "Membros da Equipe",
        value: stats ? stats.team.value.toString() : "...",
        change: 0,
        icon: Shield,
        color: "text-purple-400 bg-purple-900/10 border-purple-800/30",
        description: "Colaboradores & Developers",
      },
      {
        label: "Reviews Publicadas",
        value: stats ? stats.reviews.value.toString() : "...",
        change: stats ? stats.reviews.change : 0,
        icon: Star,
        color: "text-yellow-400 bg-yellow-900/10 border-yellow-800/30",
        description: "Análises de jogos do catálogo",
      },
      {
        label: "Anúncios Ativos",
        value: stats ? stats.listings.value.toString() : "...",
        change: stats ? stats.listings.change : 0,
        icon: ShoppingBag,
        color: "text-emerald-400 bg-emerald-900/10 border-emerald-800/30",
        description: "Itens ativos no Marketplace",
      },
      {
        label: "Comentários no Site",
        value: stats ? stats.comments.value.toLocaleString("pt-BR") : "...",
        change: stats ? stats.comments.change : 0,
        icon: MessageSquare,
        color: "text-pink-400 bg-pink-900/10 border-pink-800/30",
        description: `Hoje: +${stats?.comments.today || 0}`,
      },
      {
        label: "Visualizações Notícias",
        value: stats ? stats.news.totalViews.toLocaleString("pt-BR") : "...",
        change: stats ? stats.news.change : 0,
        icon: Eye,
        color: "text-cyan-400 bg-cyan-900/10 border-cyan-800/30",
        description: "Visualizações gerais de matérias",
      }
    );
  } else {
    // For COLABORADOR
    statsItems.push(
      {
        label: "Reviews Publicadas",
        value: stats ? stats.reviews.value.toString() : "...",
        change: stats ? stats.reviews.change : 0,
        icon: Star,
        color: "text-yellow-400 bg-yellow-900/10 border-yellow-800/30",
        description: "Minhas revisões de catálogo",
      },
      {
        label: "Últimas Notícias",
        value: stats ? stats.news.value.toString() : "...",
        change: stats ? stats.news.change : 0,
        icon: Newspaper,
        color: "text-blue-400 bg-blue-900/10 border-blue-800/30",
        description: "Matérias publicadas no portal",
      },
      {
        label: "Sugestões de Agentes",
        value: stats ? stats.pendingSuggestions.value.toString() : "...",
        change: 0,
        icon: ScrollText,
        color: "text-orange-400 bg-orange-900/10 border-orange-800/30",
        description: "Rascunhos aguardando revisão",
      },
      {
        label: "Comentários Hoje",
        value: stats ? stats.comments.today.toString() : "...",
        change: stats ? stats.comments.change : 0,
        icon: MessageSquare,
        color: "text-pink-400 bg-pink-900/10 border-pink-800/30",
        description: "Respostas e interações da comunidade",
      }
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            Dashboard 
            <span className="text-xs font-normal px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20">
              {user.role === "DEVELOPER" ? "Acesso Developer" : "Painel Editorial"}
            </span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Olá, <strong className="text-white">{user.name}</strong>. Bem-vindo de volta ao portal de administração.
          </p>
        </div>

        {user.role === "COLABORADOR" && (
          <Link
            href="/admin/sugestoes"
            className="btn-press flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-purple-950/20"
          >
            <ScrollText className="w-4 h-4" />
            Revisar Entregas
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsItems.map((stat) => (
          <div
            key={stat.label}
            className={`bg-[#0b0b12]/60 backdrop-blur-md border rounded-2xl p-5 hover:translate-y-[-2px] transition-all duration-300 ${stat.color}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <stat.icon className="w-5 h-5" />
              </div>
              {stat.change !== 0 && (
                <span className={`text-xs font-bold flex items-center gap-0.5 px-2 py-0.5 rounded-full ${
                  stat.change > 0 ? "bg-emerald-950/30 text-emerald-400" : "bg-rose-950/30 text-rose-400"
                }`}>
                  {stat.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(stat.change)}%
                </span>
              )}
            </div>
            <div className="text-3xl font-black text-white tracking-tight mb-1">
              {loading ? (
                <div className="h-8 w-16 bg-white/5 rounded-md animate-pulse" />
              ) : (
                stat.value
              )}
            </div>
            <div className="text-sm font-bold text-white/95">{stat.label}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.description}</div>
          </div>
        ))}
      </div>

      {/* Recent activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Role dependent */}
        {user.role === "DEVELOPER" ? (
          /* Recent Users for DEVELOPER */
          <div className="bg-[#0b0b12]/40 border border-white/5 rounded-2xl p-6 flex flex-col h-[380px]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-black text-white text-lg">Usuários Recentes</h3>
                <p className="text-xs text-gray-400">Últimos registros no portal</p>
              </div>
              <button
                onClick={() => setActiveSection("users")}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-purple-950/20"
              >
                Ver todos
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-9 h-9 rounded-full bg-white/5" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/5 rounded w-1/3" />
                      <div className="h-2 bg-white/5 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : users.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-10">Nenhum usuário registrado.</p>
              ) : (
                users.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-white/[0.02] rounded-xl transition-all">
                    <img
                      src={item.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.nickname}`}
                      alt={item.nickname}
                      className="w-9 h-9 rounded-full bg-zinc-800 border border-white/5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{item.nickname}</p>
                      <p className="text-xs text-gray-500 truncate">{item.email}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      item.active ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/10" : "bg-rose-950/40 text-rose-400 border border-rose-500/10"
                    }`}>
                      {item.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* Agent Suggestions for COLABORADOR */
          <div className="bg-[#0b0b12]/40 border border-white/5 rounded-2xl p-6 flex flex-col h-[380px]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-black text-white text-lg">Sugestões de Agentes</h3>
                <p className="text-xs text-gray-400">Rascunhos pendentes aguardando aprovação</p>
              </div>
              <Link
                href="/admin/sugestoes"
                className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-purple-950/20"
              >
                Painel Completo
              </Link>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-lg bg-white/5" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/5 rounded w-2/3" />
                      <div className="h-2 bg-white/5 rounded w-1/4" />
                    </div>
                  </div>
                ))
              ) : suggestions.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-center py-10">
                  <ScrollText className="w-10 h-10 text-gray-600 mb-2" />
                  <p className="text-sm text-gray-500">Tudo limpo! Nenhuma sugestão pendente.</p>
                </div>
              ) : (
                suggestions.map((sug) => (
                  <div key={sug.id} className="flex items-center gap-3 p-3 hover:bg-white/[0.02] border border-white/[0.01] rounded-xl transition-all">
                    <div className="w-10 h-10 rounded-xl bg-purple-950/30 border border-purple-500/10 flex items-center justify-center flex-shrink-0 text-purple-400 text-xs font-bold">
                      {sug.tipo === "LANCAMENTO" ? "LAN" : sug.tipo === "REVIEW" ? "REV" : "NOT"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{sug.titulo}</p>
                      <p className="text-xs text-gray-500 truncate">Agente: {sug.criador.toLowerCase().replace("_", " ")}</p>
                    </div>
                    <Link
                      href="/admin/sugestoes"
                      className="p-1.5 hover:bg-purple-950/40 text-purple-400 rounded-lg border border-transparent hover:border-purple-500/20 transition-all"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Right Column: Active Listings or News depending on user */}
        {user.role === "DEVELOPER" ? (
          /* Active Listings for DEVELOPER */
          <div className="bg-[#0b0b12]/40 border border-white/5 rounded-2xl p-6 flex flex-col h-[380px]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-black text-white text-lg">Anúncios Ativos</h3>
                <p className="text-xs text-gray-400">Atividades no Marketplace</p>
              </div>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              {LISTINGS.filter((l) => l.active).slice(0, 4).map((listing) => (
                <div key={listing.id} className="flex items-center gap-3 p-2 hover:bg-white/[0.02] rounded-xl transition-all">
                  <img
                    src={listing.photos[0]}
                    alt={listing.title}
                    className="w-9 h-12 object-cover rounded-lg bg-zinc-800 border border-white/5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{listing.title}</p>
                    <p className="text-xs text-gray-500 truncate">{listing.userNickname} · {listing.city}/{listing.state}</p>
                  </div>
                  <div className="text-sm font-black text-emerald-400 flex-shrink-0">
                    R$ {listing.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* News list for COLABORADOR */
          <div className="bg-[#0b0b12]/40 border border-white/5 rounded-2xl p-6 flex flex-col h-[380px]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-black text-white text-lg">Últimas Notícias</h3>
                <p className="text-xs text-gray-400">Publicações ativas no portal</p>
              </div>
              <button
                onClick={() => setActiveSection("news")}
                className="flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-purple-950/20"
              >
                <Plus className="w-3.5 h-3.5" /> Nova
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-14 h-9 rounded-lg bg-white/5" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/5 rounded w-2/3" />
                      <div className="h-2 bg-white/5 rounded w-1/4" />
                    </div>
                  </div>
                ))
              ) : news.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-10">Nenhuma notícia publicada.</p>
              ) : (
                news.map((article) => (
                  <div key={article.id} className="flex items-center gap-3 p-2 hover:bg-white/[0.02] rounded-xl transition-all">
                    <img
                      src={article.cover}
                      alt={article.title}
                      className="w-14 h-9 object-cover rounded-lg bg-zinc-800 border border-white/5 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{article.title}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Eye className="w-3.5 h-3.5" /> {article.views.toLocaleString("pt-BR")} views
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveSection("news")}
                      className="p-1.5 hover:bg-purple-950/40 text-purple-400 rounded-lg border border-transparent hover:border-purple-500/20 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* news overview row for DEVELOPER */}
      {user.role === "DEVELOPER" && (
        <div className="bg-[#0b0b12]/40 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-white text-lg">Últimas Notícias</h3>
              <p className="text-xs text-gray-400">Publicações ativas no portal</p>
            </div>
            <button
              onClick={() => setActiveSection("news")}
              className="flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-purple-950/20"
            >
              <Plus className="w-3.5 h-3.5" /> Nova
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-14 h-9 rounded-lg bg-white/5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/5 rounded w-2/3" />
                  </div>
                </div>
              ))
            ) : news.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-10 col-span-2">Nenhuma notícia publicada.</p>
            ) : (
              news.map((article) => (
                <div key={article.id} className="flex items-center gap-3 p-3 hover:bg-white/[0.02] border border-white/[0.01] rounded-xl transition-all">
                  <img
                    src={article.cover}
                    alt={article.title}
                    className="w-14 h-9 object-cover rounded-lg bg-zinc-800 border border-white/5 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{article.title}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Eye className="w-3.5 h-3.5" /> {article.views.toLocaleString("pt-BR")} views
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSection("news")}
                    className="p-1.5 hover:bg-purple-950/40 text-purple-400 rounded-lg border border-transparent hover:border-purple-500/20 transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
