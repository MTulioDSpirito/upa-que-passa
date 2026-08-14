import type { NextConfig } from "next";

// 'unsafe-inline' é necessário mesmo em produção: o Next.js injeta o payload de
// hidratação (RSC) via <script> inline, e não há como gerar um nonce por
// requisição para páginas estáticas/ISR (o HTML é gerado uma vez no build ou a
// cada revalidação, não a cada request — não existe nonce "certo" possível).
// Sem isso, o React nunca hidrata: a página aparece renderizada mas nenhum botão,
// formulário, paginação ou carrossel funciona. Tentamos CSP com nonce por
// requisição via middleware antes disso; funcionava nas poucas rotas 100%
// dinâmicas, mas quebrava todas as páginas estáticas/ISR (home, /noticias,
// /reviews, /ranking, etc.), que são a maioria do site.
const isDev = process.env.NODE_ENV === "development";
const scriptSrc = `'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com`;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.api.playstation.com" },
      { protocol: "https", hostname: "cdn.mos.cms.futurecdn.net" },
      { protocol: "https", hostname: "www.pushsquare.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "assets.epicgames.com" },
      { protocol: "https", hostname: "images.igdb.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "www.gamesradar.com" },
      { protocol: "https", hostname: "www.rockstargames.com" },
      { protocol: "https", hostname: "blog.playstation.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self'; connect-src 'self'; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://challenges.cloudflare.com;`,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
