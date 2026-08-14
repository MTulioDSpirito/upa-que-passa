"use server";

import { redirect } from "next/navigation";
import { loginUser } from "@/lib/userAuth";

export type UserLoginActionState = { error?: string; success?: boolean; redirectTo?: string } | null;

export async function userLoginAction(
  _prevState: UserLoginActionState,
  formData: FormData
): Promise<UserLoginActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  let redirectTo = String(formData.get("redirectTo") ?? "/");
  
  // Impede vulnerabilidade de Open Redirect sanitizando o caminho (deve começar com '/' e não com '//')
  if (!redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    redirectTo = "/";
  }

  if (!email || !password) {
    return { error: "Preencha e-mail e senha." };
  }

  const result = await loginUser(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  return { success: true, redirectTo };
}
