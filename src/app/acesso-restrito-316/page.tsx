import { logout } from "@/app/actions/auth";
import { getProducts, getCategories } from "@/app/actions/products";
import { AdminDashboardClient } from "@/app/components/admin/AdminDashboardClient";

import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AdminPage() {
    // SEGURANÇA: Verificação de sessão obrigatória no Server Component
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    if (!session.isLoggedIn || !session.isAdmin) {
        redirect("/login");
    }

    // Performance: Buscamos produtos e categorias em paralelo (Promise.all)
    const [products, categories] = await Promise.all([
        getProducts(),
        getCategories()
    ]);

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <header className="flex justify-between items-center mb-12 border-b border-[#333] pb-6">
                <div>
                    <h1 className="text-3xl font-serif text-[#D4AF37] tracking-widest uppercase">Store 316</h1>
                    <p className="text-gray-500 text-xs uppercase mt-1 font-sans tracking-tighter">Painel de Controle Administrativo</p>
                </div>
                <div className="flex items-center gap-6">
                    <a href="/" target="_blank" className="text-xs uppercase tracking-widest text-gray-400 hover:text-[#D4AF37] transition">Ver Loja</a>
                    <form action={logout}>
                        <button className="px-4 py-2 border border-[#333] text-gray-400 hover:text-white hover:border-white transition rounded text-sm uppercase tracking-widest">
                            Sair
                        </button>
                    </form>
                </div>
            </header>

            {/* Componente Cliente: Toda a interatividade (Edição, Exclusão, Preview) acontece aqui dentro. 
                Passamos os dados iniciais via props para manter o SEO e performance do Server Side.
            */}
            <AdminDashboardClient products={products} categories={categories} />
        </div>
    );
}   