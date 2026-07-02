import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { moveEntrega } from "@/lib/entregas";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { filename } = await request.json();
  if (typeof filename !== "string" || !filename.endsWith(".md")) {
    return NextResponse.json({ error: "Nome de arquivo inválido." }, { status: 400 });
  }

  try {
    await moveEntrega(filename, "pendentes", "aprovados", `<!-- aprovado por ${session.name} em ${new Date().toISOString()} -->`);
  } catch {
    return NextResponse.json({ error: "Não foi possível aprovar. O arquivo já foi movido?" }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}
