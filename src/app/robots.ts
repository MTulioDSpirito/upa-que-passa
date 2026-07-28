import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/perfil", "/login", "/cadastrar", "/marketplace/vender"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
