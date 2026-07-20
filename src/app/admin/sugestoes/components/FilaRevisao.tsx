import { ListTodo } from "lucide-react";
import { type Sugestao } from "../SugestoesClient";

interface FilaRevisaoProps {
  pendentes: Sugestao[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  cancelEdit: () => void;
  getSugestaoTipoLabel: (tipo: string) => string;
}

export default function FilaRevisao({
  pendentes,
  selectedId,
  setSelectedId,
  cancelEdit,
  getSugestaoTipoLabel,
}: FilaRevisaoProps) {
  return (
    <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-4 flex flex-col gap-4 sticky top-20">
      <div className="flex justify-between items-center pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <ListTodo className="w-4 h-4 text-purple-400" />
          <h2 className="font-bold text-white text-sm">Fila de Revisão</h2>
        </div>
        <span className="text-xs text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-full font-semibold">
          {pendentes.length} {pendentes.length === 1 ? 'item' : 'itens'}
        </span>
      </div>
      
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {pendentes.map((sug) => {
          const isActive = sug.id === selectedId;
          return (
            <button
              key={sug.id}
              onClick={() => {
                setSelectedId(sug.id);
                cancelEdit();
              }}
              className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                isActive
                  ? "bg-purple-600/10 border-purple-500/50 text-white"
                  : "bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/5 hover:border-white/10 hover:text-white"
              }`}
            >
              <div className="flex justify-between items-start gap-2 mb-1.5">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  sug.tipo === 'NOTICIA' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/10' :
                  sug.tipo === 'REVIEW' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/10' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/10'
                }`}>
                  {getSugestaoTipoLabel(sug.tipo)}
                </span>
                <span className="text-[9px] text-gray-500 truncate max-w-[120px]">{sug.criador}</span>
              </div>
              <h4 className="text-xs font-bold line-clamp-2 leading-snug">{sug.titulo}</h4>
            </button>
          );
        })}
      </div>
    </div>
  );
}
