import { readAdminGames } from "@/lib/adminGames";
import RankingClient from "./RankingClient";

export const revalidate = 60;

export default async function RankingPage() {
  const games = await readAdminGames();
  return <RankingClient initialGames={games} />;
}
