"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, MessageSquare, Heart } from "lucide-react";

export function PhotoGallery({ photos, title }: { photos: string[]; title: string }) {
  const [photoIdx, setPhotoIdx] = useState(0);

  return (
    <div className="bg-[#0f0f18] border border-white/5 rounded-2xl overflow-hidden">
      <div className="relative aspect-video">
        <img
          src={photos[photoIdx]}
          alt={title}
          className="w-full h-full object-contain bg-black/40"
        />
        {photos.length > 1 && (
          <>
            <button
              onClick={() => setPhotoIdx(Math.max(0, photoIdx - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 text-white rounded-full flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPhotoIdx(Math.min(photos.length - 1, photoIdx + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 text-white rounded-full flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
      {photos.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setPhotoIdx(i)}
              className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                i === photoIdx ? "border-green-500" : "border-white/10"
              }`}
            >
              <img src={photo} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ContactBox() {
  const [showContact, setShowContact] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowContact(!showContact)}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold rounded-xl transition-all mb-3"
      >
        <MessageSquare className="w-5 h-5" />
        Tenho Interesse
      </button>

      {showContact && (
        <div className="bg-white/5 rounded-xl p-4 mb-3 text-sm">
          <p className="text-gray-300 mb-3">Escolha como quer entrar em contato:</p>
          <button className="w-full py-2.5 mb-2 bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 rounded-xl font-semibold text-sm hover:bg-[#25D366]/30 transition-all">
            💬 Conversar pelo WhatsApp
          </button>
          <button className="w-full py-2.5 bg-purple-600/20 text-purple-300 border border-purple-600/30 rounded-xl font-semibold text-sm hover:bg-purple-600/30 transition-all">
            💬 Chat Interno
          </button>
        </div>
      )}

      <button className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all">
        <Heart className="w-4 h-4" />
        Salvar Anúncio
      </button>
    </>
  );
}
