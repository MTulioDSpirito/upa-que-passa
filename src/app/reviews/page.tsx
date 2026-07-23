import { readAdminReviews } from "@/lib/adminReviews";
import { readAdminGames } from "@/lib/adminGames";
import ReviewsClient from "./ReviewsClient";

export const revalidate = 60;

export default async function ReviewsPage() {
  const [reviews, games] = await Promise.all([
    readAdminReviews(),
    readAdminGames(),
  ]);

  return <ReviewsClient initialReviews={reviews} initialGames={games} />;
}
