import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const team = await prisma.adminUser.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({ team });
  } catch (error) {
    console.error("Erro ao buscar equipe:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
