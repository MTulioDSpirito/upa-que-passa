"use client";

import { Construction } from "lucide-react";

interface NotBuiltTabProps {
  label: string;
}

export default function NotBuiltTab({ label }: NotBuiltTabProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <Construction className="w-10 h-10 text-gray-500 mb-4 animate-bounce" />
      <h2 className="text-lg font-bold text-white mb-1">{label}</h2>
      <p className="text-gray-500 text-sm max-w-xs">
        Essa seção ainda não foi construída. As demais abas (Jogos, Reviews, Usuários, Marketplace, Notícias) já mostram os dados reais do site.
      </p>
    </div>
  );
}
