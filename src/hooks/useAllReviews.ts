"use client";

import { useFetchData } from "./useFetchData";
import { Review } from "@/lib/types";

export function useAllReviews(): Review[] {
  const [allReviews] = useFetchData<Review[]>("/api/public/reviews", [], "reviews");
  return allReviews;
}

