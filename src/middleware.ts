import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "./lib/session";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const session = await getIronSession<SessionData>(
        await cookies(), // Await cookies() in Next.js 15+
        sessionOptions
    );

    // LEI 05: Limpeza de Sessão.
    // O iron-session já faz isso, mas aqui reforçamos a verificação para garantir que ninguém acesse rotas proibidas.
    // O foco principal é proteger o painel administrativo.

    if (request.nextUrl.pathname.startsWith("/acesso-restrito-316")) {
        if (!session.isLoggedIn || !session.isAdmin) {
            // Unauthorized
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return response;
}

export const config = {
    matcher: ["/acesso-restrito-316/:path*"],
};
