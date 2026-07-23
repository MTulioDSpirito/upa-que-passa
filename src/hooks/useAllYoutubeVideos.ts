"use client";

import { useFetchData } from "./useFetchData";
import { YoutubeVideo } from "@/lib/types";

export function useAllYoutubeVideos(): YoutubeVideo[] {
  const [videos] = useFetchData<YoutubeVideo[]>("/api/public/youtube", [], "videos");
  return videos;
}

