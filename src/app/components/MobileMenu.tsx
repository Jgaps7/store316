"use client";

import Link from "next/link";
import { X } from "lucide-react";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORIES = [
    { name: "NOVIDADES", slug: "novidades" },
    { name: "CONJUNTOS", slug: "conjuntos" },
    { name: "CAMISAS", slug: "camisas" },
    { name: "CALÇAS", slug: "calcas" },
    { name: "ACESSÓRIOS", slug: "acessorios" },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex">
            {/* 1. Overlay Escuro (Fecha o menu ao clicar fora) */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* 2. Painel Lateral (O Menu em si) */}
            <aside className={`
        relative w-[85%] max-w-[320px] h-full bg-zinc-950 border-r border-white/10
        flex flex-col p-8 shadow-2xl transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>

                {/* Botão de Fechar */}
                <button
                    onClick={onClose}
                    className="self-end p-2 -mr-2 text-white/70 hover:text-white transition-colors"
                    aria-label="Fechar menu"
                >
                    <X size={28} strokeWidth={1.5} />
                </button>

                {/* Logo ou Título no Menu */}
                <div className="mt-8 mb-12">
                    <h2 className="text-2xl font-light tracking-[0.3em] text-white">
                        STORE <span className="font-bold">316</span>
                    </h2>
                </div>

                {/* Links das Categorias */}
                <nav className="flex flex-col gap-1">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/categoria/${cat.slug}`}
                            onClick={onClose}
                            className="group py-4 flex justify-between items-center text-sm font-light tracking-[0.25em] text-white/80 hover:text-white border-b border-white/5 transition-all"
                        >
                            {cat.name}
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
                        </Link>
                    ))}
                </nav>

                {/* Rodapé do Menu */}
                <div className="mt-auto pt-10">
                    <p className="text-[10px] tracking-widest text-zinc-500 uppercase">
                        A nova estética do luxo
                    </p>
                </div>
            </aside>
        </div>
    );
}