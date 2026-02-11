"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { ShoppingBag, Menu, X, User } from "lucide-react";

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
    const { cartCount, setIsCartOpen } = useCart(); // Pegamos as funções do carrinho através do Contexto.

    // Trava a rolagem da página principal quando o menu lateral (mobile) estiver aberto.
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    return (
        <nav className="fixed top-0 w-full z-[90] bg-black/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

                {/* Ícone do Menu Mobile (Hambúrguer) */}
                <button
                    className="lg:hidden text-white p-2 -ml-2 hover:text-[#D4AF37] transition-colors"
                    onClick={() => setIsOpen(true)}
                    aria-label="Abrir menu"
                >
                    <Menu size={24} />
                </button>

                {/* Logo da Loja Centralizada */}
                <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
                    <Link href="/" className="block">
                        <div className="relative w-32 h-12 md:w-40 md:h-14">
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

                {/* Menu de Navegação para Desktop */}
                <ul className="hidden lg:flex gap-8 items-center">
                    {categories.map((cat) => (
                        <li key={cat.slug}>
                            <Link
                                href={`/categoria/${cat.slug}`}
                                className="text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-[#D4AF37] transition-all duration-300 hover:tracking-[0.3em]"
                            >
                                {cat.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Área de Ícones (Carrinho, Admin) */}
                <div className="flex items-center gap-6 text-white">


                    {/* Botão da Sacola - Abre o sidebar do carrinho */}
                    <button
                        className="relative group p-2 -mr-2"
                        aria-label="Ver sacola"
                        onClick={() => setIsCartOpen(true)} // Ação: Abre o Sidebar lateral
                    >
                        <ShoppingBag size={22} strokeWidth={1.5} className="group-hover:text-[#D4AF37] transition-colors" />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in duration-300">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Menu Lateral Mobile (Overlay) */}
            {isOpen && (
                <div className="fixed inset-0 bg-black z-[100] flex flex-col p-8 animate-in fade-in slide-in-from-top duration-500">
                    <div className="flex justify-between items-center mb-8">
                        <div className="relative w-28 h-10">
                            <Image
                                src="/logo.png"
                                alt="Store 316"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white p-2 hover:text-[#D4AF37] transition-colors"
                        >
                            <X size={32} strokeWidth={1} />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        <ul className="space-y-6 text-center">
                            {categories.map((cat) => (
                                <li key={cat.slug} onClick={() => setIsOpen(false)}>
                                    <Link
                                        href={`/categoria/${cat.slug}`}
                                        className="text-3xl font-serif text-white uppercase tracking-[0.2em] hover:text-[#D4AF37] transition-all block py-2"
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>


                </div>
            )}
        </nav>
    );
}