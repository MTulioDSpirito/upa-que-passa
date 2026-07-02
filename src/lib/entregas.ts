import fs from "fs/promises";
import path from "path";
import { load as loadYaml } from "js-yaml";

const ENTREGAS_ROOT = path.join(process.cwd(), "Equipe", "Entregas");

export type EntregaStatus = "pendentes" | "aprovados" | "rejeitados";

export interface Entrega {
  filename: string;
  status: EntregaStatus;
  frontmatter: Record<string, unknown>;
  body: string;
  raw: string;
}

function statusDir(status: EntregaStatus): string {
  return path.join(ENTREGAS_ROOT, status);
}

function parseDraft(raw: string): { frontmatter: Record<string, unknown>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: raw };

  const [, frontmatterBlock, body] = match;
  try {
    const parsed = loadYaml(frontmatterBlock);
    return { frontmatter: (parsed as Record<string, unknown>) ?? {}, body: body.trim() };
  } catch {
    return { frontmatter: {}, body: raw };
  }
}

export async function listEntregas(status: EntregaStatus): Promise<Entrega[]> {
  const dir = statusDir(status);
  let files: string[];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  const mdFiles = files.filter((f) => f.endsWith(".md")).sort().reverse();

  const entregas = await Promise.all(
    mdFiles.map(async (filename) => {
      const raw = await fs.readFile(path.join(dir, filename), "utf-8");
      const { frontmatter, body } = parseDraft(raw);
      return { filename, status, frontmatter, body, raw };
    })
  );

  return entregas;
}

export async function moveEntrega(
  filename: string,
  from: EntregaStatus,
  to: EntregaStatus,
  notePrefix?: string
): Promise<void> {
  const safeFilename = path.basename(filename);
  const fromPath = path.join(statusDir(from), safeFilename);
  const toPath = path.join(statusDir(to), safeFilename);

  if (notePrefix) {
    const raw = await fs.readFile(fromPath, "utf-8");
    await fs.writeFile(fromPath, `${notePrefix}\n\n${raw}`, "utf-8");
  }

  await fs.rename(fromPath, toPath);
}
