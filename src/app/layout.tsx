import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Upa que Passa — Reviews, Notas e Marketplace de Jogos PS5",
  description: "O maior portal brasileiro de reviews, notas e compra, venda e troca de jogos de PlayStation 5.",
  keywords: ["reviews jogos", "PS5", "marketplace jogos", "notas jogos", "troca jogos"],
  openGraph: {
    title: "Upa que Passa",
    description: "O maior portal brasileiro de reviews e marketplace de jogos PS5",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={geist.variable}>
      <body className="bg-[#0a0a0f] text-white antialiased">
        <Navbar />
        <main className="pt-16 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
