"use client";

import { useState, useEffect } from "react";
import { X, Gamepad2, Mail, Lock, Eye, EyeOff, User, UserPlus, CheckCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [step, setStep] = useState(1); // 1 = form, 2 = success (register only)
  
  // Login State
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Register State
  const [registerForm, setRegisterForm] = useState({ nickname: "", email: "", password: "", console: "PS5", terms: false });
  const [registerShowPassword, setRegisterShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerLoading, setRegisterLoading] = useState(false);

  // Sync mode with prop change and lock body scrolling
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setStep(1);
      setLoginError(null);
      setRegisterError(null);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/user-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error ?? "Não foi possível entrar.");
        return;
      }
      // Reload page to refresh all active sessions/navbar states cleanly
      window.location.reload();
    } catch {
      setLoginError("Erro de conexão. Tente novamente.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRegisterError(null);
    setRegisterLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: registerForm.nickname,
          email: registerForm.email,
          password: registerForm.password,
          console: registerForm.console,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRegisterError(data.error ?? "Não foi possível criar a conta.");
        return;
      }
      setStep(2);
    } catch {
      setRegisterError("Erro de conexão. Tente novamente.");
    } finally {
      setRegisterLoading(false);
    }
  }

  const updateRegister = (k: string, v: unknown) => setRegisterForm((f) => ({ ...f, [k]: v }));
  const inputClass = "w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative my-auto w-full max-w-md bg-[#0f0f18] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 animate-scale-up">
        {/* Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Content */}
        <div className="p-8">
          {step === 1 ? (
            <>
              {/* Logo / Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mx-auto mb-3">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-black text-white">
                  <span className="text-white">UPA</span>
                  <span className="text-purple-400"> QUE</span>
                  <span className="text-blue-neon"> PASSA</span>
                </h2>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/5 mb-6">
                <button
                  type="button"
                  onClick={() => { setMode("login"); setLoginError(null); }}
                  className={`flex-1 pb-3 text-sm font-semibold transition-all relative ${mode === "login" ? "text-purple-400" : "text-gray-500 hover:text-gray-300"}`}
                >
                  Entrar
                  {mode === "login" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full shadow-[0_0_8px_#a855f7]" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("register"); setRegisterError(null); }}
                  className={`flex-1 pb-3 text-sm font-semibold transition-all relative ${mode === "register" ? "text-purple-400" : "text-gray-500 hover:text-gray-300"}`}
                >
                  Cadastrar
                  {mode === "register" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full shadow-[0_0_8px_#a855f7]" />
                  )}
                </button>
              </div>

              {/* Social Login */}
              <div className="mb-5">
                <button
                  type="button"
                  onClick={() => window.location.href = "/api/auth/google"}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-xs font-semibold rounded-xl py-3 flex items-center justify-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  Entrar com o Google
                </button>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">ou com email</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              {/* Forms */}
              {mode === "login" ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {loginError && (
                    <div className="text-xs text-red-400 bg-red-900/10 border border-red-800/20 rounded-xl px-4 py-2.5">
                      {loginError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        required
                        value={loginForm.email}
                        onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="seu@email.com"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type={loginShowPassword ? "text" : "password"}
                        required
                        value={loginForm.password}
                        onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                        placeholder="••••••••"
                        className={`${inputClass} pl-10 pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setLoginShowPassword(!loginShowPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                      >
                        {loginShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-3.5 mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-900/20 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loginLoading ? "Entrando..." : "Entrar"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {registerError && (
                    <div className="text-xs text-red-400 bg-red-900/10 border border-red-800/20 rounded-xl px-4 py-2.5">
                      {registerError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Nickname *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        required
                        value={registerForm.nickname}
                        onChange={(e) => updateRegister("nickname", e.target.value)}
                        placeholder="SeuNick_123"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">E-mail *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        required
                        value={registerForm.email}
                        onChange={(e) => updateRegister("email", e.target.value)}
                        placeholder="seu@email.com"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Senha *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type={registerShowPassword ? "text" : "password"}
                        required
                        value={registerForm.password}
                        onChange={(e) => updateRegister("password", e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        className={`${inputClass} pl-10 pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setRegisterShowPassword(!registerShowPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                      >
                        {registerShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Console Principal</label>
                    <select
                      value={registerForm.console}
                      onChange={(e) => updateRegister("console", e.target.value)}
                      className={inputClass}
                    >
                      <option value="PS5">PlayStation 5</option>
                      <option value="PS4">PlayStation 4</option>
                    </select>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={registerForm.terms}
                      onChange={(e) => updateRegister("terms", e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-purple-500 rounded bg-white/5 border-white/10"
                    />
                    <span className="text-xs text-gray-400">
                      Concordo com os Termos de Uso e Política de Privacidade.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={!registerForm.nickname || !registerForm.email || !registerForm.password || !registerForm.terms || registerLoading}
                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-900/20 disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    {registerLoading ? "Criando conta..." : "Criar Conta"}
                  </button>
                </form>
              )}
            </>
          ) : (
            /* Success Step */
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                <CheckCircle className="w-8 h-8 text-green-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Conta Criada!</h3>
              <p className="text-sm text-gray-400 mb-6">
                Bem-vindo ao Upa que Passa, <strong className="text-white">{registerForm.nickname}</strong>! Sua conta foi ativada com sucesso.
              </p>
              <button
                type="button"
                onClick={() => {
                  window.location.reload();
                }}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all"
              >
                Começar a usar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
