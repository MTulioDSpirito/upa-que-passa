import { AdminUser } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { IAdminUserRepository } from "@/core/repositories/AdminUserRepository";

export class PrismaAdminUserRepository implements IAdminUserRepository {
  async findByEmail(email: string): Promise<AdminUser | null> {
    return prisma.adminUser.findUnique({
      where: { email },
    });
  }
}
