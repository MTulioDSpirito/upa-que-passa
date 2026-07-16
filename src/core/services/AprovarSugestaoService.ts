import { IAdminUserRepository } from "../repositories/AdminUserRepository";
import { ISugestaoRepository } from "../repositories/SugestaoRepository";
import { IPublisher } from "../publishers";

export interface AprovarSugestaoInput {
  id: string;
  email: string;
  titulo?: string | null;
  slug?: string | null;
  fontes?: string | string[] | null;
  payload?: any;
}

export class UserNotFoundError extends Error {
  constructor() {
    super("Usuário não encontrado.");
    this.name = "UserNotFoundError";
  }
}

export class SugestaoNotFoundError extends Error {
  constructor() {
    super("Sugestão não encontrada.");
    this.name = "SugestaoNotFoundError";
  }
}

export class AprovarSugestaoService {
  constructor(
    private adminUserRepo: IAdminUserRepository,
    private sugestaoRepo: ISugestaoRepository,
    private publishers: Record<string, IPublisher>
  ) {}

  async execute(input: AprovarSugestaoInput): Promise<void> {
    const admin = await this.adminUserRepo.findByEmail(input.email);
    if (!admin) {
      throw new UserNotFoundError();
    }

    const existing = await this.sugestaoRepo.findById(input.id);
    if (!existing) {
      throw new SugestaoNotFoundError();
    }

    const updatedTitulo = input.titulo ?? existing.titulo;
    const updatedSlug = input.slug ?? existing.slug;
    const updatedFontes = input.fontes !== undefined && input.fontes !== null
      ? (Array.isArray(input.fontes) ? input.fontes : [input.fontes])
      : (existing.fontes as any);
    const updatedPayload = input.payload ?? (existing.payload as any);

    // Salvar atualização e aprovação no banco de dados
    const sugestao = await this.sugestaoRepo.update(input.id, {
      titulo: updatedTitulo,
      slug: updatedSlug,
      fontes: updatedFontes,
      payload: updatedPayload,
      status: "APPROVED",
      revisadoPorId: admin.id,
    });

    const authorName = admin.avatar ? `${admin.name} · ${admin.avatar}` : admin.name;

    const publisher = this.publishers[sugestao.tipo];
    if (publisher) {
      await publisher.publish(sugestao, authorName, updatedPayload);
    }
  }
}
