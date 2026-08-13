"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Gamepad2, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { resetPasswordAction, type ResetPasswordActionState } from "./actions";
import { useSearchParam } from "@/lib/useSearchParam";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-purple-900/30 hover:shadow-purple-500/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
    >
      {pending ? "Salvando..." : "Redefinir senha"}
    </button>
  );
}

export default function ResetPasswordForm() {
  const [state, formAction] = useActionState<ResetPasswordActionState, FormData>(resetPasswordAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const token = useSearchParam("token");

  const error = state && "error" in state ? state.error : null;
  const success = state && "success" in state ? state.success : null;

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
          <p className="text-gray-400 mt-2 text-sm">Criar Nova Senha</p>
        </div>

        <div className="bg-[#0f0f18]/65 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40">
          {!token ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-red-500/15 border border-red-500/30 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Token inválido</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Este link de redefinição de senha é inválido ou expirou. Por favor, solicite uma nova redefinição.
              </p>
              <Link
                href="/esqueceu-senha"
                className="w-full inline-flex items-center justify-center py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all"
              >
                Solicitar novo link
              </Link>
            </div>
          ) : success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-500/15 border border-green-500/30 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Sucesso!</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {success}
              </p>
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all"
              >
                Ir para o login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-6">Defina sua nova senha</h2>

              <form action={formAction} className="space-y-4">
                <input type="hidden" name="token" value={token} />
                {error && (
                  <div className="text-sm text-red-400 bg-red-900/20 border border-red-800/30 rounded-xl px-4 py-2.5">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nova senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
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
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
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

                <SubmitButton />
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
