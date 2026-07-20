"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ShieldAlert } from "lucide-react";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "DEVELOPER" | "COLABORADOR";
  active: boolean;
  avatar: string | null;
  createdAt: string;
}

interface AdminUserModalProps {
  admin: AdminUser | null; // null means we are creating a new one
  onClose: () => void;
  onSaved: (saved: AdminUser) => void;
}

export default function AdminUserModal({ admin, onClose, onSaved }: AdminUserModalProps) {
  const isEdit = !!admin;
  const [name, setName] = useState(admin?.name ?? "");
  const [email, setEmail] = useState(admin?.email ?? "");
  const [role, setRole] = useState<"DEVELOPER" | "COLABORADOR">(admin?.role ?? "COLABORADOR");
  const [active, setActive] = useState(admin?.active ?? true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setError(null);

    if (!name.trim()) {
      setError("O nome é obrigatório.");
      return;
    }
    if (!email.trim()) {
      setError("O e-mail é obrigatório.");
      return;
    }
    if (!isEdit && !password) {
      setError("A senha é obrigatória para novos administradores.");
      return;
    }
    if (password && password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setSaving(true);
    try {
      const url = isEdit ? `/api/admin/admins/${admin.id}` : "/api/admin/admins";
      const method = isEdit ? "PATCH" : "POST";
      const payload: any = { name, email, role };

      if (isEdit) {
        payload.active = active;
        if (password) {
          payload.password = password;
        }
      } else {
        payload.password = password;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível salvar o administrador.");
        return;
      }

      onSaved(data.admin);
    } catch (e) {
      console.error(e);
      setError("Erro de rede ou de servidor.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-[100]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0f0f18] border border-white/10 rounded-2xl p-6 z-[101]">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-lg font-bold text-white">
              {isEdit ? "Editar Administrador" : "Adicionar Administrador"}
            </Dialog.Title>
            <Dialog.Close className="text-gray-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="text-sm text-red-400 bg-red-900/20 border border-red-800/30 rounded-xl px-4 py-2.5 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                placeholder="Nome completo do administrador"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                placeholder="exemplo@upaquepassa.com.br"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cargo</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "DEVELOPER" | "COLABORADOR")}
                className="w-full bg-[#0f0f18] border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
              >
                <option value="COLABORADOR">Colaborador</option>
                <option value="DEVELOPER">Developer</option>
              </select>
            </div>

            {isEdit && (
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300 py-1">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
                Conta ativa (desmarcar impede o acesso ao portal)
              </label>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {isEdit ? "Nova Senha (opcional)" : "Senha Inicial"}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                placeholder={isEdit ? "Deixe em branco para não alterar" : "Mínimo 6 caracteres"}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 text-sm font-semibold text-gray-300 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl transition-all disabled:opacity-60"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
