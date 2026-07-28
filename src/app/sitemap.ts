import type { MetadataRoute } from "next";
import { readAdminNews } from "@/lib/adminNews";
import { readAdminReviews } from "@/lib/adminReviews";
import { readAdminGames } from "@/lib/adminGames";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, reviews, games] = await Promise.all([
    readAdminNews(),
    readAdminReviews(),
    readAdminGames(),
  ]);

  const gameById = new Map(games.map((g) => [g.id, g]));

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/noticias`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/reviews`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/ranking`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/lancamentos`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/marketplace`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/quem-somos`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const newsRoutes: MetadataRoute.Sitemap = news.map((n) => ({
    url: `${SITE_URL}/noticias/${n.slug}`,
    lastModified: n.publishedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const reviewRoutes: MetadataRoute.Sitemap = reviews
    .map((r) => gameById.get(r.gameId))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))
    .map((g) => ({
      url: `${SITE_URL}/reviews/${g.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...newsRoutes, ...reviewRoutes];
}
