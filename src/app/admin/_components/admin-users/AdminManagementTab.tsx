"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit, Shield } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AdminUserModal, { type AdminUser } from "./AdminUserModal";
import { formatDate } from "@/lib/data";

interface AdminManagementTabProps {
  adminUser: {
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminManagementTab({ adminUser }: AdminManagementTabProps) {
  const [admins, setAdmins] = useState<AdminUser[] | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  async function fetchAdmins() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/admins");
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.admins);
      }
    } catch (error) {
      console.error("Erro ao carregar administradores da equipe:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredAdmins = admins?.filter((a) => {
    const term = search.toLowerCase();
    return (
      a.name.toLowerCase().includes(term) ||
      a.email.toLowerCase().includes(term) ||
      a.role.toLowerCase().includes(term)
    );
  }) ?? [];

  return (
    <div>
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0f0f18] border border-white/5 p-4 rounded-2xl mb-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-400" />
            Gerenciar Equipe do Portal
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            Cadastre novos membros da equipe, altere seus cargos (Developer / Colaborador) e redefina senhas.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingAdmin(null);
            setIsModalOpen(true);
          }}
          className="btn-press flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl text-sm transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Adicionar Administrador
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filtrar por nome, e-mail ou cargo..."
          className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="md" label="Carregando membros da equipe..." />
        </div>
      ) : admins === null ? (
        <div className="text-center py-20 text-gray-500 text-sm">
          Erro ao carregar a equipe administrativa.
        </div>
      ) : filteredAdmins.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum administrador encontrado com esses critérios.</p>
      ) : (
        <div className="space-y-6">
          <div className="bg-[#0f0f18] border border-white/5 rounded-2xl divide-y divide-white/5">
            {filteredAdmins.map((u) => (
              <div key={u.id} className="flex items-center gap-4 p-4 hover:bg-white/[0.01] transition-colors">
                <img
                  src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}`}
                  alt=""
                  className="w-9 h-9 rounded-full flex-shrink-0 bg-white/10"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white truncate">{u.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      u.role === "DEVELOPER" ? "bg-purple-900/30 text-purple-400 border border-purple-800/20" : "bg-blue-900/30 text-blue-400 border border-blue-800/20"
                    }`}>
                      {u.role}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {u.email} · cadastrado em {formatDate(u.createdAt.slice(0, 10))}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                  u.active ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                }`}>
                  {u.active ? "Ativo" : "Inativo"}
                </span>
                <button
                  onClick={() => {
                    setEditingAdmin(u);
                    setIsModalOpen(true);
                  }}
                  className="btn-press p-2 bg-purple-900/20 text-purple-400 hover:bg-purple-900/40 rounded-lg transition-colors flex-shrink-0"
                  title="Editar Administrador"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <AdminUserModal
          admin={editingAdmin}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAdmin(null);
          }}
          onSaved={(saved) => {
            setIsModalOpen(false);
            setEditingAdmin(null);
            fetchAdmins(); // Refresh admin list
          }}
        />
      )}
    </div>
  );
}
