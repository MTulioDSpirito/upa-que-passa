import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const id = searchParams.get("id");

  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) {
    console.error("RAWG_API_KEY não configurada no .env");
    return NextResponse.json({ error: "Busca externa indisponível: RAWG_API_KEY não configurada." }, { status: 500 });
  }

  try {
    if (id) {
      // Fetch details and screenshots of a single game in parallel
      const [detailsRes, screenshotsRes] = await Promise.all([
        fetch(`https://api.rawg.io/api/games/${id}?key=${apiKey}`),
        fetch(`https://api.rawg.io/api/games/${id}/screenshots?key=${apiKey}`)
      ]);

      if (!detailsRes.ok) {
        throw new Error("Erro ao buscar detalhes no RAWG");
      }

      const [data, screenshotsData] = await Promise.all([
        detailsRes.json(),
        screenshotsRes.ok ? screenshotsRes.json() : { results: [] }
      ]);
      
      const developers = data.developers?.map((d: any) => d.name).join(", ") || "Independente";
      const publishers = data.publishers?.map((p: any) => p.name).join(", ") || "Independente";
      const gallery = screenshotsData.results?.slice(0, 4).map((item: any) => item.image) || [];

      return NextResponse.json({
        developer: developers,
        publisher: publishers,
        description: data.description_raw || "",
        metacriticScore: data.metacritic || null,
        gallery,
      });
    }

    if (query) {
      // Search games
      const res = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(query)}&key=${apiKey}&page_size=5`);
      if (!res.ok) {
        throw new Error("Erro ao buscar no RAWG");
      }
      const data = await res.json();
      
      const games = data.results?.map((item: any) => ({
        id: item.id,
        title: item.name,
        cover: item.background_image || "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800",
        releaseDate: item.released || "",
        platforms: item.platforms?.map((p: any) => p.platform.name) || [],
        genres: item.genres?.map((g: any) => g.name) || [],
      })) || [];

      return NextResponse.json({ games });
    }

    return NextResponse.json({ error: "Parâmetros query ou id ausentes." }, { status: 400 });
  } catch (error: any) {
    console.error("Erro na busca do RAWG:", error);
    return NextResponse.json({ error: "Falha ao conectar à API do RAWG." }, { status: 500 });
  }
}
