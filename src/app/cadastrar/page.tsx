"use client";

import { useState } from "react";
import Link from "next/link";
import { Gamepad2, Eye, EyeOff, Lock, Mail, User, CheckCircle } from "lucide-react";

export default function CadastrarPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ nickname: "", email: "", password: "", console: "PS5", terms: false });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const update = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  async function handleRegister() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: form.nickname,
          email: form.email,
          password: form.password,
          console: form.console,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível criar a conta.");
        return;
      }
      setStep(2);
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors";

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mx-auto mb-4">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white">Criar Conta</h1>
          <p className="text-gray-500 mt-1">Junte-se à comunidade gamer</p>
        </div>

        <div className="bg-[#111118] border border-white/5 rounded-3xl p-8">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-6">Informações Básicas</h2>

              {/* OAuth */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Google", icon: "G", bg: "bg-white/10 hover:bg-white/20" },
                  { label: "PSN", icon: "🎮", bg: "bg-blue-900/30 hover:bg-blue-900/50 border border-blue-700/30" },
                  { label: "Discord", icon: "💬", bg: "bg-indigo-900/30 hover:bg-indigo-900/50 border border-indigo-700/30" },
                ].map((p) => (
                  <button key={p.label} className={`${p.bg} text-white text-sm font-medium rounded-xl py-2.5 flex items-center justify-center gap-1.5 transition-all`}>
                    <span>{p.icon}</span> {p.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-gray-600">ou com email</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nickname *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="text" value={form.nickname} onChange={(e) => update("nickname", e.target.value)} placeholder="SeuNick_123" className={`${inputClass} pl-10`} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">E-mail *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="seu@email.com" className={`${inputClass} pl-10`} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Senha *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Mínimo 8 caracteres" className={`${inputClass} pl-10 pr-12`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Console Principal</label>
                <select value={form.console} onChange={(e) => update("console", e.target.value)} className={inputClass}>
                  <option value="PS5">PlayStation 5</option>
                  <option value="PS4">PlayStation 4</option>
                </select>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.terms} onChange={(e) => update("terms", e.target.checked)} className="w-4 h-4 mt-0.5 accent-purple-500" />
                <span className="text-sm text-gray-400">
                  Concordo com os <Link href="#" className="text-purple-400 hover:text-purple-300">Termos de Uso</Link> e{" "}
                  <Link href="#" className="text-purple-400 hover:text-purple-300">Política de Privacidade</Link>
                </span>
              </label>

              {error && (
                <div className="text-sm text-red-400 bg-red-900/20 border border-red-800/30 rounded-xl px-4 py-2.5">
                  {error}
                </div>
              )}

              <button
                onClick={handleRegister}
                disabled={!form.nickname || !form.email || !form.password || !form.terms || loading}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl disabled:opacity-40 hover:from-purple-500 hover:to-blue-500 transition-all"
              >
                {loading ? "Criando conta..." : "Criar Conta →"}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Conta Criada!</h2>
              <p className="text-gray-400 mb-8">
                Bem-vindo ao Upa que Passa, <strong className="text-white">{form.nickname}</strong>! Sua conta já está ativa e você já entrou.
              </p>
              <Link
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/";
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all"
              >
                <Gamepad2 className="w-4 h-4" />
                Ir para a Home
              </Link>
            </div>
          )}

          {step === 1 && (
            <p className="text-center text-sm text-gray-500 mt-5">
              Já tem conta?{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">Entrar</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
