"use client";

import { useEffect, useState } from "react";
import { NewsArticle } from "@/lib/types";

export function useAllNews(): NewsArticle[] {
  const [allNews, setAllNews] = useState<NewsArticle[]>([]);

  useEffect(() => {
    fetch("/api/public/news")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.news) setAllNews(data.news);
      })
      .catch(() => {});
  }, []);

  return allNews;
}
