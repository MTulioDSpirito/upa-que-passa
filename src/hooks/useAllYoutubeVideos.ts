"use client";

import { useEffect, useState } from "react";
import { YoutubeVideo } from "@/lib/types";

export function useAllYoutubeVideos(): YoutubeVideo[] {
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);

  useEffect(() => {
    fetch("/api/public/youtube")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.videos) setVideos(data.videos);
      })
      .catch(() => {});
  }, []);

  return videos;
}
