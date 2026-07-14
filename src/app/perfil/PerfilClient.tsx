"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, MessageSquare, ShoppingBag, Trophy, Settings } from "lucide-react";
import { GAMES, getScoreColor } from "@/lib/data";
import EditProfileModal, { type EditableProfile } from "./EditProfileModal";

interface PerfilUser {
  nickname: string;
  avatar: string | null;
  city: string | null;
  state: string | null;
  bio: string | null;
  console: string | null;
  createdAt: string;
}

export default function PerfilClient({
  user: initialUser,
  favoriteGameIds,
}: {
  user: PerfilUser;
  favoriteGameIds: string[];
}) {
  const [user, setUser] = useState(initialUser);
  const [editing, setEditing] = useState(false);
  const favoriteGames = GAMES.filter((g) => favoriteGameIds.includes(g.id));
  const avatar = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.nickname)}`;
  const location = [user.city, user.state].filter(Boolean).join(", ");

  function handleSaved(updated: EditableProfile) {
    setUser((prev) => ({ ...prev, ...updated }));
    setEditing(false);
    // O avatar/nickname também aparecem no Navbar/Sidebar (AccountAuthBlock), que lê a
    // sessão via useUserSession() uma vez no mount e não reage a mudanças locais aqui —
    // mesmo motivo pelo qual o logout já força um reload completo (ver Sidebar.tsx).
    window.location.reload();
  }

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
        <button
          onClick={() => setEditing(true)}
          className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur text-white text-xs rounded-lg hover:bg-black/60 transition-all"
        >
          <Settings className="w-3.5 h-3.5" />
          Editar Perfil
        </button>
      </div>

      {/* Profile header */}
      <div className="flex gap-5 items-end -mt-16 mb-8 px-4">
        <div className="relative">
          <img
            src={avatar}
            alt={user.nickname}
            className="w-24 h-24 rounded-2xl border-4 border-[#07070a] bg-[#0f0f18]"
          />
        </div>
        <div className="flex-1 pb-2">
          <h1 className="text-2xl font-black text-white">{user.nickname}</h1>
          <p className="text-gray-400 text-sm">
            {location || "Localização não informada"} · Desde {new Date(user.createdAt).getFullYear()}
          </p>
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5 mb-6">
          <p className="text-gray-300 text-sm leading-relaxed">{user.bio}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Star, label: "Reviews", value: 0, color: "text-yellow-400" },
          { icon: MessageSquare, label: "Comentários", value: 0, color: "text-[#0072ce]" },
          { icon: ShoppingBag, label: "Trocas", value: 0, color: "text-green-400" },
          { icon: Trophy, label: "Favoritos", value: favoriteGames.length, color: "text-purple-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5 text-center">
            <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Favorite games */}
      <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          Jogos Favoritos
        </h3>
        {favoriteGames.length === 0 ? (
          <p className="text-sm text-gray-500">
            Você ainda não favoritou nenhum jogo. Explore as{" "}
            <Link href="/reviews" className="text-purple-400 hover:text-purple-300">reviews</Link>.
          </p>
        ) : (
          <div className="space-y-3">
            {favoriteGames.map((game) => (
              <Link key={game.id} href={`/reviews/${game.slug}`} className="flex items-center gap-3 group">
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
        )}
      </div>

      {editing && (
        <EditProfileModal
          profile={{
            nickname: user.nickname,
            avatar: user.avatar,
            city: user.city,
            state: user.state,
            bio: user.bio,
            console: user.console,
          }}
          onClose={() => setEditing(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
