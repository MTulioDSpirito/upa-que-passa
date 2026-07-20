import { SugestaoAgente } from "@prisma/client";

export interface ISugestaoRepository {
  findById(id: string): Promise<SugestaoAgente | null>;
  update(id: string, data: any): Promise<SugestaoAgente>;
}
