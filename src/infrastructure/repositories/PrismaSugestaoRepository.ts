import { SugestaoAgente } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ISugestaoRepository } from "@/core/repositories/SugestaoRepository";

export class PrismaSugestaoRepository implements ISugestaoRepository {
  async findById(id: string): Promise<SugestaoAgente | null> {
    return prisma.sugestaoAgente.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: any): Promise<SugestaoAgente> {
    return prisma.sugestaoAgente.update({
      where: { id },
      data,
    });
  }
}
