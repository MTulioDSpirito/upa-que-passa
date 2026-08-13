import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, USER_SESSION_COOKIE, verifySessionToken } from "@/lib/session";

const USER_PROTECTED_PATHS = ["/perfil", "/marketplace/vender"];
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// Proteção CSRF leve para /api/*: em requisições que mudam estado, o navegador
// sempre envia Origin (ou, na falta dela, Referer) — um site atacante não consegue
// forjar esse header para o nosso domínio a partir de JS de terceiros. Isso evita
// que um <form>/fetch em outro site consiga usar os cookies de sessão do usuário
// para fazer ações aqui (curtir, comentar, aprovar sugestão, etc.) sem o usuário saber.
// Deliberadamente mais simples que um token CSRF: não exige nenhuma mudança no
// frontend (todas as chamadas já são same-origin), então cobre as ~31 rotas de
// API de uma vez só, sem tocar em cada uma.
function hasTrustedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const source = origin || request.headers.get("referer");
  if (!source) return false;
  try {
    return new URL(source).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

// CSP com nonce por requisição (em vez de um header estático em next.config.ts):
// os scripts inline que o próprio Next.js injeta para hidratar a página (payload
// RSC) precisam de 'unsafe-inline' ou de um nonce válido — sem nenhum dos dois, o
// navegador bloqueia esses scripts e a página fica sem nenhuma interatividade
// (formulários, botões, modais) mesmo parecendo renderizada. O Next.js detecta o
// nonce automaticamente a partir do header CSP da própria requisição (por isso é
// setado em `requestHeaders`, não só na resposta) e aplica sozinho aos scripts que
// ele mesmo gera.
function buildCspHeader(nonce: string): string {
  const scriptSrc =
    process.env.NODE_ENV === "production"
      ? `'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com`
      : "'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com";

  return `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self'; connect-src 'self'; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://challenges.cloudflare.com;`;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/") && MUTATING_METHODS.has(request.method)) {
    if (!hasTrustedOrigin(request)) {
      return NextResponse.json({ error: "Requisição bloqueada (origem inválida)." }, { status: 403 });
    }
  }

  const nonce = generateNonce();
  const cspHeader = buildCspHeader(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  function next(): NextResponse {
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set("Content-Security-Policy", cspHeader);
    return response;
  }

  function redirectTo(url: URL): NextResponse {
    const response = NextResponse.redirect(url);
    response.headers.set("Content-Security-Policy", cspHeader);
    return response;
  }

  if (pathname === "/admin/login") {
    return next();
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return redirectTo(loginUrl);
    }

    return next();
  }

  if (USER_PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    const token = request.cookies.get(USER_SESSION_COOKIE)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session || session.kind !== "user") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return redirectTo(loginUrl);
    }

    return next();
  }

  return next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|css|js|woff|woff2|ttf)$).*)"],
};
