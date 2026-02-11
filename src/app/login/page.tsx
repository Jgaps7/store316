"use client";

import { login } from "@/app/actions/auth";
import { useActionState } from "react";

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, null);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <div className="w-full max-w-md p-8 border border-[#D4AF37] rounded-lg bg-[#050505] shadow-2xl">
                <h1 className="text-3xl font-serif text-[#D4AF37] mb-2 text-center uppercase tracking-widest">
                    Store 316
                </h1>
                <p className="text-gray-500 text-center mb-8 text-sm uppercase tracking-tighter">
                    Acesso Administrativo
                </p>

                <form action={formAction} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-[#D4AF37] mb-2 uppercase">
                            Senha de Segurança
                        </label>
                        <input
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            className="w-full bg-[#111] border border-[#333] rounded p-3 text-white focus:border-[#D4AF37] outline-none transition-all placeholder:text-gray-700"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* Feedback Visual: Se houver erro no login, mostramos um alerta vermelho aqui. */}
                    {state?.error && (
                        <div className="bg-red-900/20 border border-red-900 text-red-500 p-3 rounded text-sm text-center animate-pulse">
                            {state.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-[#D4AF37] text-black font-bold py-3 rounded hover:bg-[#b5952f] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs tracking-widest"
                    >
                        {isPending ? "Verificando Autenticação..." : "Entrar no Sistema"}
                    </button>
                </form>
            </div>
        </div>
    );
}