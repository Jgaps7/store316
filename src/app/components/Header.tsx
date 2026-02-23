"use client";

import { useCart } from "@/app/context/CartContext";
import { ShoppingBag } from "lucide-react";
import CartSidebar from "./CartSidebar";

export default function Header() {
    // 1. Buscamos o cartCount e a função de abrir do contexto global
    const { cartCount, setIsCartOpen } = useCart();

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-[#333]">
                <div className="container mx-auto px-4 h-20 flex justify-between items-center">
                    <div className="text-2xl font-serif text-[#D4AF37] tracking-widest">
                        STORE 316
                    </div>

                    <button
                        // 2. Usamos a função global para abrir o carrinho
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2 text-white hover:text-[#D4AF37] transition"
                        aria-label="Abrir carrinho"
                    >
                        <ShoppingBag size={24} />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 bg-[#D4AF37] text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {/* 3. Renderizamos o Sidebar SEM props, pois ele já se auto-gerencia */}
            <CartSidebar />
        </>
    );
}