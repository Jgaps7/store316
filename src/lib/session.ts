import { SessionOptions } from "iron-session";

export interface SessionData {
    isLoggedIn: boolean;
    isAdmin: boolean;
    username?: string;
}

export const defaultSession: SessionData = {
    isLoggedIn: false,
    isAdmin: false,
};

export const sessionOptions: SessionOptions = {
    cookieName: "store316_session",
    password: process.env.SESSION_PASSWORD as string,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true, // Segurança: Impede que scripts do lado do cliente (JS) leiam este cookie.
        sameSite: "lax", // Proteção contra CSRF: O cookie só é enviado em navegações seguras.
        maxAge: 60 * 60 * 24 * 7, // A sessão dura exatos 7 dias. Depois disso, o usuário precisa logar novamente.
    },
};
