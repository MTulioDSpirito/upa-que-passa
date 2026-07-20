"use client";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, KeyRound } from "lucide-react";

interface ChangePasswordModalProps {
  onClose: () => void;
}

export default function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setError(null);
    setSuccess(null);

    if (!currentPassword) {
      setError("Senha atual é obrigatória.");
      return;
    }

    if (newPassword.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível alterar a senha.");
        return;
      }
      setSuccess("Senha alterada com sucesso!");
      setTimeout(() => {
        onClose();
      }, 1500);
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
            <Dialog.Title className="text-lg font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-purple-400" />
              Alterar Senha
            </Dialog.Title>
            <Dialog.Close className="text-gray-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="text-sm text-red-400 bg-red-900/20 border border-red-800/30 rounded-xl px-4 py-2.5">
                {error}
              </div>
            )}
            {success && (
              <div className="text-sm text-green-400 bg-green-900/20 border border-green-800/30 rounded-xl px-4 py-2.5">
                {success}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Senha Atual</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                placeholder="Sua senha de login atual"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nova Senha</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirmar Nova Senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                placeholder="Digite a nova senha novamente"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                disabled={saving}
                className="flex-1 py-2.5 text-sm font-semibold text-gray-300 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !!success}
                className="flex-1 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl transition-all disabled:opacity-60"
              >
                {saving ? "Alterando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
