"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import BrandHeader from "./BrandHeader";
import Footer from "./Footer";
import SearchModal from "./SearchModal";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  return (
    <>
      {!isAdmin && <BrandHeader />}
      {!isAdmin && <Navbar />}
      <div className="w-full">
        {/* We remove the padding lg:pl-56 as there's no sidebar anymore */}
        <main className="min-h-screen">{children}</main>
        {!isAdmin && <Footer />}
      </div>
      <SearchModal />
    </>
  );
}
