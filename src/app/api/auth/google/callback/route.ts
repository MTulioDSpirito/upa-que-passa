import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSessionToken, USER_SESSION_COOKIE, SESSION_COOKIE_MAX_AGE } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const stateCookie = request.cookies.get("oauth_state")?.value;

  if (!code || !state || !stateCookie || state !== stateCookie) {
    return NextResponse.json(
      { error: "State inválido ou expirado. Ataque CSRF suspeito." },
      { status: 400 }
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Configuração do Google OAuth ausente no servidor." },
      { status: 500 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const redirectUri = `${appUrl}/api/auth/google/callback`;

  try {
    // 1. Troca o código de autorização pelos tokens do Google
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error("Erro ao obter token do Google:", errText);
      return NextResponse.json({ error: "Falha na autenticação com o Google." }, { status: 400 });
    }

    const tokens = await tokenRes.json();
    const accessToken = tokens.access_token;

    // 2. Obtém os dados do perfil do usuário
    const userinfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userinfoRes.ok) {
      return NextResponse.json({ error: "Falha ao obter perfil do Google." }, { status: 400 });
    }

    const profile = await userinfoRes.json();
    const { email, name, picture } = profile;

    if (!email) {
      return NextResponse.json({ error: "E-mail não fornecido pelo Google." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 3. Procura ou cria o SiteUser correspondente
    let user = await prisma.siteUser.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      // Gera um nickname único baseado no nome
      let baseNickname = name
        ? name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "")
        : cleanEmail.split("@")[0];
      
      if (!baseNickname || baseNickname.length < 3) {
        baseNickname = "user";
      }

      let nickname = baseNickname;
      let counter = 1;
      while (true) {
        const existing = await prisma.siteUser.findUnique({
          where: { nickname },
        });
        if (!existing) break;
        nickname = `${baseNickname}${counter}`;
        counter++;
      }

      // Gera senha dummy
      const dummyPassword = Math.random().toString(36) + Math.random().toString(36);
      const passwordHash = await hashPassword(dummyPassword);

      user = await prisma.siteUser.create({
        data: {
          email: cleanEmail,
          nickname,
          passwordHash,
          avatar: picture || null,
          active: true,
        },
      });
    } else {
      // Se o usuário existe mas não tinha avatar, atualiza
      if (!user.avatar && picture) {
        user = await prisma.siteUser.update({
          where: { id: user.id },
          data: { avatar: picture },
        });
      }
    }

    if (!user.active) {
      return NextResponse.json({ error: "Esta conta está desativada." }, { status: 403 });
    }

    // 4. Cria o token de sessão da aplicação
    const sessionToken = await createSessionToken({
      sub: user.id,
      name: user.nickname,
      email: user.email,
      role: "user",
      kind: "user",
      avatar: user.avatar ?? undefined,
    });

    // 5. Redireciona com o cookie de sessão definido
    const redirectResponse = NextResponse.redirect(new URL("/", appUrl).toString());
    
    // Limpa o cookie de state do OAuth
    redirectResponse.cookies.set("oauth_state", "", { maxAge: 0, path: "/" });

    // Define o cookie de sessão do usuário
    redirectResponse.cookies.set(USER_SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_COOKIE_MAX_AGE,
    });

    return redirectResponse;
  } catch (error) {
    console.error("Erro no callback do Google OAuth:", error);
    return NextResponse.json({ error: "Erro interno do servidor durante autenticação." }, { status: 500 });
  }
}
