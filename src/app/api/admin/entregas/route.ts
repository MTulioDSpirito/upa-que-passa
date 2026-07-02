import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { listEntregas } from "@/lib/entregas";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const [pendentes, aprovados, rejeitados] = await Promise.all([
    listEntregas("pendentes"),
    listEntregas("aprovados"),
    listEntregas("rejeitados"),
  ]);

  return NextResponse.json({ pendentes, aprovados, rejeitados });
}
