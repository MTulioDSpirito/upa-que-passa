"use client";

import { useState } from "react";
import Link from "next/link";
import { Gamepad2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Por favor, digite seu e-mail.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível enviar a solicitação.");
        return;
      }
      setSuccess(data.message ?? "Solicitação enviada com sucesso.");
      setEmail("");
    } catch (err) {
      setError("Ocorreu um erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 group">
          <Link href="/" className="inline-block">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Gamepad2 className="w-8 h-8 text-white animate-pulse" />
            </div>
          </Link>
          <h1 className="text-3xl font-black text-white tracking-wide">
            <span className="text-white">UPA</span>
            <span className="text-purple-400"> QUE</span>
            <span className="text-blue-neon"> PASSA</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Recuperação de Senha</p>
        </div>

        <div className="bg-[#0f0f18]/65 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-500/15 border border-green-500/30 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Verifique seu e-mail</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {success}
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para o login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-3">Esqueceu sua senha?</h2>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Digite seu e-mail abaixo. Se ele estiver cadastrado, nós lhe enviaremos as instruções para criar uma nova senha.
              </p>

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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-purple-900/30 hover:shadow-purple-500/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
                >
                  {loading ? "Enviando..." : "Enviar instruções"}
                </button>
              </form>

              <div className="mt-6 text-center border-t border-white/5 pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para o login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
