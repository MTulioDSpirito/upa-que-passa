import { AdminUser } from "@prisma/client";

export interface IAdminUserRepository {
  findByEmail(email: string): Promise<AdminUser | null>;
}
