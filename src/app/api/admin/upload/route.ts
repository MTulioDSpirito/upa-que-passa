import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

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

    // Validação de tipo de arquivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "O arquivo precisa ser uma imagem válida." }, { status: 400 });
    }

    // Validação de tamanho: 2MB (2 * 1024 * 1024)
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "A imagem não pode exceder o limite de 2MB." }, { status: 400 });
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

    // Salvar o arquivo localmente
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Gerar um nome único baseado no timestamp e no nome original limpo
    const fileExt = path.extname(file.name) || ".jpg";
    const baseName = path.basename(file.name, fileExt).replace(/[^a-zA-Z0-9_-]/g, "_");
    const fileName = `${Date.now()}-${baseName}${fileExt}`;
    const filePath = path.join(uploadsDir, fileName);

    await fs.writeFile(filePath, buffer);

    // Retorna a URL pública do arquivo
    return NextResponse.json({ url: `/${relativeFolder}/${fileName}` });
  } catch (error: any) {
    console.error("Erro no upload de arquivo:", error);
    return NextResponse.json({ error: "Falha ao processar o upload do arquivo." }, { status: 500 });
  }
}
