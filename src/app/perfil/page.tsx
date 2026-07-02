"use client";

import Link from "next/link";
import { Star, MessageSquare, ShoppingBag, Trophy, Settings, Tv2, Play, Radio } from "lucide-react";
import { USERS, GAMES, getScoreColor } from "@/lib/data";

export default function PerfilPage() {
  const user = USERS[0];
  const favoriteGames = GAMES.filter((g) => user.favoriteGames.includes(g.id));

  const socialIcons: Record<string, React.ElementType> = { twitter: Tv2, youtube: Play, twitch: Radio };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden mb-6 h-48 bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "linear-gradient(45deg, #7c3aed 25%, transparent 25%), linear-gradient(-45deg, #3b82f6 25%, transparent 25%)",
            backgroundSize: "40px 40px",
          }}
        />
        <button className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur text-white text-xs rounded-lg hover:bg-black/60 transition-all">
          <Settings className="w-3.5 h-3.5" />
          Editar Perfil
        </button>
      </div>

      {/* Profile header */}
      <div className="flex gap-5 items-end -mt-16 mb-8 px-4">
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.nickname}
            className="w-24 h-24 rounded-2xl border-4 border-[#0a0a0f] bg-[#111118]"
          />
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-purple-600 rounded-lg flex items-center justify-center text-xs font-black text-white">
            {user.level}
          </div>
        </div>
        <div className="flex-1 pb-2">
          <h1 className="text-2xl font-black text-white">{user.nickname}</h1>
          <p className="text-gray-400 text-sm">{user.city}, {user.state} · Desde {new Date(user.joinedAt).getFullYear()}</p>
        </div>
        <div className="pb-2 flex gap-2">
          {user.socialLinks.map((link) => {
            const Icon = socialIcons[link.platform] || Star;
            return (
              <a key={link.platform} href={link.url} className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all">
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="bg-[#111118] border border-white/5 rounded-2xl p-5 mb-6">
          <p className="text-gray-300 text-sm leading-relaxed">{user.bio}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Star, label: "Reviews", value: user.reviewsCount, color: "text-yellow-400" },
          { icon: MessageSquare, label: "Comentários", value: user.commentsCount, color: "text-blue-400" },
          { icon: ShoppingBag, label: "Trocas", value: user.tradesCount, color: "text-green-400" },
          { icon: Trophy, label: "Reputação", value: `${user.reputation}%`, color: "text-purple-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#111118] border border-white/5 rounded-2xl p-5 text-center">
            <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Achievements */}
        <div className="bg-[#111118] border border-white/5 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Conquistas
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {user.achievements.map((ach) => (
              <div key={ach.id} className="bg-white/5 rounded-xl p-3 flex items-start gap-2">
                <span className="text-2xl">{ach.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{ach.name}</p>
                  <p className="text-xs text-gray-500">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Favorite games */}
        <div className="bg-[#111118] border border-white/5 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            Jogos Favoritos
          </h3>
          <div className="space-y-3">
            {favoriteGames.map((game) => (
              <Link key={game.id} href={`/jogos/${game.slug}`} className="flex items-center gap-3 group">
                <img src={game.cover} alt={game.title} className="w-10 h-14 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">{game.title}</p>
                  <p className="text-xs text-gray-500">{game.developer}</p>
                </div>
                <div className={`text-lg font-black ${getScoreColor(game.adminScore || 0)}`}>
                  {game.adminScore}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
