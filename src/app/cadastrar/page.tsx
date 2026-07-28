"use client";

import { useState } from "react";
import Link from "next/link";
import { Gamepad2, Eye, EyeOff, Lock, Mail, User, CheckCircle } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

export default function CadastrarPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ nickname: "", email: "", password: "", console: "PS5", terms: false, honeypot: "" });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  // Validação da força da senha
  const password = form.password;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^a-zA-Z0-9]/.test(password),
  };
  const strengthScore = Object.values(checks).filter(Boolean).length;
  const isPasswordStrong = strengthScore === 5;

  const getPasswordStrength = () => {
    if (strengthScore <= 2) return { text: "Fraca", color: "text-red-400 font-semibold" };
    if (strengthScore <= 4) return { text: "Média", color: "text-yellow-400 font-semibold" };
    return { text: "Forte", color: "text-green-400 font-semibold" };
  };
  const strength = getPasswordStrength();
  const strengthColor = strengthScore <= 2 ? "bg-red-500" : strengthScore <= 4 ? "bg-yellow-500" : "bg-green-500";

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

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
          honeypot: form.honeypot,
          turnstileToken: turnstileToken,
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

        <div className="bg-[#0f0f18] border border-white/5 rounded-3xl p-8">
          {step === 1 && (
            <>
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-6">Informações Básicas</h2>

                {/* OAuth */}
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => window.location.href = "/api/auth/google"}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-sm font-medium rounded-xl py-3 flex items-center justify-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    Cadastrar com o Google
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-gray-500">ou com email</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Honeypot Field (Invisível para humanos, preenchido por robôs) */}
                <div className="opacity-0 absolute -z-10 w-0 h-0 overflow-hidden" aria-hidden="true">
                  <input
                    type="text"
                    name="username_confirm_honey"
                    value={form.honeypot}
                    onChange={(e) => update("honeypot", e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
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

                  {form.password && (
                    <div className="mt-3 space-y-2">
                      {/* Barra de Força */}
                      <div className="flex gap-1 h-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`flex-1 h-full rounded-full transition-all duration-300 ${
                              level <= strengthScore ? strengthColor : "bg-white/10"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-gray-400">
                        <span>Força da senha:</span>
                        <span className={strength.color}>{strength.text}</span>
                      </div>

                      {/* Lista de Requisitos */}
                      <ul className="text-xs space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                        <li className={`flex items-center gap-2 ${checks.length ? "text-green-400" : "text-gray-500"}`}>
                          <span className="text-xs">{checks.length ? "✓" : "○"}</span> Mínimo 8 caracteres
                        </li>
                        <li className={`flex items-center gap-2 ${checks.lowercase && checks.uppercase ? "text-green-400" : "text-gray-500"}`}>
                          <span className="text-xs">{checks.lowercase && checks.uppercase ? "✓" : "○"}</span> Letras maiúsculas e minúsculas
                        </li>
                        <li className={`flex items-center gap-2 ${checks.number ? "text-green-400" : "text-gray-500"}`}>
                          <span className="text-xs">{checks.number ? "✓" : "○"}</span> Pelo menos um número
                        </li>
                        <li className={`flex items-center gap-2 ${checks.special ? "text-green-400" : "text-gray-500"}`}>
                          <span className="text-xs">{checks.special ? "✓" : "○"}</span> Pelo menos um caractere especial (!@#$...)
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Console Principal</label>
                  <select 
                    value={form.console} 
                    onChange={(e) => update("console", e.target.value)} 
                    className="w-full bg-[#151521] border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                  >
                    <option value="PS5" className="bg-[#151521] text-white">PlayStation 5</option>
                    <option value="PC" className="bg-[#151521] text-white">PC</option>
                    <option value="Switch" className="bg-[#151521] text-white">Nintendo Switch</option>
                  </select>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.terms} onChange={(e) => update("terms", e.target.checked)} className="w-4 h-4 mt-0.5 accent-purple-500" />
                  <span className="text-sm text-gray-400">
                    Concordo com os <Link href="#" className="text-purple-400 hover:text-purple-300">Termos de Uso</Link> e{" "}
                    <Link href="#" className="text-purple-400 hover:text-purple-300">Política de Privacidade</Link>
                  </span>
                </label>

                {/* Componente Cloudflare Turnstile */}
                <div className="flex justify-center py-2">
                  <Turnstile
                    siteKey={turnstileSiteKey}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onError={() => setError("Erro na validação de segurança. Recarregue a página.")}
                    onExpire={(e) => setTurnstileToken(null)}
                    options={{
                      theme: "dark",
                    }}
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-400 bg-red-900/20 border border-red-800/30 rounded-xl px-4 py-2.5">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleRegister}
                  disabled={!form.nickname || !form.email || !isPasswordStrong || !form.terms || !turnstileToken || loading}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl disabled:opacity-40 hover:from-purple-500 hover:to-blue-500 transition-all"
                >
                  {loading ? "Criando conta..." : "Criar Conta →"}
                </button>
              </div>

              <p className="text-center text-sm text-gray-500 mt-5">
                Já tem conta?{" "}
                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">Entrar</Link>
              </p>
            </>
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all"
              >
                <Gamepad2 className="w-4 h-4" />
                Ir para a Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
