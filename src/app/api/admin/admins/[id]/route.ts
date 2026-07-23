import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";
import { strongPasswordSchema } from "@/lib/passwordPolicy";
import { z } from "zod";

const updateAdminSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres.").optional(),
  email: z.string().toLowerCase().trim().email("E-mail inválido.").optional(),
  role: z.enum(["DEVELOPER", "COLABORADOR"], { message: "Cargo inválido." }).optional(),
  active: z.boolean({ message: "active deve ser booleano." }).optional(),
  password: strongPasswordSchema.optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  if (session.role !== "DEVELOPER") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateAdminSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const existing = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Administrador não encontrado." }, { status: 404 });
    }

    // Safety checks: a developer cannot disable themselves or change their own role
    if (session.sub === id) {
      if (parsed.data.active === false) {
        return NextResponse.json({ error: "Você não pode desativar seu próprio usuário." }, { status: 400 });
      }
      if (parsed.data.role && parsed.data.role !== "DEVELOPER") {
        return NextResponse.json({ error: "Você não pode remover seu próprio cargo de DEVELOPER." }, { status: 400 });
      }
    }

    const { name, email, role, active, password } = parsed.data;
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (active !== undefined) updateData.active = active;

    if (email !== undefined) {
      // Check email uniqueness
      const conflict = await prisma.adminUser.findFirst({
        where: {
          email,
          id: { not: id },
        },
      });
      if (conflict) {
        return NextResponse.json({ error: "E-mail já está em uso por outro administrador." }, { status: 409 });
      }
      updateData.email = email;
    }

    if (password !== undefined) {
      updateData.passwordHash = await hashPassword(password);
    }

    const updatedAdmin = await prisma.adminUser.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ admin: updatedAdmin });
  } catch (error) {
    console.error("Erro ao atualizar administrador:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
