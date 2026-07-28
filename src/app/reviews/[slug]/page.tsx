import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readAdminGames } from "@/lib/adminGames";
import { readAdminReviews } from "@/lib/adminReviews";
import { SITE_URL } from "@/lib/site";
import ReviewClient from "./ReviewClient";

interface Props { params: Promise<{ slug: string }> }

export const revalidate = 60;

async function getGameData(slug: string) {
  const [games, reviews] = await Promise.all([
    readAdminGames(),
    readAdminReviews(),
  ]);
  const game = games.find((g) => g.slug === slug) ?? null;
  const review = game ? reviews.find((r) => r.gameId === game.id) ?? null : null;
  const relatedGames = game
    ? games
        .filter((g) => g.id !== game.id && g.genres.some((genre) => game.genres.includes(genre)))
        .slice(0, 3)
    : [];
  return { game, review, relatedGames };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { game, review } = await getGameData(slug);
  if (!game) return { title: "Jogo não encontrado — Upa que Passa" };

  const url = `${SITE_URL}/reviews/${game.slug}`;
  const description = review
    ? review.conclusion || review.text.slice(0, 160)
    : `Ficha técnica, notas e comentários da comunidade sobre ${game.title}.`;

  return {
    title: `${game.title} — Review e Notas | Upa que Passa`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: game.title,
      description,
      type: "article",
      url,
      images: game.cover ? [{ url: game.cover }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: game.title,
      description,
      images: game.cover ? [game.cover] : undefined,
    },
  };
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const { game, review, relatedGames } = await getGameData(slug);

  if (!game) notFound();

  const jsonLd = review
    ? {
        "@context": "https://schema.org",
        "@type": "Review",
        itemReviewed: { "@type": "VideoGame", name: game.title, image: game.cover },
        reviewRating: { "@type": "Rating", ratingValue: review.overallScore, bestRating: 10 },
        author: { "@type": "Organization", name: "Upa que Passa" },
        datePublished: review.publishedAt,
      }
    : {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        name: game.title,
        image: game.cover,
        genre: game.genres,
      };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReviewClient game={game} review={review} relatedGames={relatedGames} />
    </>
  );
}
