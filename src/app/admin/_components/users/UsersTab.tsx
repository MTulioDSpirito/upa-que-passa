"use client";

import { useState, useEffect } from "react";
import { Edit, Search } from "lucide-react";
import { formatDate } from "@/lib/data";
import EditUserModal, { type AdminSiteUser } from "./EditUserModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface UsersTabProps {
  siteUsers: AdminSiteUser[] | null;
  setSiteUsers: React.Dispatch<React.SetStateAction<AdminSiteUser[] | null>>;
  editingUser: AdminSiteUser | null;
  setEditingUser: (user: AdminSiteUser | null) => void;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  totalPages: number;
  totalItems: number;
  loading: boolean;
}

export default function UsersTab({
  siteUsers,
  setSiteUsers,
  editingUser,
  setEditingUser,
  page,
  setPage,
  search,
  setSearch,
  totalPages,
  totalItems,
  loading,
}: UsersTabProps) {
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setPage(1);
      setSearch(searchInput);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (!value.trim()) {
      setPage(1);
      setSearch("");
    }
  };

  return (
    <div>
      {/* Top Bar / Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0f0f18] border border-white/5 p-4 rounded-2xl mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">
            Usuários cadastrados ({totalItems})
          </h1>
          <p className="text-gray-400 text-xs mt-1">Gerencie as contas e permissões de usuários do portal.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Buscar por usuário ou email (Enter)..."
            className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="md" label="Carregando usuários..." />
        </div>
      ) : siteUsers === null ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="md" label="Carregando..." />
        </div>
      ) : siteUsers.length === 0 ? (
        <p className="text-sm text-gray-500">
          Nenhum usuário encontrado. Contas reais aparecem aqui conforme as pessoas usam o /cadastrar do site.
        </p>
      ) : (
        <div className="space-y-6">
          <div className="bg-[#0f0f18] border border-white/5 rounded-2xl divide-y divide-white/5">
            {siteUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-4 p-4">
                <img
                  src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.nickname)}`}
                  alt=""
                  className="w-9 h-9 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{u.nickname}</p>
                  <p className="text-xs text-gray-500">
                    {u.email} · {[u.city, u.state].filter(Boolean).join("/") || "Local não informado"} · desde {formatDate(u.createdAt.slice(0, 10))}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                  u.active ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                }`}>
                  {u.active ? "Ativo" : "Banido"}
                </span>
                <button
                  onClick={() => setEditingUser(u)}
                  className="btn-press p-1.5 bg-blue-900/20 text-[#0072ce] rounded-lg hover:bg-blue-900/40 transition-colors flex-shrink-0"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/5 bg-[#0f0f18]/20 px-4 py-4 sm:px-6 rounded-2xl">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:pointer-events-none transition-all"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:pointer-events-none transition-all"
                >
                  Próximo
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-gray-400">
                    Mostrando página <span className="font-semibold text-white">{page}</span> de{" "}
                    <span className="font-semibold text-white">{totalPages}</span> ({totalItems} usuários no total)
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-xl gap-1.5" aria-label="Pagination">
                    <button
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center rounded-xl border border-white/10 bg-[#0f0f18]/60 p-2 text-xs font-medium text-gray-400 hover:bg-purple-600 hover:text-white disabled:opacity-50 disabled:pointer-events-none transition-all"
                    >
                      <span className="sr-only">Anterior</span>
                      &larr;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`relative inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                          p === page
                            ? "z-10 bg-purple-600 text-white"
                            : "text-gray-400 border border-white/10 bg-[#0f0f18]/60 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={page === totalPages}
                      className="relative inline-flex items-center rounded-xl border border-white/10 bg-[#0f0f18]/60 p-2 text-xs font-medium text-gray-400 hover:bg-purple-600 hover:text-white disabled:opacity-50 disabled:pointer-events-none transition-all"
                    >
                      <span className="sr-only">Próximo</span>
                      &rarr;
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSaved={(updated) => {
            setSiteUsers((prev) => prev?.map((u) => (u.id === updated.id ? updated : u)) ?? null);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
}
