import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { moveEntrega } from "@/lib/entregas";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { filename, motivo } = await request.json();
  if (typeof filename !== "string" || !filename.endsWith(".md")) {
    return NextResponse.json({ error: "Nome de arquivo inválido." }, { status: 400 });
  }

  const note = `<!-- rejeitado por ${session.name} em ${new Date().toISOString()}${motivo ? ` — motivo: ${motivo}` : ""} -->`;

  try {
    await moveEntrega(filename, "pendentes", "rejeitados", note);
  } catch {
    return NextResponse.json({ error: "Não foi possível rejeitar. O arquivo já foi movido?" }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}
