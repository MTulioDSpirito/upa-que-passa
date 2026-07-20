"use client";

import React from "react";
import LoadingSpinner from "./LoadingSpinner";

interface LoadingScreenProps {
  label?: string;
}

export default function LoadingScreen({ label = "Carregando o portal..." }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07070a] text-white select-none overflow-hidden">
      {/* PlayStation-like ambient glowing background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-radial from-purple-600/20 via-blue-600/10 to-transparent blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Brand Logo with a nice neon glow border */}
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-purple-600 bg-[#0f0f18] shadow-[0_0_25px_rgba(124,58,237,0.4)]">
          <img
            src="/logo_upa_que_passa.jpg"
            alt="Upa que Passa Logo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Brand Name */}
        <div className="text-center">
          <h2 className="font-display text-2xl tracking-widest font-black text-glow-purple flex items-center justify-center gap-1.5">
            <span className="text-white">UPA QUE</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">PASSA</span>
          </h2>
          <p className="text-[10px] font-mono tracking-widest text-gray-500 uppercase mt-1">
            PlayStation 5 & Games Portal
          </p>
        </div>

        {/* Premium Spinner */}
        <LoadingSpinner size="lg" label={label} className="mt-4" />
      </div>
    </div>
  );
}
