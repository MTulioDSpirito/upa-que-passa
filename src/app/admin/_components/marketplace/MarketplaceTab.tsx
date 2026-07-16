"use client";

import { Trash2 } from "lucide-react";
import { LISTINGS, formatPrice } from "@/lib/data";

export default function MarketplaceTab() {
  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6">Anúncios ({LISTINGS.length})</h1>
      <div className="bg-[#0f0f18] border border-white/5 rounded-2xl divide-y divide-white/5">
        {LISTINGS.map((listing) => (
          <div key={listing.id} className="flex items-center gap-4 p-4">
            <img src={listing.photos[0]} alt="" className="w-10 h-14 object-cover rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white line-clamp-1">{listing.title}</p>
              <p className="text-xs text-gray-500">{listing.userNickname} · {listing.city}/{listing.state}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
              listing.active ? "bg-green-900/30 text-green-400" : "bg-gray-800 text-gray-500"
            }`}>
              {listing.active ? "Ativo" : "Inativo"}
            </span>
            <div className="text-sm font-black text-green-400 flex-shrink-0">{formatPrice(listing.price)}</div>
            <button className="btn-press p-1.5 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/40 transition-colors flex-shrink-0">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
