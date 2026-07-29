import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const include = {
    revisadoPor: {
      select: {
        name: true,
      },
    },
  } as const;

  const [pendentes, aprovados, rejeitados] = await Promise.all([
    prisma.sugestaoAgente.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include,
    }),
    prisma.sugestaoAgente.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 100,
      include,
    }),
    prisma.sugestaoAgente.findMany({
      where: { status: "REJECTED" },
      orderBy: { createdAt: "desc" },
      take: 100,
      include,
    }),
  ]);

  return NextResponse.json({ pendentes, aprovados, rejeitados });
}
