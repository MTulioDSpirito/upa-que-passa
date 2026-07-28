"use client";

import { useEffect, useState } from "react";
import { Key, Search, CheckCircle, Trash2, Copy, AlertTriangle, ExternalLink } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatDate } from "@/lib/data";

interface PasswordReset {
  id: string;
  email: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  approved: boolean;
}

export default function PasswordResetsTab() {
  const [resets, setResets] = useState<PasswordReset[] | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeLink, setActiveLink] = useState<{ email: string; link: string } | null>(null);

  useEffect(() => {
    fetchResets();
  }, []);

  async function fetchResets() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/password-resets");
      if (res.ok) {
        const data = await res.json();
        setResets(data.resets);
      }
    } catch (error) {
      console.error("Erro ao carregar solicitações de senha:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(id);
      const res = await fetch("/api/admin/password-resets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        const data = await res.json();
        setActiveLink({ email: data.resetRecord.email, link: data.resetLink });
        // Recarrega a lista
        await fetchResets();
      } else {
        const data = await res.json();
        alert(data.error || "Ocorreu um erro ao aprovar a solicitação.");
      }
    } catch (error) {
      console.error("Erro ao aprovar solicitação:", error);
      alert("Falha na rede ou servidor.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta solicitação de recuperação?")) return;

    try {
      setActionLoading(id);
      const res = await fetch(`/api/admin/password-resets?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchResets();
      } else {
        alert("Erro ao excluir solicitação.");
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert("Link copiado para a área de transferência!");
  };

  const getStatus = (item: PasswordReset) => {
    const isExpired = new Date(item.expiresAt) < new Date();
    if (isExpired) return { label: "Expirado", style: "text-red-400 bg-red-400/10 border-red-400/20" };
    if (item.approved) return { label: "Aprovado", style: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" };
    return { label: "Pendente", style: "text-amber-400 bg-amber-400/10 border-amber-400/20" };
  };

  const filteredResets = resets?.filter((r) => {
    return r.email.toLowerCase().includes(search.toLowerCase());
  }) ?? [];

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0f0f18] border border-white/5 p-4 rounded-2xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Key className="w-6 h-6 text-amber-400" />
            Recuperações de Senha
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            Gerencie e aprove solicitações manuais de redefinição de senha realizadas pelos usuários.
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filtrar por e-mail do usuário..."
          className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50"
        />
      </div>

      {/* Main Table / State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="md" label="Buscando solicitações..." />
        </div>
      ) : resets === null ? (
        <div className="text-center py-20 text-gray-500 text-sm">
          Erro ao carregar solicitações de redefinição de senha.
        </div>
      ) : filteredResets.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
          <p className="text-sm text-gray-400">Nenhuma solicitação de recuperação de senha encontrada.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-[#0f0f18] border border-white/5 rounded-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                <th className="p-4">E-mail</th>
                <th className="p-4">Solicitado em</th>
                <th className="p-4">Vence em</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredResets.map((item) => {
                const statusObj = getStatus(item);
                const isExpired = new Date(item.expiresAt) < new Date();
                const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
                const itemLink = `${appUrl}/redefinir-senha?token=${item.token}`;

                return (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-medium text-white">{item.email}</td>
                    <td className="p-4 text-gray-400">{formatDate(item.createdAt)}</td>
                    <td className="p-4 text-gray-400">{formatDate(item.expiresAt)}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusObj.style}`}>
                        {statusObj.label}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!item.approved && !isExpired && (
                          <button
                            onClick={() => handleApprove(item.id)}
                            disabled={actionLoading !== null}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs transition-all disabled:opacity-50"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Aprovar
                          </button>
                        )}
                        {item.approved && !isExpired && (
                          <button
                            onClick={() => handleCopyLink(itemLink)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg border border-white/10 text-xs transition-all"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            Copiar Link
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={actionLoading !== null}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-all disabled:opacity-50"
                          title="Excluir Solicitação"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Copy Link Success Modal */}
      {activeLink && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f18] border border-white/10 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 text-amber-400">
              <Key className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Link de Recuperação Gerado</h3>
            </div>
            
            <p className="text-gray-300 text-sm">
              A solicitação para <strong className="text-white">{activeLink.email}</strong> foi aprovada e o token de redefinição foi criado.
            </p>

            <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl break-all text-xs font-mono text-gray-300">
              {activeLink.link}
            </div>

            <div className="flex items-start gap-2 text-xs text-gray-400 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                Este link expira em 1 hora. Copie-o e envie manualmente para o usuário através do e-mail de contato cadastrado por ele.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveLink(null)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => handleCopyLink(activeLink.link)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-sm transition-all"
              >
                <Copy className="w-4 h-4" />
                Copiar Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
