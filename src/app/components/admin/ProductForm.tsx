"use client";

import { createProduct, updateProduct } from "@/app/actions/products";
import { useActionState, useEffect, useRef, useState } from "react";
import { Category, Product } from "@/types/store";
import { X, Image as ImageIcon, Star, Trash2, CheckCircle2 } from "lucide-react";

interface ProductFormProps {
    categories: Category[];
    editingProduct?: Product | null;
    onCancelEdit?: () => void;
}

const AVAILABLE_SIZES = ["P", "M", "G", "GG", "38", "40", "42", "44", "46"];

export function ProductForm({ categories, editingProduct, onCancelEdit }: ProductFormProps) {
    const action = editingProduct
        ? updateProduct.bind(null, editingProduct.id)
        : createProduct;

    const [state, formAction, isPending] = useActionState(action, { error: null, success: false });
    const formRef = useRef<HTMLFormElement>(null);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {
        if (editingProduct) {
            setSelectedSizes(editingProduct.sizes || []);
            setImageUrls(editingProduct.image_urls || []);
        } else {
            setSelectedSizes([]);
            setImageUrls([]);
        }
    }, [editingProduct]);

    useEffect(() => {
        if (state?.success && !editingProduct) {
            formRef.current?.reset();
            setSelectedSizes([]);
            setImageUrls([]);
        }
    }, [state, editingProduct]);

    const toggleSize = (size: string) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    // FUNÇÃO: Define a imagem como capa (move para o índice 0)
    const handleSetCover = (index: number) => {
        if (index === 0) return;
        const newImages = [...imageUrls];
        const [moved] = newImages.splice(index, 1);
        newImages.unshift(moved);
        setImageUrls(newImages);
    };

    // FUNÇÃO: Remove uma imagem específica
    const handleRemoveImage = (index: number) => {
        const newImages = imageUrls.filter((_, i) => i !== index);
        setImageUrls(newImages);
    };

    const handleImageTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        const urls = text.split('\n').map(s => s.trim()).filter(s => s.length > 0);
        setImageUrls(urls);
    };

    return (
        <div className="bg-[#0a0a0a] rounded-xl shadow-2xl flex flex-col max-h-[90vh] w-full">
            {/* STICKY HEADER */}
            <header className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-[#0a0a0a] shrink-0">
                <h2 className="text-lg font-serif text-[#D4AF37] uppercase tracking-widest">
                    {editingProduct ? "Editar Produto" : "Novo Produto"}
                </h2>
                <button
                    onClick={onCancelEdit}
                    type="button"
                    className="p-2 text-zinc-500 hover:text-white transition-colors rounded-full hover:bg-white/5"
                    aria-label="Fechar"
                >
                    <X size={20} strokeWidth={1.5} />
                </button>
            </header>

            {/* SCROLLABLE CONTENT */}
            <div className="overflow-y-auto custom-scrollbar flex-1">
                <form ref={formRef} action={formAction} className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    {/* Inputs ocultos para o Server Action */}
                    <input type="hidden" name="sizes" value={JSON.stringify(selectedSizes)} />

                    {/* COLUNA ESQUERDA: GALERIA (40%) */}
                    <div className="lg:col-span-5 bg-black/40 p-6 border-r border-white/5 space-y-6">
                        <header>
                            <label className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[0.2em] mb-4 block">
                                Curadoria Visual
                            </label>

                            {/* Preview Principal */}
                            <div className="relative aspect-square w-full bg-zinc-900 border border-white/5 rounded-lg overflow-hidden group">
                                {imageUrls.length > 0 ? (
                                    <>
                                        <div className="absolute top-3 left-3 bg-[#D4AF37] text-black text-[9px] font-black px-2 py-1 rounded-sm z-20 shadow-xl flex items-center gap-1">
                                            <Star size={10} fill="currentColor" /> CAPA DA VITRINE
                                        </div>
                                        <div className="absolute top-3 right-3 z-20">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(0)}
                                                className="p-1.5 bg-red-600/90 text-white rounded hover:scale-110 transition shadow-lg opacity-0 group-hover:opacity-100"
                                                title="Remover Capa"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <img
                                            src={imageUrls[0]}
                                            className="w-full h-full object-cover animate-in fade-in duration-500"
                                            alt="Principal"
                                        />
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 gap-3">
                                        <ImageIcon size={40} strokeWidth={1} />
                                        <span className="text-[9px] uppercase tracking-widest font-bold">Aguardando Imagens...</span>
                                    </div>
                                )}
                            </div>
                        </header>

                        {/* Miniaturas */}
                        <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                            {imageUrls.map((url, idx) => (
                                <div key={idx} className="relative group aspect-square rounded-md overflow-hidden border border-white/10 hover:border-[#D4AF37]/50 transition-all">
                                    <img src={url} className={`w-full h-full object-cover transition-opacity ${idx === 0 ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`} alt="" />

                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                                        {idx !== 0 && (
                                            <button
                                                type="button"
                                                onClick={() => handleSetCover(idx)}
                                                className="p-1 bg-[#D4AF37] text-black rounded hover:scale-110 transition"
                                                title="Tornar Capa"
                                            >
                                                <Star size={12} fill="currentColor" />
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(idx)}
                                            className="p-1 bg-red-600 text-white rounded hover:scale-110 transition"
                                            title="Remover"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                    {idx === 0 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#D4AF37]" />}
                                </div>
                            ))}
                        </div>

                        {/* Textarea de Links */}
                        <div className="mt-4">
                            <textarea
                                name="imageUrls"
                                value={imageUrls.join('\n')}
                                onChange={handleImageTextChange}
                                placeholder="Cole os links das imagens aqui (um por linha)..."
                                className="w-full bg-black/60 border border-white/5 p-4 text-[10px] text-zinc-300 font-mono focus:border-[#D4AF37] outline-none transition h-32 rounded-lg resize-none"
                                required
                            />
                        </div>
                    </div>

                    {/* COLUNA DIREITA: DADOS (60%) */}
                    <div className="lg:col-span-7 p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 block">Nome da Peça</label>
                                    <input name="name" defaultValue={editingProduct?.name || ""} placeholder="Ex: T-SHIRT LUXURY GOLD" className="w-full bg-zinc-900/50 border border-white/5 p-3 text-sm text-white focus:border-[#D4AF37] outline-none transition rounded-lg" required />
                                </div>

                                <div>
                                    <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 block">Categoria</label>
                                    <select name="categoryId" defaultValue={editingProduct?.category_id || ""} className="w-full bg-zinc-900/50 border border-white/5 p-3 text-sm text-white focus:border-[#D4AF37] outline-none transition rounded-lg appearance-none cursor-pointer" required>
                                        <option value="" disabled>Selecione...</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id} className="bg-zinc-900">{cat.name}</option>)}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 block">Preço (R$)</label>
                                        <input name="price" type="number" step="0.01" defaultValue={editingProduct?.price || ""} placeholder="0.00" className="w-full bg-zinc-900/50 border border-white/5 p-3 text-sm text-white focus:border-[#D4AF37] outline-none transition font-mono rounded-lg" required />
                                    </div>
                                    <div>
                                        <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 block">Desconto (%)</label>
                                        <input name="discountPercent" type="number" defaultValue={editingProduct?.discount_percent || 0} className="w-full bg-zinc-900/50 border border-white/5 p-3 text-sm text-white focus:border-[#D4AF37] outline-none transition font-mono rounded-lg" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Grades Disponíveis</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {AVAILABLE_SIZES.map(size => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => toggleSize(size)}
                                                className={`py-2 text-[10px] font-bold border transition-all rounded ${selectedSizes.includes(size) ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'bg-transparent border-white/10 text-zinc-600 hover:border-zinc-500'}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 block">Descrição</label>
                                    <textarea name="description" defaultValue={editingProduct?.description || ""} className="w-full bg-zinc-900/50 border border-white/5 p-3 text-xs text-zinc-400 focus:border-[#D4AF37] outline-none transition h-28 resize-none rounded-lg" />
                                </div>
                            </div>
                        </div>

                        {state?.success && (
                            <div className="mt-4 flex items-center justify-center gap-2 text-green-500 text-[10px] font-bold uppercase animate-bounce">
                                <CheckCircle2 size={14} /> Operação concluída com sucesso!
                            </div>
                        )}
                    </div>
                </form>
            </div>

            {/* STICKY FOOTER */}
            <footer className="p-6 border-t border-white/5 bg-[#0a0a0a] sticky bottom-0 z-50">
                <button
                    onClick={() => formRef.current?.requestSubmit()}
                    disabled={isPending}
                    className="w-full bg-[#D4AF37] text-black font-black p-4 hover:bg-white transition-all uppercase tracking-[0.3em] text-[11px] disabled:opacity-30 rounded-lg shadow-xl"
                >
                    {isPending ? "PROCESSANDO..." : editingProduct ? "ATUALIZAR PRODUTO" : "PUBLICAR NO SITE"}
                </button>
            </footer>
        </div>
    );
}