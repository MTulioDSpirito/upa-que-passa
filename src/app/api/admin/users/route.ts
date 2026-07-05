import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const users = await prisma.siteUser.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      nickname: true,
      email: true,
      avatar: true,
      console: true,
      city: true,
      state: true,
      active: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ users });
}
