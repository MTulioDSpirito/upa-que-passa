import type { NextConfig } from "next";

// Em dev, o runtime do Turbopack precisa tanto de eval() quanto de <script> inline
// pra fazer o hot-reload de módulos (bootstrap injeta scripts inline de verdade,
// não só eval) — sem os dois o HMR quebra e a página nunca termina de carregar no
// navegador. Em produção nenhum dos dois é necessário e enfraquece a CSP contra XSS,
// então só liberamos em dev. O app não usa <script> inline nem eval() no próprio
// código (grep confirmou) — isso é só para o runtime de desenvolvimento do Next.
const scriptSrc = process.env.NODE_ENV === "production" 
  ? "'self' https://challenges.cloudflare.com" 
  : "'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com";

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
