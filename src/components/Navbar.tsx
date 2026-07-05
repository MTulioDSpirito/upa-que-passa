"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Bell, Gamepad2 } from "lucide-react";
import { SidebarNavLinks, AccountAuthBlock } from "./Sidebar";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-amber-900/10">
      <div className="px-4">
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

          {/* Right side — only on mobile/tablet. The desktop Sidebar already has
              search/notifications/entrar, so these would just duplicate it at lg+. */}
          <div className="flex items-center gap-2 lg:hidden">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/10 btn-press">
              <Search className="w-4 h-4" />
              <span className="text-xs hidden sm:inline">Buscar...</span>
            </button>
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors btn-press">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
            </button>
            <button
              className="lg:hidden p-2 text-gray-400 hover:text-white btn-press"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Abrir menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu — the sidebar only renders on lg+, so mobile gets the full nav here */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0d0d18] border-t border-amber-900/10 py-4">
          <SidebarNavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          <div className="px-3 pt-4 mt-4 border-t border-white/10 space-y-2">
            <button className="btn-press w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <Search className="w-4 h-4" />
              Buscar
            </button>
            <AccountAuthBlock onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  );
}
