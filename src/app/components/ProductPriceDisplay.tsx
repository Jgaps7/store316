"use client";

import { useCart } from "@/app/context/CartContext";

interface ProductPriceDisplayProps {
    price: number;
    discountPercent: number | null | undefined;
}

export default function ProductPriceDisplay({ price, discountPercent }: ProductPriceDisplayProps) {
    const { globalDiscount } = useCart();

    // Se globalDiscount for null/undefined por algum motivo, assume 0
    const safeGlobalDiscount = globalDiscount || 0;

    const effectiveDiscount = safeGlobalDiscount > 0 ? safeGlobalDiscount : (discountPercent || 0);
    const hasDiscount = effectiveDiscount > 0;
    const finalPrice = hasDiscount ? price * (1 - effectiveDiscount / 100) : price;

    return (
        <>
            {hasDiscount ? (
                <div className="flex items-center gap-4">
                    <span className="text-gray-400 line-through font-serif text-xl">
                        R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[#D4AF37] font-serif text-3xl">
                        R$ {finalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="bg-[#D4AF37] text-black text-[10px] uppercase font-bold px-2 py-1 rounded-sm">
                        {effectiveDiscount}% OFF
                    </span>
                </div>
            ) : (
                <p className="text-[#D4AF37] font-serif text-3xl">
                    R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
            )}
        </>
    );
}
