import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const sugestoes = await prisma.sugestaoAgente.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      revisadoPor: {
        select: {
          name: true,
        },
      },
    },
  });

  const pendentes = sugestoes.filter((s) => s.status === "PENDING");
  const aprovados = sugestoes.filter((s) => s.status === "APPROVED");
  const rejeitados = sugestoes.filter((s) => s.status === "REJECTED");

  return NextResponse.json({ pendentes, aprovados, rejeitados });
}
