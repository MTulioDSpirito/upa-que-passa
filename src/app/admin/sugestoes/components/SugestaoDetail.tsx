import { Edit2, Check, X, ExternalLink } from "lucide-react";
import { type Sugestao } from "../SugestoesClient";

interface SugestaoDetailProps {
  sugestao: Sugestao;
  busy: string | null;
  startEdit: (sugestao: Sugestao) => void;
  handleAprovar: (id: string) => void;
  rejectingId: string | null;
  setRejectingId: (id: string | null) => void;
  motivo: string;
  setMotivo: (val: string) => void;
  handleRejeitar: (id: string) => void;
  getSugestaoTipoLabel: (tipo: string) => string;
}

export default function SugestaoDetail({
  sugestao,
  busy,
  startEdit,
  handleAprovar,
  rejectingId,
  setRejectingId,
  motivo,
  setMotivo,
  handleRejeitar,
  getSugestaoTipoLabel,
}: SugestaoDetailProps) {
  return (
    <div>
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-3 pb-3 border-b border-white/5">
        <div>
          <div className="flex gap-2 items-center">
            <span className="text-xs font-semibold text-purple-400 bg-purple-900/20 border border-purple-800/20 rounded-full px-2 py-0.5">
              {getSugestaoTipoLabel(sugestao.tipo)}
            </span>
            <span className="text-[10px] text-gray-500">
              De: {sugestao.criador} | Criado em: {new Date(sugestao.createdAt).toLocaleString("pt-BR")}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mt-2">{sugestao.titulo}</h3>
          <p className="text-xs text-gray-500 mt-0.5 font-mono">Slug: {sugestao.slug}</p>
        </div>

        <div className="flex gap-2 flex-wrap md:flex-nowrap">
          <button
            onClick={() => startEdit(sugestao)}
            disabled={busy === sugestao.id}
            className="btn-press flex items-center gap-1.5 px-3 py-2 bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            <Edit2 className="w-4 h-4" /> Editar Rascunho
          </button>
          <button
            onClick={() => handleAprovar(sugestao.id)}
            disabled={busy === sugestao.id}
            className="btn-press flex items-center gap-1.5 px-3 py-2 bg-green-600/20 text-green-400 border border-green-700/30 hover:bg-green-600/30 text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            <Check className="w-4 h-4" /> Aprovar
          </button>
          <button
            onClick={() => setRejectingId(rejectingId === sugestao.id ? null : sugestao.id)}
            disabled={busy === sugestao.id}
            className="btn-press flex items-center gap-1.5 px-3 py-2 bg-red-600/20 text-red-400 border border-red-700/30 hover:bg-red-600/30 text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            <X className="w-4 h-4" /> Rejeitar
          </button>
        </div>
      </div>

      {/* Exibição detalhada do conteúdo do Payload */}
      <div className="grid md:grid-cols-[1fr_250px] gap-6 mt-4">
        <div className="space-y-4">
          {/* Resumo */}
          {sugestao.payload?.excerpt && (
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Resumo</h4>
              <p className="text-sm text-gray-300 italic">{sugestao.payload.excerpt}</p>
            </div>
          )}

          {/* Corpo/Texto Principal */}
          {(sugestao.payload?.body || sugestao.payload?.content) && (
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Texto Principal</h4>
              <p className="text-sm text-gray-400 whitespace-pre-wrap leading-relaxed">
                {sugestao.payload.body || sugestao.payload.content}
              </p>
            </div>
          )}

          {/* Prós e Contras */}
          {sugestao.tipo === "REVIEW" && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1">Prós</h4>
                {Array.isArray(sugestao.payload?.pros) && sugestao.payload.pros.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-400 space-y-0.5">
                    {sugestao.payload.pros.map((pro: string, i: number) => (
                      <li key={i}>{pro}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500">Nenhum pró listado.</p>
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Contras</h4>
                {Array.isArray(sugestao.payload?.cons) && sugestao.payload.cons.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-400 space-y-0.5">
                    {sugestao.payload.cons.map((con: string, i: number) => (
                      <li key={i}>{con}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500">Nenhum contra listado.</p>
                )}
              </div>
            </div>
          )}

          {/* Fontes */}
          {sugestao.fontes && sugestao.fontes.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Fontes de Referência</h4>
              <div className="flex flex-wrap gap-2">
                {sugestao.fontes.map((url) => {
                  let hostname = url;
                  try {
                    hostname = new URL(url).hostname;
                  } catch (e) {
                    // Fallback se não for uma URL válida
                  }
                  return (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-neon hover:text-blue-300 bg-blue-900/10 border border-blue-800/20 rounded-lg px-2 py-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {hostname}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Barra lateral do Rascunho */}
        <div className="space-y-4 bg-white/[0.02] border border-white/5 rounded-xl p-4 self-start">
          {/* Imagem de Capa */}
          {sugestao.payload?.cover && (
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Capa</span>
              <img
                src={sugestao.payload.cover}
                alt="Capa"
                className="w-full h-28 object-cover rounded-lg border border-white/10"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400";
                }}
              />
              {sugestao.payload?.imageCredits && (
                <p className="text-[9px] text-gray-500 mt-1 italic line-clamp-1">
                  {sugestao.payload.imageCredits}
                </p>
              )}
            </div>
          )}

          {/* Informações adicionais do review */}
          {sugestao.tipo === "REVIEW" && (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Nota Geral:</span>
                <span className="font-bold text-white bg-purple-500/20 px-2 py-0.5 rounded">{sugestao.payload?.overallScore || "8.0"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Desenvolvedora:</span>
                <span className="font-bold text-white">{sugestao.payload?.gameDetails?.developer || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Preço:</span>
                <span className="font-bold text-white">R$ {sugestao.payload?.gameDetails?.price || "0,00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Data:</span>
                <span className="font-bold text-white">{sugestao.payload?.gameDetails?.releaseDate || "-"}</span>
              </div>
            </div>
          )}

          {/* Informações adicionais do lançamento */}
          {sugestao.tipo === "LANCAMENTO" && (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Desenvolvedora:</span>
                <span className="font-bold text-white">{sugestao.payload?.developer || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Data:</span>
                <span className="font-bold text-white">{sugestao.payload?.releaseDate || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Preço:</span>
                <span className="font-bold text-white">R$ {sugestao.payload?.price || "0,00"}</span>
              </div>
              {sugestao.payload?.buyLink && (
                <a
                  href={sugestao.payload.buyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 w-full mt-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 py-1.5 rounded-lg font-bold"
                >
                  <ExternalLink className="w-3 h-3" /> Comprar
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {rejectingId === sugestao.id && (
        <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
          <input
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Motivo da rejeição (opcional)"
            className="flex-1 bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-500/50"
          />
          <button
            onClick={() => handleRejeitar(sugestao.id)}
            disabled={busy === sugestao.id}
            className="btn-press px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            Confirmar Rejeição
          </button>
        </div>
      )}
    </div>
  );
}
