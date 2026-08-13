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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/") && MUTATING_METHODS.has(request.method)) {
    if (!hasTrustedOrigin(request)) {
      return NextResponse.json({ error: "Requisição bloqueada (origem inválida)." }, { status: 403 });
    }
  }

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  if (USER_PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    const token = request.cookies.get(USER_SESSION_COOKIE)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session || session.kind !== "user") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/perfil/:path*", "/marketplace/vender/:path*", "/api/:path*"],
};
