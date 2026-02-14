
"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { Product } from "@/types/store";
import { ShoppingBag } from "lucide-react";

export default function AddToCartButton({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const sizes = product.sizes || [];

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Por favor, selecione um tamanho.");
            return;
        }
        addToCart(product, selectedSize);
        // Optional: Show feedback toast/notification
    };

    return (
        <div className="space-y-6">
            {/* Size Selector */}
            {sizes.length > 0 && (
                <div className="space-y-3">
                    <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest block">
                        Tamanho
                    </span>
                    <div className="flex flex-wrap gap-3">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-12 h-12 text-sm font-mono border transition-all duration-300 flex items-center justify-center ${selectedSize === size
                                        ? "bg-[#D4AF37] border-[#D4AF37] text-black font-bold"
                                        : "bg-transparent border-white/10 text-gray-500 hover:border-white/40"
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Button */}
            <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`w-full py-4 text-xs uppercase tracking-[0.25em] font-medium transition-all duration-500 flex items-center justify-center gap-3 ${selectedSize
                        ? "bg-[#D4AF37] text-black hover:bg-[#b5952f]"
                        : "bg-[#111] text-gray-600 cursor-not-allowed border border-[#333]"
                    }`}
            >
                <ShoppingBag size={16} />
                {selectedSize ? "Adicionar à Sacola" : "Selecione um Tamanho"}
            </button>
        </div>
    );
}
