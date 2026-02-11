"use server";

import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Adicionamos prevState para garantir compatibilidade com o hook useActionState (Padrão do Next 15 / React 19)
export async function login(prevState: any, formData: FormData) {
    const password = formData.get("password") as string;

    // 1. Defesa Básica.
    // Se não tiver senha, nem gastamos processamento.
    if (!password) {
        return { error: "A senha é obrigatória." };
    }

    // 2. Verificação de Credenciais.
    // Comparamos com a variável de ambiente segura, nunca com texto hardcoded.
    if (password === process.env.ADMIN_PASSWORD) {
        const cookieStore = await cookies();
        const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

        session.isLoggedIn = true;
        session.isAdmin = true;

        // Salvando a sessão criptografada no cookie.
        await session.save();

        // Redirecionamos o admin para a nova rota oculta.
        redirect("/acesso-restrito-316");
    }

    // 3. Retorno amigável para o frontend exibir o erro sem quebrar a aplicação.
    return { error: "Senha administrativa incorreta. Acesso negado." };
}

export async function logout() {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    session.destroy();

    // Faxina completa: Removemos o cookie para garantir que não sobrem resquícios da sessão.
    cookieStore.delete(sessionOptions.cookieName);

    redirect("/login");
}