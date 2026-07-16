"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Check, X, ExternalLink, RefreshCw, Inbox } from "lucide-react";
import AdminUserFooter, { type AdminUserSession } from "../AdminUserFooter";

interface Sugestao {
  id: string;
  tipo: "NOTICIA" | "REVIEW" | "LANCAMENTO";
  criador: string;
  titulo: string;
  slug: string;
  payload: any;
  fontes: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  motivoRejeicao?: string;
  createdAt: string;
}

interface EntregasResponse {
  pendentes: Sugestao[];
  aprovados: Sugestao[];
  rejeitados: Sugestao[];
}

function getSugestaoTipoLabel(tipo: string): string {
  if (tipo === "LANCAMENTO") return "Lançamento";
  if (tipo === "REVIEW") return "Review";
  return "Notícia";
}

export default function SugestoesClient({ user }: { user: AdminUserSession }) {
  const [data, setData] = useState<EntregasResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [motivo, setMotivo] = useState("");

  const load = useCallback(() => {
    return fetch("/api/admin/entregas")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function handleRefresh() {
    setLoading(true);
    load();
  }

  async function handleAprovar(id: string) {
    setBusy(id);
    await fetch("/api/admin/entregas/aprovar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBusy(null);
    load();
  }

  async function handleRejeitar(id: string) {
    setBusy(id);
    await fetch("/api/admin/entregas/rejeitar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, motivo }),
    });
    setBusy(null);
    setRejectingId(null);
    setMotivo("");
    load();
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-56 bg-[#0f0f18] border-r border-white/5 py-6 flex-shrink-0 flex flex-col sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="px-4 mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="font-bold text-white text-sm">Sugestões</span>
          </div>
        </div>
        <nav className="px-2 flex-1">
          <Link
            href="/admin"
            className="btn-press w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Link>
        </nav>
        <AdminUserFooter user={user} />
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">Sugestões da Equipe</h1>
            <p className="text-gray-500 text-sm">
              O que Kai, Vera e Theo encontraram na varredura diária — aprove o que entra no site.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="btn-press flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-xl transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
        </div>

        {loading && <p className="text-gray-500 text-sm">Carregando...</p>}

        {!loading && data && data.pendentes.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20 text-gray-500">
            <Inbox className="w-10 h-10 mb-3 opacity-50" />
            <p className="font-semibold text-white mb-1">Nenhuma sugestão pendente</p>
            <p className="text-sm">
              O pipeline diário roda de forma manual e envia os dados diretamente para esta área.
            </p>
          </div>
        )}

        <div className="space-y-4 mb-10">
          {data?.pendentes.map((sugestao) => (
            <div key={sugestao.id} className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="text-xs font-semibold text-purple-400 bg-purple-900/20 border border-purple-800/20 rounded-full px-2 py-0.5">
                    {getSugestaoTipoLabel(sugestao.tipo)}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">{sugestao.titulo}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Slug: {sugestao.slug} | Criado por: {sugestao.criador}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
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

              {sugestao.payload?.excerpt ? (
                <p className="text-sm text-gray-400 mb-3">{String(sugestao.payload.excerpt)}</p>
              ) : (
                <p className="text-sm text-gray-400 mb-3 line-clamp-3 whitespace-pre-wrap">
                  {sugestao.payload?.body || JSON.stringify(sugestao.payload)}
                </p>
              )}

              {sugestao.fontes && sugestao.fontes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {sugestao.fontes.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-[#0072ce] hover:text-blue-300 bg-blue-900/10 border border-blue-800/20 rounded-lg px-2 py-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {new URL(url).hostname}
                    </a>
                  ))}
                </div>
              )}

              {rejectingId === sugestao.id && (
                <div className="mt-3 flex gap-2">
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
                    Confirmar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {data && (data.aprovados.length > 0 || data.rejeitados.length > 0) && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-3">Aprovados ({data.aprovados.length})</h3>
              <div className="space-y-2">
                {data.aprovados.map((s) => (
                  <p key={s.id} className="text-sm text-gray-400 truncate">
                    {s.titulo} ({getSugestaoTipoLabel(s.tipo)})
                  </p>
                ))}
              </div>
            </div>
            <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-3">Rejeitados ({data.rejeitados.length})</h3>
              <div className="space-y-2">
                {data.rejeitados.map((s) => (
                  <div key={s.id} className="text-sm text-gray-500">
                    <p className="truncate font-semibold">{s.titulo}</p>
                    {s.motivoRejeicao && <p className="text-xs text-red-400/80">Motivo: {s.motivoRejeicao}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
