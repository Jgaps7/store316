"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { ShoppingBag, Menu, X, ChevronRight } from "lucide-react";

const categories = [
    { name: "Conjuntos", slug: "conjuntos" },
    { name: "Camisas", slug: "camisas" },
    { name: "Casacos", slug: "casacos" },
    { name: "Tênis", slug: "tenis" },
    { name: "Calças", slug: "calcas" },
    { name: "Bermudas", slug: "bermudas" },
    { name: "Acessórios", slug: "acessorios" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { cartCount, setIsCartOpen } = useCart();

    // Bloqueia o scroll do corpo quando o menu mobile está aberto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    return (
        <>
            <nav className="fixed top-0 w-full z-[90] bg-black/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

                    {/* Botão Menu Mobile */}
                    <button
                        className="lg:hidden text-white p-2 -ml-2 hover:text-[#D4AF37] transition-colors"
                        onClick={() => setIsOpen(true)}
                        aria-label="Abrir menu"
                    >
                        <Menu size={24} strokeWidth={1.5} />
                    </button>

                    {/* Logo Centralizada (Mobile) / Esquerda (Desktop) */}
                    <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
                        <Link href="/" className="block">
                            <div className="relative w-28 h-8 md:w-36 md:h-10">
                                <Image
                                    src="/logo.png"
                                    alt="Store 316"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <ul className="hidden lg:flex gap-8 items-center">
                        {categories.map((cat) => (
                            <li key={cat.slug}>
                                <Link
                                    href={`/categoria/${cat.slug}`}
                                    className="text-[10px] uppercase tracking-[0.25em] text-zinc-400 hover:text-white transition-all duration-300"
                                >
                                    {cat.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Carrinho */}
                    <div className="flex items-center gap-4">
                        <button
                            className="relative p-2 group"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingBag size={22} strokeWidth={1.2} className="text-white group-hover:text-[#D4AF37] transition-colors" />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 bg-[#D4AF37] text-black text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* --- MENU MOBILE (SIDEBAR) --- */}

            {/* Overlay (Fundo escuro que embaça o site) */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-500 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Painel Lateral */}
            <aside className={`fixed top-0 left-0 h-full w-[80%] max-w-[320px] bg-zinc-950 z-[101] shadow-2xl transform transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                }`}>
                <div className="flex flex-col h-full p-8">

                    {/* Header do Menu */}
                    <div className="flex justify-between items-center mb-12">
                        <div className="relative w-24 h-8">
                            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                            <X size={28} strokeWidth={1} />
                        </button>
                    </div>

                    {/* Links de Categoria */}
                    <nav className="flex flex-col space-y-2">
                        {categories.map((cat) => (
                            <Link
                                key={cat.slug}
                                href={`/categoria/${cat.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="flex justify-between items-center py-4 border-b border-white/5 text-white/90 hover:text-white transition-colors"
                            >
                                <span className="text-sm font-light tracking-[0.3em] uppercase">
                                    {cat.name}
                                </span>
                                <ChevronRight size={14} className="text-zinc-600" />
                            </Link>
                        ))}
                    </nav>

                    {/* Rodapé do Menu */}
                    <div className="mt-auto pt-8">
                        <p className="text-[9px] tracking-[0.4em] text-zinc-600 uppercase">
                            A nova estética do luxo
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
}