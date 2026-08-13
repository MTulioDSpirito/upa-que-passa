"use server";

import { redirect } from "next/navigation";
import { loginUser } from "@/lib/userAuth";

export type UserLoginActionState = { error: string } | null;

export async function userLoginAction(
  _prevState: UserLoginActionState,
  formData: FormData
): Promise<UserLoginActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/");

  if (!email || !password) {
    return { error: "Preencha e-mail e senha." };
  }

  const result = await loginUser(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  redirect(redirectTo);
}
