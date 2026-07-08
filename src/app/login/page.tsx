"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Gamepad2, Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/user-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível entrar.");
        return;
      }
      // Navegação completa (não router.push) para que Sidebar/Navbar — que
      // vivem no layout raiz e não remontam em navegação client-side —
      // refaçam o fetch de /api/auth/me e reflitam a sessão nova.
      window.location.href = searchParams.get("redirect") ?? "/";
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mx-auto mb-4">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white">
            <span className="text-white">UPA</span>
            <span className="text-purple-400"> QUE</span>
            <span className="text-blue-400"> PASSA</span>
          </h1>
          <p className="text-gray-500 mt-1">Bem-vindo de volta!</p>
        </div>

        <div className="bg-[#111118] border border-white/5 rounded-3xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Entrar na sua conta</h2>

          {/* OAuth */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Google", icon: "G", bg: "bg-white/10 hover:bg-white/20" },
              { label: "PSN", icon: "🎮", bg: "bg-blue-900/30 hover:bg-blue-900/50 border border-blue-700/30" },
              { label: "Discord", icon: "💬", bg: "bg-indigo-900/30 hover:bg-indigo-900/50 border border-indigo-700/30" },
            ].map((provider) => (
              <button
                key={provider.label}
                className={`${provider.bg} text-white text-sm font-medium rounded-xl py-2.5 flex items-center justify-center gap-1.5 transition-all`}
              >
                <span>{provider.icon}</span>
                {provider.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500">ou com email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-sm text-red-400 bg-red-900/20 border border-red-800/30 rounded-xl px-4 py-2.5">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="seu@email.com"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-400">
                <input type="checkbox" className="w-4 h-4 accent-purple-500" />
                Lembrar de mim
              </label>
              <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-900/30 disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Não tem conta?{" "}
            <Link href="/cadastrar" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Cadastrar grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
