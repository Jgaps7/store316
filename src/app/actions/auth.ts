"use server";

import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Armazenamento de tentativas (em produção, use Redis ou similar)
const loginAttempts = new Map<string, { count: number; lockedUntil?: number }>();

// Adicionamos prevState para garantir compatibilidade com o hook useActionState (Padrão do Next 15 / React 19)
export async function login(prevState: any, formData: FormData) {
    const password = formData.get("password") as string;
    const cookieStore = await cookies();

    // Identificador único (IP seria ideal, mas usamos cookie como fallback)
    const attemptId = cookieStore.get("_login_id")?.value || Math.random().toString(36);

    // 1. Verificar se está bloqueado
    const attempts = loginAttempts.get(attemptId) || { count: 0 };
    if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
        const minutesLeft = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
        return {
            error: `Muitas tentativas falhas. Tente novamente em ${minutesLeft} minuto(s).`,
            locked: true
        };
    }

    // 2. Defesa Básica.
    // Se não tiver senha, nem gastamos processamento.
    if (!password) {
        return { error: "A senha é obrigatória." };
    }

    // 3. Verificação de Credenciais.
    // Comparamos com a variável de ambiente segura, nunca com texto hardcoded.
    if (password === process.env.ADMIN_PASSWORD) {
        // Limpar tentativas após sucesso
        loginAttempts.delete(attemptId);

        const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

        session.isLoggedIn = true;
        session.isAdmin = true;

        // Salvando a sessão criptografada no cookie.
        await session.save();

        // Redirecionamos o admin para a nova rota oculta.
        redirect("/acesso-restrito-316");
    }

    // 4. Registrar tentativa falha
    attempts.count = (attempts.count || 0) + 1;

    if (attempts.count >= 5) {
        attempts.lockedUntil = Date.now() + 15 * 60 * 1000; // 15 minutos
        loginAttempts.set(attemptId, attempts);

        // Salvar cookie de identificação
        cookieStore.set("_login_id", attemptId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 // 15 minutos
        });

        return {
            error: "Muitas tentativas falhas. Conta bloqueada por 15 minutos.",
            locked: true
        };
    }

    loginAttempts.set(attemptId, attempts);
    cookieStore.set("_login_id", attemptId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60
    });

    // 5. Retorno amigável para o frontend exibir o erro sem quebrar a aplicação.
    return {
        error: `Senha administrativa incorreta. ${5 - attempts.count} tentativa(s) restante(s).`
    };
}

export async function logout() {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    session.destroy();

    // Faxina completa: Removemos o cookie para garantir que não sobrem resquícios da sessão.
    cookieStore.delete(sessionOptions.cookieName);

    redirect("/login");
}