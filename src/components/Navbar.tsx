"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, Bell, User, ChevronDown, Gamepad2, ShoppingBag, Star, Newspaper, Trophy } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  {
    label: "Reviews",
    href: "/reviews",
    children: [
      { label: "Todas Reviews", href: "/reviews" },
      { label: "Melhores do Ano", href: "/ranking" },
      { label: "Reviews da Comunidade", href: "/reviews/comunidade" },
    ],
  },
  {
    label: "Jogos",
    href: "/jogos",
    children: [
      { label: "Catálogo PS5", href: "/jogos" },
      { label: "Lançamentos", href: "/lancamentos" },
      { label: "Em Breve", href: "/lancamentos#em-breve" },
    ],
  },
  { label: "Notícias", href: "/noticias" },
  {
    label: "Marketplace",
    href: "/marketplace",
    children: [
      { label: "Todos os Anúncios", href: "/marketplace" },
      { label: "Vender Jogo", href: "/marketplace/vender" },
      { label: "Trocas", href: "/marketplace/trocas" },
      { label: "Comprar", href: "/marketplace/comprar" },
    ],
  },
  { label: "Ranking", href: "/ranking" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight">
              <span className="text-white">UPA</span>
              <span className="text-purple-400"> QUE</span>
              <span className="text-blue-400"> PASSA</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  {item.label}
                  {item.children && <ChevronDown className="w-3 h-3" />}
                </Link>
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-[#12121f] border border-purple-800/40 rounded-xl shadow-2xl shadow-purple-900/20 py-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-purple-600/20 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/10">
              <Search className="w-4 h-4" />
              <span className="text-xs">Buscar...</span>
              <kbd className="text-xs bg-white/10 px-1 rounded">⌘K</kbd>
            </button>
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
            </button>
            <Link
              href="/login"
              className="hidden md:flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all"
            >
              <User className="w-4 h-4" />
              Entrar
            </Link>
            <button
              className="lg:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0d0d18] border-t border-purple-900/30 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <div key={item.label}>
              <Link
                href={item.href}
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-600/20 rounded-lg transition-colors font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-4 border-t border-white/10">
            <Link
              href="/login"
              className="block w-full text-center px-4 py-3 text-white font-semibold bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl"
              onClick={() => setMobileOpen(false)}
            >
              Entrar / Cadastrar
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
