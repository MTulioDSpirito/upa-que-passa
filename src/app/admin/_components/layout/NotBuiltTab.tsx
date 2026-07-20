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
      <p className="text-gray-500 text-sm max-w-sm">
        Essa seção ainda está em construção. As abas ativas do painel (Dashboard, Reviews, Notícias, Ranking, Youtube, Lançamentos, Usuários e Comentários) já mostram dados reais.
      </p>
    </div>
  );
}
