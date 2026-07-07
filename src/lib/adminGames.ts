import fs from "fs/promises";
import path from "path";
import { Game } from "./types";

const STORE_PATH = path.join(process.cwd(), "data", "admin-games.json");

export async function readAdminGames(): Promise<Game[]> {
  let raw: string;
  try {
    raw = await fs.readFile(STORE_PATH, "utf-8");
  } catch {
    return [];
  }
  try {
    return JSON.parse(raw) as Game[];
  } catch (err) {
    console.error(`[adminGames] ${STORE_PATH} has invalid JSON, ignoring file:`, err);
    return [];
  }
}

export async function appendAdminGame(game: Game): Promise<void> {
  const games = await readAdminGames();
  games.push(game);
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  // Write to a temp file then rename (atomic on the same filesystem) so a crash
  // mid-write can never leave admin-games.json truncated/corrupted.
  const tmpPath = `${STORE_PATH}.${process.pid}.tmp`;
  await fs.writeFile(tmpPath, JSON.stringify(games, null, 2), "utf-8");
  await fs.rename(tmpPath, STORE_PATH);
}
