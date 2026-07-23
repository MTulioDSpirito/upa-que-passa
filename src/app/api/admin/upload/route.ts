import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

// Detecta o tipo real da imagem pelos primeiros bytes do arquivo (magic bytes),
// em vez de confiar no Content-Type informado pelo cliente (facilmente falsificável).
// SVG é propositalmente excluído: é XML e pode conter <script>, habilitando XSS
// armazenado se servido do mesmo domínio.
function detectImageExtension(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return ".png";
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return ".jpg";
  }
  if (buffer.slice(0, 4).toString("ascii") === "GIF8") {
    return ".gif";
  }
  if (buffer.slice(0, 4).toString("ascii") === "RIFF" && buffer.slice(8, 12).toString("ascii") === "WEBP") {
    return ".webp";
  }
  return null;
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    // Validação de tamanho: 2MB (2 * 1024 * 1024)
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "A imagem não pode exceder o limite de 2MB." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validação de tipo de arquivo pelo conteúdo real, não pelo Content-Type do cliente
    const detectedExt = detectImageExtension(buffer);
    if (!detectedExt) {
      return NextResponse.json(
        { error: "O arquivo precisa ser uma imagem válida (PNG, JPG, GIF ou WEBP)." },
        { status: 400 }
      );
    }

    // Determina o subdiretório de destino com base no parâmetro "type"
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // ex: 'news' ou 'reviews'

    let relativeFolder = "uploads";
    if (type === "news") {
      relativeFolder = "uploads/news";
    } else if (type === "reviews") {
      relativeFolder = "uploads/reviews";
    }

    const uploadsDir = path.join(process.cwd(), "public", ...relativeFolder.split("/"));
    await fs.mkdir(uploadsDir, { recursive: true });

    // Gerar um nome único baseado no timestamp e no nome original limpo;
    // a extensão vem do tipo real detectado, não do nome/Content-Type enviado pelo cliente.
    const baseName = path.basename(file.name, path.extname(file.name)).replace(/[^a-zA-Z0-9_-]/g, "_");
    const fileName = `${Date.now()}-${baseName}${detectedExt}`;
    const filePath = path.join(uploadsDir, fileName);

    await fs.writeFile(filePath, buffer);

    // Retorna a URL pública do arquivo
    return NextResponse.json({ url: `/${relativeFolder}/${fileName}` });
  } catch (error: any) {
    console.error("Erro no upload de arquivo:", error);
    return NextResponse.json({ error: "Falha ao processar o upload do arquivo." }, { status: 500 });
  }
}
