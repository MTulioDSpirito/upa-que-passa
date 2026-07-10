"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import SearchModal from "./SearchModal";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  return (
    <>
      <Navbar />
      {!isAdmin && <Sidebar />}
      <div className={!isAdmin ? "lg:pl-56" : undefined}>
        <main className="pt-16 min-h-screen">{children}</main>
        {!isAdmin && <Footer />}
      </div>
      <SearchModal />
    </>
  );
}
