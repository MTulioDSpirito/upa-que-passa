"use server";

import { redirect } from "next/navigation";
import { loginAdmin } from "@/lib/adminAuth";

export type AdminLoginActionState = { error: string } | null;

export async function adminLoginAction(
  _prevState: AdminLoginActionState,
  formData: FormData
): Promise<AdminLoginActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/admin");

  if (!email || !password) {
    return { error: "Preencha e-mail e senha." };
  }

  const result = await loginAdmin(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  redirect(redirectTo);
}
