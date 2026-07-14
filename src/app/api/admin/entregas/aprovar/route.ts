import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await request.json();
  if (typeof id !== "string") {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  try {
    const admin = await prisma.adminUser.findUnique({
      where: { email: session.email },
    });

    if (!admin) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    await prisma.sugestaoAgente.update({
      where: { id },
      data: {
        status: "APPROVED",
        revisadoPorId: admin.id,
      },
    });
  } catch {
    return NextResponse.json({ error: "Não foi possível aprovar a sugestão." }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}
