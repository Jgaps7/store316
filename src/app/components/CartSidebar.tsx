"use client";

import { useCart } from "@/app/context/CartContext";
import { getDirectDriveLink } from "@/lib/utils";
import { WhatsAppService } from "@/app/services/whatsapp.service";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";

export default function CartSidebar() {
    const {
        cart,
        isCartOpen,
        setIsCartOpen,
        updateQuantity,
        removeFromCart,
        total,
        globalDiscount // Consumindo do Contexto Centralizado
    } = useCart();

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        const finalUrl = WhatsAppService.getCheckoutLink(cart, total);
        window.open(finalUrl, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Painel Lateral */}
            <div className="relative w-full max-w-md bg-[#0A0A0A] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 border-l border-white/5">

                {/* Header */}
                <div className="p-6 flex items-center justify-between border-b border-white/5">
                    <h2 className="text-xl font-serif text-white uppercase tracking-widest flex items-center gap-3">
                        <ShoppingBag size={20} className="text-[#D4AF37]" /> Sua Sacola
                    </h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-white hover:text-[#D4AF37] transition-colors p-2"
                        aria-label="Fechar carrinho"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Itens da Sacola */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                            <ShoppingBag size={48} strokeWidth={1} className="mb-4 text-white" />
                            <p className="font-serif italic text-white">Sua sacola está vazia.</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={`${item.product.id}-${item.selectedSize}`} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {/* Imagem */}
                                <div className="relative w-20 h-24 bg-black border border-white/5 overflow-hidden flex-shrink-0">
                                    <Image
                                        src={getDirectDriveLink(item.product.image_urls?.[0] || "")}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        sizes="80px"
                                        quality={76}
                                    />
                                </div>

                                {/* Conteúdo */}
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="text-white text-sm font-serif tracking-tight">{item.product.name}</h3>

                                        {/* EXIBIÇÃO DO TAMANHO NA SACOLA */}
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Tamanho:</span>
                                            <span className="text-[10px] font-bold text-[#D4AF37] border border-[#D4AF37]/30 px-1.5 rounded">
                                                {item.selectedSize}
                                            </span>
                                        </div>

                                        {/* Lógica de Preço com Desconto */}
                                        {(() => {
                                            const effectiveDiscount = globalDiscount > 0 ? globalDiscount : (item.product.discount_percent || 0);
                                            const finalPrice = item.product.price * (1 - effectiveDiscount / 100);
                                            const hasDiscount = effectiveDiscount > 0;

                                            return (
                                                <div className="mt-2 flex flex-col items-start gap-0.5">
                                                    {hasDiscount && (
                                                        <span className="text-[10px] text-gray-400 line-through font-mono">
                                                            R$ {item.product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                        </span>
                                                    )}
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-[#D4AF37] text-xs font-mono font-bold">
                                                            R$ {finalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                        </p>
                                                        {hasDiscount && (
                                                            <span className="text-[8px] px-1 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] rounded border border-[#D4AF37]/30">
                                                                -{effectiveDiscount}%
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {/* Controles de Quantidade e Remoção */}
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center border border-white/10 px-1 py-1 bg-black">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                                                className="text-white hover:text-[#D4AF37] p-1 transition-colors"
                                                aria-label="Diminuir quantidade"
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="mx-3 text-xs text-white min-w-[12px] text-center font-mono">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                                                className="text-white hover:text-[#D4AF37] p-1 transition-colors"
                                                aria-label="Aumentar quantidade"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                            title="Remover item"
                                            aria-label="Remover item do carrinho"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer do Carrinho */}
                {cart.length > 0 && (
                    <div className="p-6 border-t border-white/5 bg-[#0F0F0F]">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-400 uppercase text-[10px] tracking-[0.3em]">Total estimado</span>
                            <span className="text-xl text-white font-serif">
                                R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full bg-[#D4AF37] text-black font-bold py-4 uppercase tracking-[0.25em] text-[11px] hover:bg-[#b5952f] transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            Finalizar no WhatsApp
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}