import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";
import { z } from "zod";

const createAdminSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres."),
  email: z.string().toLowerCase().trim().email("E-mail inválido."),
  role: z.enum(["DEVELOPER", "COLABORADOR"], { message: "Cargo inválido." }),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres."),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  if (session.role !== "DEVELOPER") {
    return NextResponse.json({ error: "Acesso negado. Apenas desenvolvedores podem gerenciar a equipe." }, { status: 403 });
  }

  try {
    const admins = await prisma.adminUser.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        avatar: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ admins });
  } catch (error) {
    console.error("Erro ao listar equipe administrativa:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  if (session.role !== "DEVELOPER") {
    return NextResponse.json({ error: "Acesso negado. Apenas desenvolvedores podem gerenciar a equipe." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = createAdminSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { name, email, role, password } = parsed.data;

    // Check if email already in use
    const conflict = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (conflict) {
      return NextResponse.json({ error: "E-mail já cadastrado na equipe." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const newAdmin = await prisma.adminUser.create({
      data: {
        name,
        email,
        role,
        passwordHash,
        active: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        avatar: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ admin: newAdmin }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar administrador:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
