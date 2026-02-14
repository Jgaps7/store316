"use client";

import { createProduct, updateProduct } from "@/app/actions/products";
import { useActionState, useEffect, useRef, useState } from "react";
import { Category, Product } from "@/types/store";

interface ProductFormProps {
    categories: Category[];
    editingProduct?: Product | null;
    onCancelEdit?: () => void;
}

// Definição da grade de tamanhos padrão do sistema.
const AVAILABLE_SIZES = ["P", "M", "G", "GG", "38", "40", "42", "44", "46"];

export function ProductForm({ categories, editingProduct, onCancelEdit }: ProductFormProps) {
    const action = editingProduct
        ? updateProduct.bind(null, editingProduct.id)
        : createProduct;

    const [state, formAction, isPending] = useActionState(action, { error: null, success: false });
    const formRef = useRef<HTMLFormElement>(null);

    // Controle local dos tamanhos selecionados (Checkbox behavior).
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

    // Effect: Quando carregamos um produto para edição, preenchemos os tamanhos.
    useEffect(() => {
        if (editingProduct) {
            setSelectedSizes(editingProduct.sizes || []);
        } else {
            setSelectedSizes([]);
        }
    }, [editingProduct]);

    // UX: Limpa o formulário automaticamente após criar um produto novo com sucesso.
    useEffect(() => {
        if (state?.success && !editingProduct) {
            formRef.current?.reset();
            setSelectedSizes([]);
        }
    }, [state, editingProduct]);

    const toggleSize = (size: string) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    return (
        <div className="bg-[#1A1A1A] p-6 rounded border border-[#333] sticky top-8">
            <h2 className="text-xl font-serif text-[#D4AF37] mb-6 uppercase tracking-wider flex justify-between items-center">
                {editingProduct ? "Editar Produto" : "Novo Produto"}
                {editingProduct && (
                    <button
                        onClick={onCancelEdit}
                        className="text-[10px] text-gray-500 hover:text-white transition uppercase tracking-tighter"
                    >
                        Cancelar
                    </button>
                )}
            </h2>

            <form ref={formRef} action={formAction} className="space-y-4">
                {/* Hack: Input oculto para enviar o array de tamanhos como string JSON dentro do FormData padrão. */}
                <input type="hidden" name="sizes" value={JSON.stringify(selectedSizes)} />

                {/* Campo: Nome do Produto */}
                <div>
                    <label className="block text-[10px] text-[#D4AF37] uppercase mb-1 tracking-widest">Nome</label>
                    <input
                        name="name"
                        defaultValue={editingProduct?.name || ""}
                        placeholder="Ex: Conjunto Gucci"
                        className="w-full bg-black border border-[#333] p-3 text-white placeholder-gray-800 focus:border-[#D4AF37] outline-none transition text-sm"
                        required
                    />
                </div>

                {/* Campo: Categoria */}
                <div>
                    <label className="block text-[10px] text-[#D4AF37] uppercase mb-1 tracking-widest">Categoria</label>
                    <select
                        name="categoryId"
                        defaultValue={editingProduct?.category_id || ""}
                        className="w-full bg-black border border-[#333] p-3 text-white focus:border-[#D4AF37] outline-none transition text-sm appearance-none cursor-pointer"
                        required
                    >
                        <option value="" disabled>Selecione uma categoria</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id} className="bg-[#1A1A1A]">
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Campo: Preço e Desconto */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] text-[#D4AF37] uppercase mb-1 tracking-widest">Preço (R$)</label>
                        <input
                            name="price"
                            type="number"
                            step="0.01"
                            defaultValue={editingProduct?.price || ""}
                            placeholder="0.00"
                            className="w-full bg-black border border-[#333] p-3 text-white placeholder-gray-800 focus:border-[#D4AF37] outline-none transition text-sm font-mono"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] text-[#D4AF37] uppercase mb-1 tracking-widest">Desconto (%)</label>
                        <input
                            name="discountPercent"
                            type="number"
                            step="1"
                            min="0"
                            max="100"
                            defaultValue={editingProduct?.discount_percent || ""}
                            placeholder="0"
                            className="w-full bg-black border border-[#333] p-3 text-white placeholder-gray-800 focus:border-[#D4AF37] outline-none transition text-sm font-mono"
                        />
                    </div>
                </div>

                {/* Campo: Seleção de Tamanhos (Multi-select) */}
                <div>
                    <label className="block text-[10px] text-[#D4AF37] uppercase mb-2 tracking-widest">
                        Tamanhos Disponíveis
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {AVAILABLE_SIZES.map((size) => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => toggleSize(size)}
                                className={`py-2 text-[10px] font-mono border transition-all duration-300 ${selectedSizes.includes(size)
                                    ? "bg-[#D4AF37] border-[#D4AF37] text-black font-bold shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                                    : "bg-black border-[#333] text-gray-500 hover:border-[#555]"
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Campo: URLs das Imagens */}
                <div>
                    <label className="block text-[10px] text-[#D4AF37] uppercase mb-1 tracking-widest">
                        Links das Imagens (Uma por linha)
                    </label>
                    <textarea
                        name="imageUrls"
                        defaultValue={editingProduct?.image_urls?.join('\n') || ""}
                        placeholder="Cole os links do Drive aqui"
                        className="w-full bg-black border border-[#333] p-3 text-white placeholder-gray-800 focus:border-[#D4AF37] outline-none transition h-32 text-xs font-mono resize-none custom-scrollbar"
                    />
                </div>

                {/* Campo: Descrição Detalhada */}
                <div>
                    <label className="block text-[10px] text-[#D4AF37] uppercase mb-1 tracking-widest">Descrição</label>
                    <textarea
                        name="description"
                        defaultValue={editingProduct?.description || ""}
                        placeholder="Detalhes da peça..."
                        className="w-full bg-black border border-[#333] p-3 text-white placeholder-gray-800 focus:border-[#D4AF37] outline-none transition h-24 text-sm resize-none"
                    />
                </div>

                {state?.error && (
                    <p className="text-red-500 text-[11px] bg-red-500/10 border border-red-500/50 p-3 rounded text-center animate-shake">
                        {state.error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-[#D4AF37] text-black font-bold p-4 hover:bg-[#b5952f] transition-all uppercase tracking-[0.2em] text-[11px] disabled:opacity-50 active:scale-95"
                >
                    {isPending ? "Processando..." : editingProduct ? "Salvar Alterações" : "Publicar Produto"}
                </button>
            </form>
        </div>
    );
}