import { PrismaClient } from "@prisma/client";
import * as https from "https";
import * as http from "http";

const prisma = new PrismaClient();

// Nenhum agente deve inserir foto inventada, genérica ou logo em SVG (fica invisível em
// fundo escuro). Se a capa enviada bater em algum desses padrões, cai no ícone padrão do
// site em vez de publicar uma imagem errada — mais seguro que travar a inserção inteira.
const BAD_COVER_PATTERNS = [/\.svg(\?|$)/i, /unsplash\.com/i, /placeholder/i, /placehold\.co/i, /via\.placeholder/i];
const FALLBACK_COVER = "/cover_conteudo_nao_disponivel.png";

// Baixa só o suficiente da imagem pra ler as dimensões do header (JPEG/PNG), sem
// precisar de nenhuma dependência de processamento de imagem.
function fetchImageBytes(url: string, maxBytes = 3_000_000, timeoutMs = 5000): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        fetchImageBytes(res.headers.location, maxBytes, timeoutMs).then(resolve, reject);
        return;
      }
      const chunks: Buffer[] = [];
      let total = 0;
      res.on("data", (c: Buffer) => {
        chunks.push(c);
        total += c.length;
        if (total >= maxBytes) req.destroy();
      });
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
      req.on("close", () => resolve(Buffer.concat(chunks)));
    });
    req.on("error", reject);
    req.setTimeout(timeoutMs, () => req.destroy(new Error("timeout")));
  });
}

function readImageDimensions(buf: Buffer): { w: number; h: number } | null {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let offset = 2;
    while (offset < buf.length - 8) {
      if (buf[offset] !== 0xff) { offset++; continue; }
      const marker = buf[offset + 1];
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { offset += 2; continue; }
      if (marker === 0xda) break;
      const len = buf.readUInt16BE(offset + 2);
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { h: buf.readUInt16BE(offset + 5), w: buf.readUInt16BE(offset + 7) };
      }
      offset += 2 + len;
    }
  }
  return null;
}

// Aviso não-bloqueante: notícia deve ser horizontal, lançamento/capa de jogo deve ser vertical
// (ver [[feedback_real_images_no_duplicates]] na memória do Claude Code). Se a checagem falhar
// por qualquer motivo (rede, timeout, formato não suportado), simplesmente não avisa — nunca
// impede a inserção da sugestão.
async function warnIfWrongOrientation(tipo: string, cover: string | undefined) {
  if (!cover || cover.startsWith("/") || /\.svg(\?|$)/i.test(cover)) return;
  try {
    const buf = await fetchImageBytes(cover);
    const dim = readImageDimensions(buf);
    if (!dim) return;
    const isHorizontal = dim.w > dim.h;
    if (tipo === "NOTICIA" && !isHorizontal) {
      console.warn(`Aviso: capa de NOTICIA está com orientação vertical/quadrada (${dim.w}x${dim.h}) — notícias devem usar foto horizontal.`);
    } else if (tipo === "LANCAMENTO" && isHorizontal) {
      console.warn(`Aviso: capa de LANCAMENTO está com orientação horizontal (${dim.w}x${dim.h}) — jogos devem usar capa vertical (box art).`);
    }
  } catch {
    // rede/timeout/formato não suportado — não bloqueia a inserção
  }
}

function sanitizeCover(payload: any) {
  if (!payload || typeof payload !== "object") return;
  for (const field of ["cover", "thumbnail"]) {
    if (typeof payload[field] === "string" && BAD_COVER_PATTERNS.some((re) => re.test(payload[field]))) {
      console.warn(`Aviso: "${field}" enviado ("${payload[field]}") parece placeholder/logo genérico, não uma foto real do assunto. Usando ícone padrão em vez disso.`);
      payload[field] = FALLBACK_COVER;
    }
  }
  if (Array.isArray(payload.gallery)) {
    payload.gallery = payload.gallery.map((url: string) =>
      typeof url === "string" && BAD_COVER_PATTERNS.some((re) => re.test(url)) ? FALLBACK_COVER : url
    );
  }
}

async function main() {
  const args = process.argv.slice(2);
  const jsonArgIndex = args.indexOf("--json");
  
  if (jsonArgIndex === -1) {
    console.error("Erro: Use --json '<JSON_STRING>' contendo os dados da sugestão.");
    process.exit(1);
  }

  const jsonStr = args[jsonArgIndex + 1];
  if (!jsonStr) {
    console.error("Erro: Payload JSON vazio após a flag --json.");
    process.exit(1);
  }

  try {
    const data = JSON.parse(jsonStr);

    if (!data.tipo || !data.criador || !data.titulo || !data.slug || !data.payload) {
      console.error("Erro: O JSON enviado precisa ter: tipo, criador, titulo, slug, payload.");
      process.exit(1);
    }

    sanitizeCover(data.payload);
    await warnIfWrongOrientation(data.tipo, data.payload?.cover || data.payload?.capa_candidata);

    const sugestao = await prisma.sugestaoAgente.create({
      data: {
        tipo: data.tipo,
        criador: data.criador,
        titulo: data.titulo,
        slug: data.slug,
        payload: data.payload,
        fontes: data.fontes || [],
        status: "PENDING",
      },
    });

    console.log(`SUCESSO: Rascunho inserido com ID: ${sugestao.id}`);
  } catch (error: any) {
    console.error("Erro ao analisar JSON ou inserir no banco de dados:", error.message);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
