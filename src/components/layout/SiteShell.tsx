"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import BrandHeader from "./BrandHeader";
import Footer from "./Footer";
import SearchModal from "./SearchModal";
import { ToastProvider } from "@/components/ui/Toast";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  return (
    <ToastProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-purple-600 focus:text-white focus:font-semibold"
      >
        Pular para o conteúdo
      </a>
      {!isAdmin && <BrandHeader />}
      {!isAdmin && <Navbar />}
      <div className="w-full">
        {/* We remove the padding lg:pl-56 as there's no sidebar anymore */}
        <main id="main-content" className="min-h-screen">{children}</main>
        {!isAdmin && <Footer />}
      </div>
      <SearchModal />
    </ToastProvider>
  );
}
