import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Russo_One } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/layout/SiteShell";


const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const russoOne = Russo_One({ subsets: ["latin"], weight: "400", variable: "--font-display" });

export const metadata: Metadata = {
  title: "Upa que Passa — Reviews e Notas de Jogos PS5",
  description: "O maior portal brasileiro de reviews e notas de jogos de PlayStation 5.",
  keywords: ["reviews jogos", "PS5", "notas jogos", "lançamentos jogos"],
  openGraph: {
    title: "Upa que Passa",
    description: "O maior portal brasileiro de reviews e notas de jogos PS5",
    type: "website",
  },
  icons: {
    icon: "/logo-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${russoOne.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect pros CDNs de imagem mais usados no site — adianta DNS/TLS
            antes da primeira imagem começar a baixar, sem precisar migrar pra
            next/image (que exigiria cadastrar cada domínio externo). */}
        <link rel="preconnect" href="https://media.rawg.io" />
        <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" />
        <link rel="preconnect" href="https://upload.wikimedia.org" />
        <link rel="preconnect" href="https://api.dicebear.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://media.rawg.io" />
        <link rel="dns-prefetch" href="https://cdn.cloudflare.steamstatic.com" />
        <link rel="dns-prefetch" href="https://upload.wikimedia.org" />
        <link rel="dns-prefetch" href="https://api.dicebear.com" />
      </head>
      <body className="bg-[#07070a] text-white antialiased overflow-x-hidden" suppressHydrationWarning>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
