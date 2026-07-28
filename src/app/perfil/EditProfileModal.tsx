"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Shuffle, Eye, EyeOff } from "lucide-react";

export interface EditableProfile {
  nickname: string;
  avatar: string | null;
  city: string | null;
  state: string | null;
  bio: string | null;
  console: string | null;
}

const STATES = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
];

function randomAvatarUrl(): string {
  const seed = Math.random().toString(36).slice(2, 10);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
}

export default function EditProfileModal({
  profile,
  onClose,
  onSaved,
}: {
  profile: EditableProfile;
  onClose: () => void;
  onSaved: (updated: EditableProfile) => void;
}) {
  const [nickname, setNickname] = useState(profile.nickname);
  const [avatar, setAvatar] = useState(profile.avatar ?? "");
  const [city, setCity] = useState(profile.city ?? "");
  
  // Normalize initial state if it is a full state name
  const getInitialState = () => {
    if (!profile.state) return "";
    const cleaned = profile.state.trim().toLowerCase();
    const foundBySigla = STATES.find((s) => s.sigla.toLowerCase() === cleaned);
    if (foundBySigla) return foundBySigla.sigla;
    const foundByName = STATES.find((s) => s.nome.toLowerCase() === cleaned);
    if (foundByName) return foundByName.sigla;
    return "";
  };

  const [state, setState] = useState(getInitialState());
  const [bio, setBio] = useState(profile.bio ?? "");
  const [platform, setPlatform] = useState(profile.console ?? "PS5");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [citiesList, setCitiesList] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    if (!state) {
      setCitiesList([]);
      return;
    }

    let active = true;
    async function fetchCities() {
      setLoadingCities(true);
      try {
        const res = await fetch(`/api/localidades/cidades?uf=${state}`);
        if (!res.ok) {
          if (active) setCitiesList([]);
          return;
        }
        const data = await res.json();
        if (active) {
          setCitiesList(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error loading cities:", err);
        if (active) {
          setCitiesList([]);
        }
      } finally {
        if (active) {
          setLoadingCities(false);
        }
      }
    }

    fetchCities();
    return () => {
      active = false;
    };
  }, [state]);

  const handleStateChange = (newVal: string) => {
    setState(newVal);
    setCity("");
  };

  const previewAvatar = avatar.trim() || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(nickname || "Upa")}`;

  async function handleSave() {
    if (password) {
      if (password !== confirmPassword) {
        setError("A confirmação da senha não coincide com a nova senha.");
        return;
      }
      if (password.length < 8) {
        setError("A senha deve ter no mínimo 8 caracteres.");
        return;
      }
    }
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/perfil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname,
          avatar,
          city,
          state,
          bio,
          console: platform,
          password: password || undefined,
          confirmPassword: confirmPassword || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível salvar.");
        return;
      }
      onSaved(data.user);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50";

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-[100]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[#0f0f18] border border-white/10 rounded-2xl p-6 z-[101]">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-lg font-bold text-white">Editar perfil</Dialog.Title>
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

            <div className="flex items-center gap-4">
              <img src={previewAvatar} alt="" className="w-16 h-16 rounded-2xl bg-white/5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-gray-300 mb-2">URL do avatar</label>
                <div className="flex gap-2">
                  <input
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://..."
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setAvatar(randomAvatarUrl())}
                    className="flex-shrink-0 px-3 bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                    aria-label="Gerar avatar aleatório"
                    title="Gerar avatar aleatório"
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nickname</label>
              <input value={nickname} onChange={(e) => setNickname(e.target.value)} className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
                <select
                  value={state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className={inputClass}
                >
                  <option value="" className="bg-[#1a1a2e]">Selecione...</option>
                  {STATES.map((s) => (
                    <option key={s.sigla} value={s.sigla} className="bg-[#1a1a2e]">
                      {s.nome} ({s.sigla})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cidade</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!state || loadingCities}
                  className={`${inputClass} disabled:opacity-50`}
                >
                  {!state ? (
                    <option value="" className="bg-[#1a1a2e]">Selecione o estado...</option>
                  ) : loadingCities ? (
                    <option value="" className="bg-[#1a1a2e]">Carregando...</option>
                  ) : (
                    <>
                      <option value="" className="bg-[#1a1a2e]">Selecione...</option>
                      {citiesList.map((c) => (
                        <option key={c} value={c} className="bg-[#1a1a2e]">
                          {c}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Console principal</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className={inputClass}>
                <option value="PS5" className="bg-[#1a1a2e]">PlayStation 5</option>
                <option value="PC" className="bg-[#1a1a2e]">PC</option>
                <option value="Switch" className="bg-[#1a1a2e]">Switch</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nova senha (opcional)</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirmar nova senha</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={300}
                className={`${inputClass} resize-none`}
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
                disabled={saving || nickname.trim().length < 3}
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
