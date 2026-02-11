"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import { Product, CartItem } from "@/types/store";

interface CartContextType {
    cart: CartItem[];
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    // Agora o addToCart exige o tamanho
    addToCart: (product: Product, selectedSize: string, quantity?: number) => void;
    // Remoção e atualização agora precisam do ID e do Tamanho para precisão
    removeFromCart: (productId: string, selectedSize: string) => void;
    updateQuantity: (productId: string, selectedSize: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("store316-cart");
        if (saved) {
            try {
                setCart(JSON.parse(saved));
            } catch (e) {
                console.error("Erro ao carregar o carrinho:", e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("store316-cart", JSON.stringify(cart));
        }
    }, [cart, isLoaded]);

    const addToCart = (product: Product, selectedSize: string, quantity = 1) => {
        setCart((prev) => {
            // Verifica se já existe o MESMO produto com o MESMO tamanho
            const existing = prev.find(
                (i) => i.product.id === product.id && i.selectedSize === selectedSize
            );

            if (existing) {
                return prev.map((i) =>
                    i.product.id === product.id && i.selectedSize === selectedSize
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                );
            }
            // Se for um tamanho novo ou produto novo, adiciona como novo item
            return [...prev, { product, selectedSize, quantity }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId: string, selectedSize: string) => {
        setCart((prev) =>
            prev.filter((i) => !(i.product.id === productId && i.selectedSize === selectedSize))
        );
    };

    const updateQuantity = (productId: string, selectedSize: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId, selectedSize);
            return;
        }
        setCart((prev) =>
            prev.map((i) =>
                (i.product.id === productId && i.selectedSize === selectedSize)
                    ? { ...i, quantity }
                    : i
            )
        );
    };

    const clearCart = () => setCart([]);

    const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const value = useMemo(() => ({
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        cartCount,
    }), [cart, isCartOpen, total, cartCount]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart deve ser usado dentro de um CartProvider");
    }
    return context;
}