import { PrismaClient } from "@prisma/client";

// Publica notícias do banco LOCAL para a PRODUÇÃO usando o endpoint oficial
// `POST /api/admin/news` (mesmo caminho do painel admin: passa por auth + zod +
// checagem de origem CSRF). Isso resolve a divergência local↔produção: os agentes
// gravam no Postgres local (Docker), que NÃO é o banco que o site em produção lê.
// Como a DATABASE_URL de produção é um secret na Vercel (não dá pra baixar), a
// forma segura de subir conteúdo é autenticar e postar na API, não tocar no banco.
//
// Uso:
//   npx tsx scripts/publicar-noticias.ts --dry               # só mostra o que faria
//   npx tsx scripts/publicar-noticias.ts --since 2026-08-01  # só a partir da data
//   npx tsx scripts/publicar-noticias.ts                     # publica todas faltantes
//   npx tsx scripts/publicar-noticias.ts --incluir-similares # não pula parecidas
//
// Variáveis de ambiente (obrigatórias, exceto a URL):
//   UPA_PROD_URL        default: https://upaquepassa.com.br
//   UPA_ADMIN_EMAIL     e-mail de um admin (ex.: tulio@upaquepassa.com.br)
//   UPA_ADMIN_PASSWORD  senha desse admin
//
// Dedupe: pula automaticamente slugs que já existem em produção. Além disso, uma
// guarda por similaridade de título pula matérias que compartilham >=3 palavras
// significativas com alguma já publicada (ex.: "GTA 6 mostra 20 minutos de gameplay"
// vs "Rockstar revela vídeo de 26 minutos com gameplay" = mesma notícia). Use
// --incluir-similares para desligar essa guarda.

const prisma = new PrismaClient();

const STOPWORDS = new Set([
  "para", "com", "que", "uma", "dos", "das", "nos", "nas", "por", "sua", "seu",
  "mais", "vai", "mostra", "recebe", "ganha", "anuncia", "revela", "confirma",
  "entra", "sai", "faz", "tem", "the", "and", "ainda", "após", "apos",
  "novo", "nova", "sobre", "pelo", "pela", "seus", "suas", "este", "esta",
]);

function significantTokens(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9 ]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !STOPWORDS.has(w))
  );
}

// Retorna o título mais parecido em `existing` e quantas palavras significativas compartilha.
function bestOverlap(title: string, existing: { title: string }[]) {
  const tokens = significantTokens(title);
  let best: { title: string } | null = null;
  let shared: string[] = [];
  for (const e of existing) {
    const common = [...significantTokens(e.title)].filter((w) => tokens.has(w));
    if (common.length > shared.length) {
      best = e;
      shared = common;
    }
  }
  return { best, shared };
}

interface AdminNews {
  slug: string;
  title: string;
}

async function loginProd(base: string, email: string, password: string): Promise<string> {
  const headers = { "content-type": "application/json", origin: base, referer: base + "/" };
  const res = await fetch(base + "/api/auth/login", {
    method: "POST",
    headers,
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error(`Login falhou (${res.status}): ${await res.text()}`);
  }
  const setCookie = res.headers.getSetCookie?.() ?? [];
  const cookie = setCookie.map((c) => c.split(";")[0]).filter(Boolean).join("; ");
  if (!cookie) throw new Error("Login OK mas nenhum cookie de sessão foi retornado.");
  return cookie;
}

async function main() {
  const args = process.argv.slice(2);
  const dry = args.includes("--dry");
  const incluirSimilares = args.includes("--incluir-similares");
  const sinceIdx = args.indexOf("--since");
  const since = sinceIdx !== -1 ? args[sinceIdx + 1] : undefined;

  const base = (process.env.UPA_PROD_URL || "https://upaquepassa.com.br").replace(/\/$/, "");
  const email = process.env.UPA_ADMIN_EMAIL;
  const password = process.env.UPA_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      "Erro: defina UPA_ADMIN_EMAIL e UPA_ADMIN_PASSWORD no ambiente.\n" +
        "Ex.: UPA_ADMIN_EMAIL=tulio@upaquepassa.com.br UPA_ADMIN_PASSWORD='***' npx tsx scripts/publicar-noticias.ts --dry"
    );
    process.exit(1);
  }

  // 1. Notícias do banco LOCAL
  const local = await prisma.newsArticle.findMany({ orderBy: { publishedAt: "desc" } });
  const candidatas = since ? local.filter((n) => n.publishedAt >= since) : local;
  console.log(`Local: ${local.length} notícias${since ? ` (${candidatas.length} a partir de ${since})` : ""}`);

  // 2. Login + notícias já existentes em produção
  const cookie = await loginProd(base, email, password);
  const getRes = await fetch(base + "/api/admin/news", { headers: { cookie } });
  if (!getRes.ok) throw new Error(`GET /api/admin/news falhou (${getRes.status}): ${await getRes.text()}`);
  const prodNews: AdminNews[] = (await getRes.json()).news ?? [];
  const prodSlugs = new Set(prodNews.map((n) => n.slug));
  console.log(`Produção (${base}): ${prodNews.length} notícias já publicadas\n`);

  // 3. Filtro: slug inédito + guarda de similaridade
  const aPublicar: typeof candidatas = [];
  for (const n of candidatas) {
    if (prodSlugs.has(n.slug)) continue; // já existe (mesmo slug)
    const { best, shared } = bestOverlap(n.title, prodNews);
    if (!incluirSimilares && shared.length >= 3) {
      console.log(`PULADA (possível duplicata): "${n.title.slice(0, 50)}"`);
      console.log(`   ~ já em prod: "${best?.title.slice(0, 50)}" [${shared.join(", ")}]`);
      continue;
    }
    aPublicar.push(n);
  }

  console.log(`\n${aPublicar.length} notícia(s) a publicar${dry ? " (DRY-RUN, nada será enviado)" : ""}:`);
  aPublicar.forEach((n) => console.log(`  • ${n.publishedAt} | ${n.title.slice(0, 55)}`));

  if (dry || aPublicar.length === 0) {
    await prisma.$disconnect();
    return;
  }

  // 4. Publica via API
  const headers = { "content-type": "application/json", origin: base, referer: base + "/", cookie };
  let ok = 0;
  let fail = 0;
  for (const n of aPublicar) {
    const payload = {
      title: n.title,
      slug: n.slug,
      excerpt: n.excerpt,
      content: n.content,
      cover: n.cover,
      author: n.author,
      publishedAt: n.publishedAt,
      category: n.category,
      tags: n.tags ?? [],
      imageCredits: n.imageCredits ?? null,
      fontes: n.fontes ?? null,
    };
    const res = await fetch(base + "/api/admin/news", { method: "POST", headers, body: JSON.stringify(payload) });
    if (res.status === 201) {
      ok++;
      console.log(`  OK   ${n.publishedAt} ${n.title.slice(0, 48)}`);
    } else {
      fail++;
      console.log(`  FALHA ${res.status} ${n.title.slice(0, 34)} -> ${(await res.text()).slice(0, 70)}`);
    }
  }
  console.log(`\nRESULTADO: ${ok} publicada(s), ${fail} falha(s).`);
}

main()
  .catch((e) => {
    console.error("Erro:", e.message ?? e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
