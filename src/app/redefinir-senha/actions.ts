"use server";

import { resetUserPassword } from "@/lib/userAuth";
import { strongPasswordSchema } from "@/lib/passwordPolicy";

export type ResetPasswordActionState = { error: string } | { success: string } | null;

export async function resetPasswordAction(
  _prevState: ResetPasswordActionState,
  formData: FormData
): Promise<ResetPasswordActionState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!token) {
    return { error: "Token de redefinição inválido ou ausente." };
  }

  if (!password || !confirmPassword) {
    return { error: "Por favor, preencha todos os campos." };
  }

  if (password !== confirmPassword) {
    return { error: "A confirmação da senha não coincide com a nova senha." };
  }

  const parsed = strongPasswordSchema.safeParse(password);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const result = await resetUserPassword(token, password);
  if (!result.ok) {
    return { error: result.error };
  }

  return { success: result.message };
}
