import type { NextConfig } from "next";

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
  // Content-Security-Policy fica no middleware (src/proxy.ts) porque precisa de um
  // nonce diferente a cada requisição — aqui só ficam os headers que não mudam.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
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
