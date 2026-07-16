"use client";

import { Edit } from "lucide-react";
import { formatDate } from "@/lib/data";
import EditUserModal, { type AdminSiteUser } from "./EditUserModal";

interface UsersTabProps {
  siteUsers: AdminSiteUser[] | null;
  setSiteUsers: React.Dispatch<React.SetStateAction<AdminSiteUser[] | null>>;
  editingUser: AdminSiteUser | null;
  setEditingUser: (user: AdminSiteUser | null) => void;
}

export default function UsersTab({
  siteUsers,
  setSiteUsers,
  editingUser,
  setEditingUser,
}: UsersTabProps) {
  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6">
        Usuários cadastrados ({siteUsers?.length ?? "..."})
      </h1>
      {siteUsers === null ? (
        <p className="text-sm text-gray-500">Carregando...</p>
      ) : siteUsers.length === 0 ? (
        <p className="text-sm text-gray-500">
          Nenhum usuário se cadastrou ainda. Contas reais aparecem aqui conforme as pessoas usam o /cadastrar do site.
        </p>
      ) : (
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
