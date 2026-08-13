import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/userAuth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "Senha é obrigatória."),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const result = await loginUser(parsed.data.email, parsed.data.password);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.user);
}
