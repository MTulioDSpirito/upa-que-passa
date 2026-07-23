import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const uf = searchParams.get("uf");

  if (!uf) {
    return NextResponse.json({ error: "UF é obrigatória" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`,
      {
        next: { revalidate: 86400 }, // Cache for 24h
      }
    );
    if (!res.ok) {
      throw new Error(`IBGE API returned ${res.status}`);
    }
    const data = await res.json();
    const cities = data.map((m: any) => m.nome);
    return NextResponse.json(cities);
  } catch (error: any) {
    console.error("Error fetching cities from IBGE proxy:", error);
    return NextResponse.json({ error: "Erro ao obter cidades" }, { status: 500 });
  }
}
