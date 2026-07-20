import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

  const page = parseInt(pageParam || "1", 10) || 1;
  const limit = parseInt(limitParam || "10", 10) || 10;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (search.trim()) {
    where.OR = [
      { nickname: { contains: search.trim(), mode: "insensitive" } },
      { email: { contains: search.trim(), mode: "insensitive" } },
    ];
  }

  const [total, users] = await Promise.all([
    prisma.siteUser.count({ where }),
    prisma.siteUser.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
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
    }),
  ]);

  return NextResponse.json({
    users,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  });
}
