"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Plus, MapPin, Eye, Heart, ArrowUpDown, Package } from "lucide-react";
import { LISTINGS, formatPrice, formatDate } from "@/lib/data";
import { useAllGames } from "@/hooks/useAllGames";

const CONDITIONS = ["Todas", "lacrado", "como novo", "bom estado", "regular"];
const STATES_BR = ["Todos", "SP", "RJ", "MG", "RS", "PR", "SC", "BA", "GO", "CE", "PE"];

export default function MarketplacePage() {
  const [GAMES] = useAllGames();
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("Todas");
  const [state, setState] = useState("Todos");
  const [onlyTrades, setOnlyTrades] = useState(false);
  const [sort, setSort] = useState("recent");

  const filtered = LISTINGS
    .filter((l) => l.active)
    .filter((l) => {
      const matchSearch = l.title.toLowerCase().includes(search.toLowerCase());
      const matchCondition = condition === "Todas" || l.condition === condition;
      const matchState = state === "Todos" || l.state === state;
      const matchTrade = !onlyTrades || l.acceptsTrade;
      return matchSearch && matchCondition && matchState && matchTrade;
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "recent") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Marketplace</h1>
          <p className="text-gray-400">Compre, venda e troque jogos de PS5 com segurança</p>
        </div>
        <Link
          href="/marketplace/vender"
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-900/30"
        >
          <Plus className="w-5 h-5" />
          Anunciar Jogo
        </Link>
      </div>

      {/* Category pills */}
      <div className="flex gap-3 flex-wrap mb-6">
        {[
          { icon: "🛒", label: "Comprar", href: "/marketplace/comprar" },
          { icon: "💰", label: "Vender", href: "/marketplace/vender" },
          { icon: "🔄", label: "Trocar", href: "/marketplace/trocas" },
          { icon: "📦", label: "Lacrados", href: "#" },
          { icon: "🎮", label: "Colecionáveis", href: "#" },
        ].map((cat) => (
          <Link
            key={cat.label}
            href={cat.href}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0f0f18] border border-white/10 hover:border-purple-500/40 text-gray-300 hover:text-white rounded-xl text-sm font-medium transition-all"
          >
            <span>{cat.icon}</span>
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-4 mb-6 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar jogo..."
            className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
          />
        </div>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none"
        >
          {CONDITIONS.map((c) => (
            <option key={c} value={c} className="bg-[#1a1a2e]">
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none"
        >
          {STATES_BR.map((s) => (
            <option key={s} value={s} className="bg-[#1a1a2e]">
              {s === "Todos" ? "Todo o Brasil" : s}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none"
        >
          <option value="recent" className="bg-[#1a1a2e]">Mais Recentes</option>
          <option value="price-asc" className="bg-[#1a1a2e]">Menor Preço</option>
          <option value="price-desc" className="bg-[#1a1a2e]">Maior Preço</option>
        </select>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyTrades}
            onChange={(e) => setOnlyTrades(e.target.checked)}
            className="w-4 h-4 accent-purple-500"
          />
          <span className="text-sm text-gray-400">Só trocas</span>
        </label>
      </div>

      <div className="text-sm text-gray-500 mb-5">{filtered.length} anúncios encontrados</div>

      {/* Listings Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((listing) => {
          const game = GAMES.find((g) => g.id === listing.gameId);
          return (
            <div key={listing.id} className="group bg-[#0f0f18] border border-white/5 rounded-2xl overflow-hidden hover:border-green-500/20 transition-all">
              {/* Photo */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={listing.photos[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    listing.condition === "lacrado" ? "bg-green-600 text-white" :
                    listing.condition === "como novo" ? "bg-[#0072ce] text-white" :
                    listing.condition === "bom estado" ? "bg-yellow-600 text-black" :
                    "bg-gray-600 text-white"
                  }`}>
                    {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}
                  </span>
                  {listing.acceptsTrade && (
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-purple-600 text-white">
                      🔄 Troca
                    </span>
                  )}
                </div>

                {/* Favorite */}
                <button className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-white mb-1 line-clamp-2 group-hover:text-green-400 transition-colors">
                  {listing.title}
                </h3>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{listing.description}</p>

                {/* Payment badges */}
                <div className="flex gap-1.5 mb-3">
                  {listing.paymentMethods.map((m) => (
                    <span key={m} className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-full capitalize">
                      {m === "pix" ? "PIX" : m === "cartao" ? "Cartão" : m}
                    </span>
                  ))}
                  {listing.shipping && (
                    <span className="text-xs bg-blue-900/30 text-[#0072ce] px-2 py-0.5 rounded-full">Frete</span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-green-400">{formatPrice(listing.price)}</span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    {listing.city} / {listing.state}
                  </div>
                </div>

                {/* Seller info */}
                <div className="flex items-center gap-2 py-3 border-t border-white/5 mb-3">
                  <img src={listing.userAvatar} alt="" className="w-7 h-7 rounded-full" />
                  <span className="text-xs text-gray-400 flex-1">{listing.userNickname}</span>
                  <span className="text-xs text-yellow-400 font-semibold">⭐ {listing.userReputation}%</span>
                </div>

                {/* Stats + CTA */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {listing.views}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {listing.favorites}
                  </span>
                  <Link
                    href={`/marketplace/${listing.id}`}
                    className="ml-auto px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-xl transition-all"
                  >
                    Ver Anúncio
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-xl">Nenhum anúncio encontrado</p>
          <p className="text-sm mt-2">Tente outros filtros ou seja o primeiro a anunciar!</p>
        </div>
      )}
    </div>
  );
}
