"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { Product } from "@/types/store";
import Image from "next/image";
import { getDirectDriveLink } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart, globalDiscount } = useCart();
    const [currentIndex, setCurrentIndex] = useState(0);

    // ESTADO DE TAMANHO: Armazena o tamanho escolhido pelo cliente
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const images = product.image_urls || [];
    const hasMultipleImages = images.length > 1;
    const sizes = product.sizes || []; // Puxa os tamanhos do banco

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Por favor, selecione um tamanho antes de adicionar à sacola.");
            return;
        }
        addToCart(product, selectedSize);
    };

    // Desconto global sobrescreve o individual; se nenhum, sem desconto
    const effectiveDiscount = globalDiscount > 0 ? globalDiscount : (product.discount_percent || 0);
    const hasDiscount = effectiveDiscount > 0;
    const finalPrice = hasDiscount
        ? product.price * (1 - effectiveDiscount / 100)
        : product.price;

    return (
        <div className="group relative bg-transparent flex flex-col transition-all duration-500">

            {/* CONTAINER DA IMAGEM */}
            <div className="relative aspect-[3/4] bg-[#0A0A0A] overflow-hidden border border-[#1a1a1a] group-hover:border-[#D4AF37]/30 transition-colors duration-500">
                <Link href={`/product/${product.id}`} className="block w-full h-full cursor-pointer">
                    {images.length > 0 ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={getDirectDriveLink(images[currentIndex])}
                                alt={`${product.name} - ${currentIndex + 1}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                quality={76}
                            />
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[#222] font-serif uppercase tracking-widest text-xs">
                            Store 316
                        </div>
                    )}
                </Link>

                {/* Setas de Navegação */}
                {hasMultipleImages && (
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <button onClick={prevImage} className="p-1 bg-black/50 text-white hover:bg-[#D4AF37] hover:text-black transition-colors rounded-full pointer-events-auto" aria-label="Imagem anterior">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={nextImage} className="p-1 bg-black/50 text-white hover:bg-[#D4AF37] hover:text-black transition-colors rounded-full pointer-events-auto" aria-label="Próxima imagem">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>

            {/* INFORMAÇÕES E SELEÇÃO */}
            <div className="pt-6 pb-2 flex flex-col items-center text-center">
                <Link href={`/product/${product.id}`} className="hover:text-[#D4AF37] transition-colors">
                    <h3 className="text-white font-serif text-lg tracking-tight mb-1">{product.name}</h3>
                </Link>

                <div className="mb-4 flex flex-col items-center">
                    {hasDiscount ? (
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through text-xs">
                                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-[#D4AF37] text-sm font-light tracking-[0.1em]">
                                R$ {finalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-[9px] font-bold text-black bg-[#D4AF37] px-1.5 py-0.5 rounded-sm">
                                -{effectiveDiscount}%
                            </span>
                        </div>
                    ) : (
                        <p className="text-[#D4AF37] text-sm font-light tracking-[0.1em]">
                            R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                    )}
                </div>

                {/* GRADE DE TAMANHOS */}
                {sizes.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-9 h-9 text-[10px] font-mono border transition-all duration-300 flex items-center justify-center ${selectedSize === size
                                    ? "bg-[#D4AF37] border-[#D4AF37] text-black font-bold"
                                    : "bg-transparent border-white/10 text-gray-400 hover:border-white/40"
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                )}

                {/* BOTÃO ADICIONAR */}
                <button
                    onClick={handleAddToCart}
                    className={`w-full max-w-[220px] py-4 text-[10px] uppercase tracking-[0.25em] font-medium transition-all duration-500 flex items-center justify-center gap-2 ${selectedSize
                        ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                        : "bg-transparent border border-white/10 text-gray-400 hover:border-[#D4AF37]/50"
                        }`}
                >
                    <ShoppingBag size={14} />
                    {selectedSize ? `Adicionar Tam. ${selectedSize}` : "Escolha o Tamanho"}
                </button>
            </div>
        </div>
    );
}