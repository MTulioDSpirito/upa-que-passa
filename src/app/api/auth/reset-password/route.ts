import { NextRequest, NextResponse } from "next/server";
import { resetUserPassword } from "@/lib/userAuth";
import { strongPasswordSchema } from "@/lib/passwordPolicy";
import { z } from "zod";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token de recuperação é obrigatório."),
  password: strongPasswordSchema,
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "A confirmação da senha não coincide com a nova senha.",
  path: ["confirmPassword"],
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const result = await resetUserPassword(parsed.data.token, parsed.data.password);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ message: result.message });
  } catch (error) {
    console.error("Erro no reset-password API:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
