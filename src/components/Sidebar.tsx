"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Star, Gamepad2, Newspaper, ShoppingBag, Trophy, Rocket, Search, Bell, User } from "lucide-react";

export const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Reviews", href: "/reviews", icon: Star },
  { label: "Jogos", href: "/jogos", icon: Gamepad2 },
  { label: "Notícias", href: "/noticias", icon: Newspaper },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { label: "Ranking", href: "/ranking", icon: Trophy },
  { label: "Lançamentos", href: "/lancamentos", icon: Rocket },
];

export function SidebarNavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-0.5 px-3">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`btn-press flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              active
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <item.icon className={`w-4 h-4 ${active ? "text-amber-400" : ""}`} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

// Persistent left navigation rail, IGN-style. Desktop only (lg+) — the mobile
// equivalent is the drawer in Navbar.tsx, which reuses NAV_ITEMS/SidebarNavLinks
// above so the two never drift apart. Amber accent is intentional: distinct from
// the site's purple/blue brand pair, but already present in the palette (the
// "hot/trending" Flame badges), so it reads as a variation, not a clash.
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col fixed top-16 left-0 w-56 h-[calc(100vh-4rem)] bg-[#0d0d18] border-r border-amber-900/10 py-6 overflow-y-auto z-40">
      <SidebarNavLinks pathname={pathname} />

      <div className="mt-6 px-3 space-y-0.5">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-600">Conta</div>
        <button className="btn-press w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <Search className="w-4 h-4" />
          Buscar
          <kbd className="ml-auto text-[10px] bg-white/10 px-1.5 py-0.5 rounded">⌘K</kbd>
        </button>
        <button className="btn-press relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <Bell className="w-4 h-4" />
          Notificações
          <span className="ml-auto w-2 h-2 bg-amber-500 rounded-full" />
        </button>
      </div>

      <div className="mt-auto px-3 pt-4">
        <Link
          href="/login"
          className="btn-press flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#0d0d18] bg-amber-400 hover:bg-amber-300 rounded-xl transition-all"
        >
          <User className="w-4 h-4" />
          Entrar
        </Link>
      </div>
    </aside>
  );
}
