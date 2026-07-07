import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readAdminGames, appendAdminGame } from "@/lib/adminGames";
import { GAMES } from "@/lib/data";
import { Game } from "@/lib/types";

function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const BLOCKED_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1", "169.254.169.254"]);

function isSafeImageUrl(raw: string): boolean {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  const host = url.hostname.toLowerCase();
  if (BLOCKED_HOSTS.has(host)) return false;
  if (/^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.)/.test(host)) return false;
  return true;
}

export async function GET() {
  const games = await readAdminGames();
  return NextResponse.json({ games });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json();
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const cover = typeof body.cover === "string" ? body.cover.trim() : "";
  const developer = typeof body.developer === "string" ? body.developer.trim() : "";
  const publisher = typeof body.publisher === "string" ? body.publisher.trim() : "";
  const releaseDate = typeof body.releaseDate === "string" ? body.releaseDate.trim() : "";
  const synopsis = typeof body.synopsis === "string" ? body.synopsis.trim() : "";
  const genres: string[] = Array.isArray(body.genres) ? body.genres : [];
  const platforms: string[] = Array.isArray(body.platforms) ? body.platforms : [];
  const suggestedPrice = Number(body.suggestedPrice) || 0;

  if (!title || !cover || !developer || !releaseDate || genres.length === 0 || platforms.length === 0) {
    return NextResponse.json(
      { error: "Preencha título, capa, desenvolvedora, data de lançamento, gêneros e plataformas." },
      { status: 400 }
    );
  }

  if (!isSafeImageUrl(cover)) {
    return NextResponse.json(
      { error: "URL da capa inválida — só são aceitos links http(s) para hosts públicos." },
      { status: 400 }
    );
  }

  try {
    const imgRes = await fetch(cover, { method: "HEAD" });
    if (!imgRes.ok) {
      return NextResponse.json(
        { error: `A URL da capa retornou HTTP ${imgRes.status} — não é uma imagem válida.` },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Não foi possível acessar a URL da capa. Verifique o link antes de salvar." },
      { status: 400 }
    );
  }

  const existing = await readAdminGames();
  const baseSlug = slugify(title);
  const slugTaken = (s: string) => GAMES.some((g) => g.slug === s) || existing.some((g) => g.slug === s);
  const slug = slugTaken(baseSlug) ? `${baseSlug}-${Date.now()}` : baseSlug;

  const game: Game = {
    id: `admin-${Date.now()}`,
    slug,
    title,
    cover,
    gallery: [cover],
    description: `${title} foi adicionado ao catálogo pela equipe de conteúdo do Upa que Passa.`,
    synopsis: synopsis || `${title} é um jogo desenvolvido por ${developer}.`,
    developer,
    publisher: publisher || developer,
    releaseDate,
    suggestedPrice,
    platforms,
    genres,
    online: false,
    offline: true,
    maxPlayers: 1,
    languages: ["Português (BR)", "Inglês"],
    subtitles: ["Português (BR)", "Inglês"],
    dubbing: [],
    ageRating: "L",
    links: [],
    userScore: 0,
    siteScores: [],
  };

  await appendAdminGame(game);

  return NextResponse.json({ game }, { status: 201 });
}
