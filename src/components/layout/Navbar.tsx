"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Bell, Gamepad2, Home, Star, Newspaper, ShoppingBag, Trophy, Rocket, User, UserPlus, LogOut, Users } from "lucide-react";
import { useUserSession } from "@/hooks/useUserSession";
import { openSearch } from "./SearchModal";
import AuthModal from "./AuthModal";

export const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Reviews", href: "/reviews", icon: Star },
  { label: "Notícias", href: "/noticias", icon: Newspaper },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { label: "Ranking", href: "/ranking", icon: Trophy },
  { label: "Lançamentos", href: "/lancamentos", icon: Rocket },
  { label: "Sobre", href: "/quem-somos", icon: Users },
];

export function AccountAuthBlock({
  onNavigate,
  onOpenAuth,
}: {
  onNavigate?: () => void;
  onOpenAuth: (mode: "login" | "register") => void;
}) {
  const user = useUserSession();
  const [loggingOut, setLoggingOut] = useState(false);

  if (user === undefined) {
    return <div className="h-[88px]" />;
  }

  if (user === null) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            onNavigate?.();
            onOpenAuth("login");
          }}
          className="btn-press flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 hover:shadow-[0_0_12px_rgba(168,85,247,0.25)] rounded-xl transition-all"
        >
          <User className="w-4 h-4" />
          Entrar
        </button>
        <button
          onClick={() => {
            onNavigate?.();
            onOpenAuth("register");
          }}
          className="btn-press flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-purple-400 hover:text-white border border-purple-500/20 hover:border-purple-500/40 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
        >
          <UserPlus className="w-4 h-4" />
          Cadastrar
        </button>
      </div>
    );
  }

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/user-logout", { method: "POST" });
    onNavigate?.();
    window.location.href = "/";
  }

  return (
    <Link
      href="/perfil"
      onClick={onNavigate}
      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-all group"
    >
      <img
        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.nickname)}`}
        alt={user.nickname}
        className="w-9 h-9 rounded-lg flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate group-hover:text-amber-400 transition-colors">{user.nickname}</p>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleLogout();
        }}
        disabled={loggingOut}
        className="p-1.5 text-gray-500 hover:text-red-400 transition-colors disabled:opacity-60"
        aria-label="Sair"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </Link>
  );
}

export default function Navbar() {
  const user = useUserSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const pathname = usePathname();

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  if (pathname === "/admin/login") {
    return null;
  }

  // No painel administrativo, mantemos um cabeçalho compacto para produtividade
  if (pathname?.startsWith("/admin")) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#07070a]/95 backdrop-blur-md border-b border-purple-900/20 h-16">
        <div className="px-4 flex items-center justify-between h-full">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-lg tracking-tight">
              <span className="text-white">UPA</span>
              <span className="text-purple-400"> QUE</span>
              <span className="text-[#0072ce]"> PASSA</span>
              <span className="text-xs ml-2 text-purple-400 font-sans font-bold uppercase tracking-wider">ADMIN</span>
            </span>
          </Link>
          <AccountAuthBlock onOpenAuth={openAuth} />
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-[#0f0f18]/90 backdrop-blur-md sticky top-0 z-40 border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        
        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 h-full">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 px-4 h-full text-sm font-semibold transition-all hover:text-white ${
                  active ? "text-purple-400" : "text-gray-400"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-purple-500 rounded-t-full shadow-[0_0_8px_#a855f7]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburguer Toggle (only visible on mobile/tablet) */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Right actions (Search, Bell, Account) */}
        <div className="flex items-center gap-3">
          {/* Search Button */}
          <button
            onClick={openSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Buscar...</span>
            <kbd className="hidden md:inline-block ml-1 text-[9px] bg-white/10 px-1 py-0.5 rounded">⌘K</kbd>
          </button>

          {/* Notification Bell */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                aria-label="Notificações"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_4px_#a855f7]" />
              </button>

              {/* Notification Dropdown */}
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-[#0f0f18]/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl z-50 animate-scale-up">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                      <span>Notificações</span>
                      <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-semibold">Nova</span>
                    </h4>
                    <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
                      <Bell className="w-8 h-8 text-gray-600 mb-2 animate-bounce" />
                      <p className="text-xs font-semibold text-white">Tudo limpo por aqui!</p>
                      <p className="text-[10px] text-gray-500 mt-1">Você não tem novas notificações.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Account Status */}
          <div className="hidden sm:block border-l border-white/10 pl-3">
            <AccountAuthBlock onOpenAuth={openAuth} />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0f0f18] border-t border-white/5 py-4 space-y-2">
          <nav className="flex flex-col px-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? "bg-purple-600/20 text-purple-400 border border-purple-500/20"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="px-3 pt-4 mt-4 border-t border-white/5 sm:hidden">
            <AccountAuthBlock onNavigate={() => setMobileOpen(false)} onOpenAuth={openAuth} />
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </nav>
  );
}
