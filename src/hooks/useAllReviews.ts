"use client";

import { useEffect, useState } from "react";
import { Review } from "@/lib/types";

export function useAllReviews(): Review[] {
  const [allReviews, setAllReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch(`/api/public/reviews?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.reviews) {
          setAllReviews(data.reviews);
        }
      })
      .catch(() => {});
  }, []);

  return allReviews;
}
