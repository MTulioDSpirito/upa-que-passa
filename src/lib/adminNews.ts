import fs from "fs/promises";
import path from "path";
import { NewsArticle } from "./types";
import { prisma } from "./prisma";

const DELETED_STATIC_PATH = path.join(process.cwd(), "data", "deleted-static-news.json");

export async function readAdminNews(): Promise<NewsArticle[]> {
  const dbNews = await prisma.newsArticle.findMany({
    orderBy: { createdAt: "desc" }
  });
  return dbNews.map((n) => ({
    id: n.id,
    slug: n.slug,
    title: n.title,
    excerpt: n.excerpt,
    content: n.content,
    cover: n.cover,
    author: n.author,
    publishedAt: n.publishedAt,
    category: n.category,
    tags: n.tags,
    views: n.views,
    likes: n.likes,
    imageCredits: n.imageCredits ?? undefined,
    fontes: n.fontes ?? undefined,
  }));
}

export async function writeAdminNews(newsList: NewsArticle[]): Promise<void> {
  for (const n of newsList) {
    await prisma.newsArticle.upsert({
      where: { id: n.id },
      update: {
        slug: n.slug,
        title: n.title,
        excerpt: n.excerpt || "",
        content: n.content || "",
        cover: n.cover || "",
        author: n.author || "Redação",
        publishedAt: n.publishedAt,
        category: n.category || "Notícias",
        tags: n.tags || [],
        views: n.views,
        likes: n.likes,
        imageCredits: n.imageCredits || null,
        fontes: n.fontes || null,
      },
      create: {
        id: n.id,
        slug: n.slug,
        title: n.title,
        excerpt: n.excerpt || "",
        content: n.content || "",
        cover: n.cover || "",
        author: n.author || "Redação",
        publishedAt: n.publishedAt,
        category: n.category || "Notícias",
        tags: n.tags || [],
        views: n.views,
        likes: n.likes,
        imageCredits: n.imageCredits || null,
        fontes: n.fontes || null,
      }
    });
  }
}

export async function appendAdminNews(news: NewsArticle): Promise<void> {
  await writeAdminNews([news]);
}

export async function readDeletedStaticNewsIds(): Promise<string[]> {
  try {
    const raw = await fs.readFile(DELETED_STATIC_PATH, "utf-8");
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export async function writeDeletedStaticNewsIds(ids: string[]): Promise<void> {
  await fs.mkdir(path.dirname(DELETED_STATIC_PATH), { recursive: true });
  const tmpPath = `${DELETED_STATIC_PATH}.${process.pid}.tmp`;
  await fs.writeFile(tmpPath, JSON.stringify(ids, null, 2), "utf-8");
  await fs.rename(tmpPath, DELETED_STATIC_PATH);
}

export async function getMergedAdminNews(): Promise<NewsArticle[]> {
  return readAdminNews();
}
