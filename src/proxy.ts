import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, USER_SESSION_COOKIE, verifySessionToken } from "@/lib/session";

const USER_PROTECTED_PATHS = ["/perfil", "/marketplace/vender"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  matcher: ["/admin/:path*", "/perfil/:path*", "/marketplace/vender/:path*"],
};
