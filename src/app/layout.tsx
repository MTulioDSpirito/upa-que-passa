import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Russo_One } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const russoOne = Russo_One({ subsets: ["latin"], weight: "400", variable: "--font-display" });

export const metadata: Metadata = {
  title: "Upa que Passa — Reviews, Notas e Marketplace de Jogos PS5",
  description: "O maior portal brasileiro de reviews, notas e compra, venda e troca de jogos de PlayStation 5.",
  keywords: ["reviews jogos", "PS5", "marketplace jogos", "notas jogos", "troca jogos"],
  openGraph: {
    title: "Upa que Passa",
    description: "O maior portal brasileiro de reviews e marketplace de jogos PS5",
    type: "website",
  },
  icons: {
    icon: "/logo-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${russoOne.variable}`} suppressHydrationWarning>
      <body className="bg-[#07070a] text-white antialiased" suppressHydrationWarning>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
