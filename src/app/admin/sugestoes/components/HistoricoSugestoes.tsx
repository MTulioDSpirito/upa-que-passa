import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type Sugestao } from "../SugestoesClient";

interface HistoricoSugestoesProps {
  aprovados: Sugestao[];
  rejeitados: Sugestao[];
  getSugestaoTipoLabel: (tipo: string) => string;
}

const ITEMS_PER_PAGE = 5;

export default function HistoricoSugestoes({
  aprovados,
  rejeitados,
  getSugestaoTipoLabel,
}: HistoricoSugestoesProps) {
  const [pageAprovados, setPageAprovados] = useState(1);
  const [pageRejeitados, setPageRejeitados] = useState(1);

  // Paginação Aprovados
  const totalAprovadosPages = Math.ceil(aprovados.length / ITEMS_PER_PAGE);
  const indexAprovadosStart = (pageAprovados - 1) * ITEMS_PER_PAGE;
  const currentAprovados = aprovados.slice(indexAprovadosStart, indexAprovadosStart + ITEMS_PER_PAGE);

  // Paginação Rejeitados
  const totalRejeitadosPages = Math.ceil(rejeitados.length / ITEMS_PER_PAGE);
  const indexRejeitadosStart = (pageRejeitados - 1) * ITEMS_PER_PAGE;
  const currentRejeitados = rejeitados.slice(indexRejeitadosStart, indexRejeitadosStart + ITEMS_PER_PAGE);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Coluna Aprovados */}
      <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5 flex flex-col justify-between min-h-[350px]">
        <div>
          <h3 className="font-bold text-white mb-3 flex justify-between items-center">
            <span>Aprovados ({aprovados.length})</span>
            {totalAprovadosPages > 1 && (
              <span className="text-xs text-gray-500 font-normal">
                Pág. {pageAprovados} de {totalAprovadosPages}
              </span>
            )}
          </h3>
          <div className="space-y-3">
            {currentAprovados.map((s) => (
              <div key={s.id} className="text-sm border-b border-white/[0.02] pb-2 last:border-0 last:pb-0">
                <p className="truncate font-semibold text-gray-300">
                  {s.titulo} <span className="text-xs text-gray-500">({getSugestaoTipoLabel(s.tipo)})</span>
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Aprovado por <span className="text-gray-400">{s.revisadoPor?.name || "Sistema"}</span> em {new Date(s.updatedAt).toLocaleString("pt-BR")}
                </p>
              </div>
            ))}
            {aprovados.length === 0 && (
              <p className="text-sm text-gray-500 italic py-4 text-center">Nenhum item aprovado ainda.</p>
            )}
          </div>
        </div>

        {totalAprovadosPages > 1 && (
          <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-white/5">
            <button
              onClick={() => setPageAprovados((prev) => Math.max(prev - 1, 1))}
              disabled={pageAprovados === 1}
              className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPageAprovados((prev) => Math.min(prev + 1, totalAprovadosPages))}
              disabled={pageAprovados === totalAprovadosPages}
              className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-white/10 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Coluna Rejeitados */}
      <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5 flex flex-col justify-between min-h-[350px]">
        <div>
          <h3 className="font-bold text-white mb-3 flex justify-between items-center">
            <span>Rejeitados ({rejeitados.length})</span>
            {totalRejeitadosPages > 1 && (
              <span className="text-xs text-gray-500 font-normal">
                Pág. {pageRejeitados} de {totalRejeitadosPages}
              </span>
            )}
          </h3>
          <div className="space-y-3">
            {currentRejeitados.map((s) => (
              <div key={s.id} className="text-sm border-b border-white/[0.02] pb-2 last:border-0 last:pb-0">
                <p className="truncate font-semibold text-gray-300">
                  {s.titulo} <span className="text-xs text-gray-500">({getSugestaoTipoLabel(s.tipo)})</span>
                </p>
                {s.motivoRejeicao && <p className="text-xs text-red-400/80 mt-0.5 font-medium">Motivo: {s.motivoRejeicao}</p>}
                <p className="text-[10px] text-gray-500 mt-1">
                  Rejeitado por <span className="text-gray-400">{s.revisadoPor?.name || "Sistema"}</span> em {new Date(s.updatedAt).toLocaleString("pt-BR")}
                </p>
              </div>
            ))}
            {rejeitados.length === 0 && (
              <p className="text-sm text-gray-500 italic py-4 text-center">Nenhum item rejeitado ainda.</p>
            )}
          </div>
        </div>

        {totalRejeitadosPages > 1 && (
          <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-white/5">
            <button
              onClick={() => setPageRejeitados((prev) => Math.max(prev - 1, 1))}
              disabled={pageRejeitados === 1}
              className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPageRejeitados((prev) => Math.min(prev + 1, totalRejeitadosPages))}
              disabled={pageRejeitados === totalRejeitadosPages}
              className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-white/10 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
