"use client";

import { useFetchData } from "./useFetchData";
import { NewsArticle } from "@/lib/types";

export function useAllNews(): NewsArticle[] {
  const [allNews] = useFetchData<NewsArticle[]>("/api/public/news", [], "news");
  return allNews;
}

