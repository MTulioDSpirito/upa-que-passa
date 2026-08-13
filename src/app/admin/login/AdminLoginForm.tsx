"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { Gamepad2, Eye, EyeOff, Lock, Mail, ShieldCheck, Loader2 } from "lucide-react";
import { adminLoginAction, type AdminLoginActionState } from "./actions";
import { useSearchParam } from "@/lib/useSearchParam";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-purple-900/30 hover:shadow-purple-500/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin text-white" />
          <span>Autenticando...</span>
        </>
      ) : (
        "Entrar no Painel"
      )}
    </button>
  );
}

export default function AdminLoginForm() {
  const [state, formAction] = useActionState<AdminLoginActionState, FormData>(adminLoginAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const redirectTo = useSearchParam("redirect") ?? "/admin";

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[#07070c]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Title */}
        <div className="text-center mb-8 group">
          <div className="relative w-20 h-20 mx-auto mb-5">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 blur-md opacity-45 group-hover:opacity-80 transition-all duration-300 group-hover:scale-110" />
            <div className="relative w-20 h-20 rounded-2xl bg-[#0f0f18] border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
              <Image
                src="/logo-icon.png"
                alt="Logo Upa que Passa"
                width={44}
                height={44}
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-wider text-white">
            <span className="text-white">PAINEL</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"> ADMIN</span>
          </h1>
          <p className="text-gray-400 text-xs mt-2 flex items-center justify-center gap-1.5 uppercase tracking-widest font-semibold">
            <Gamepad2 className="w-3.5 h-3.5 text-purple-400" /> Upa que Passa — Equipe de Conteúdo
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-[#0f0f18]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/80">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-none">Autenticação Restrita</h2>
              <span className="text-xs text-gray-500">Apenas equipe autorizada</span>
            </div>
          </div>

          <form action={formAction} className="space-y-5">
            <input type="hidden" name="redirectTo" value={redirectTo ?? "/admin"} />
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">E-mail corporativo</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="seu.nome@upaquepassa.com.br"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Chave de acesso</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
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

            {state?.error && (
              <div className="text-sm text-red-400 bg-red-950/40 border border-red-500/30 rounded-xl px-4 py-3">
                {state.error}
              </div>
            )}

            <SubmitButton />
          </form>

          <p className="text-center text-xs text-gray-500 mt-6 leading-relaxed">
            Esta área é monitorada. Qualquer tentativa de acesso não autorizada será registrada.
          </p>
        </div>
      </div>
    </div>
  );
}
