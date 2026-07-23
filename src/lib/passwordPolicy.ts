import { z } from "zod";

// Mesma política aplicada ao cadastro de SiteUser em /api/auth/register — admins
// têm mais privilégio que usuários comuns, então a senha deles não deveria ser
// mais fraca que a exigida do público.
export const strongPasswordSchema = z
  .string()
  .min(8, "Senha deve ter no mínimo 8 caracteres.")
  .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula.")
  .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
  .regex(/[0-9]/, "A senha deve conter pelo menos um número.")
  .regex(/[^a-zA-Z0-9]/, "A senha deve conter pelo menos um caractere especial (ex: !, @, #, $, etc.).");
