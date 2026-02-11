"use client";

import { useState } from "react";
import { ProductForm } from "./ProductForm";
import { deleteProduct } from "@/app/actions/products";
import { Product, Category } from "@/types/store";

// Helper: Transforma links comuns do Google Drive em links diretos de visualização (lh3)
// Isso garante que as imagens carreguem rápido no painel sem problemas de CORS.
const getAdminThumbnail = (url: string) => {
    if (!url) return null;
    // Tenta extrair o ID do arquivo usando Regex, seja formato /d/ ou id=
    const match = url.match(/\/d\/([^/]+)/) || url.match(/id=([^&]+)/);
    const fileId = match ? match[1] : null;

    if (fileId) {
        // Montamos o link usando o domínio lh3, que é otimizado para thumbnails e não exige autenticação complexa.
        return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
    return url;
};

export function AdminDashboardClient({ products, categories }: { products: Product[], categories: Category[] }) {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    return (
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
                <ProductForm
                    categories={categories}
                    editingProduct={editingProduct}
                    onCancelEdit={() => setEditingProduct(null)}
                />
            </div>

            <div className="lg:col-span-2 bg-[#1A1A1A] p-6 rounded border border-[#333]">
                <div className="flex justify-between items-end mb-6 border-b border-[#222] pb-4">
                    <h2 className="text-xl font-serif text-[#D4AF37] uppercase tracking-wider">Inventário</h2>
                    <span className="text-gray-600 text-xs uppercase tracking-widest">{products?.length || 0} Itens</span>
                </div>

                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {products.map((p) => {
                        // Tratamento de Imagem: Se for array, pega a primeira. Se for string, usa ela mesma.
                        // Em seguida, aplicamos o filtro do Google Drive para garantir a visualização.
                        const rawUrl = Array.isArray(p.image_urls) ? p.image_urls[0] : p.image_urls;
                        const src = getAdminThumbnail(rawUrl);

                        return (
                            <div key={p.id} className="flex justify-between items-center p-4 bg-black/40 border border-[#333] rounded-lg hover:border-[#D4AF37]/50 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded bg-[#111] overflow-hidden border border-[#222] flex-shrink-0 relative">
                                        {src ? (
                                            <img
                                                src={src}
                                                alt={p.name}
                                                // Performance: Desabilitamos o referrer para evitar bloqueios de hotlink do Google.
                                                referrerPolicy="no-referrer"
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-500"
                                                loading="lazy"
                                                onError={(e) => {
                                                    // Tratamento de Erro: Se a imagem não carregar, mostramos um placeholder visual.
                                                    const target = e.target as HTMLImageElement;
                                                    if (!target.src.includes('placehold.co')) {
                                                        target.src = "https://placehold.co/100x100/000000/D4AF37?text=REVISE+LINK";
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-[8px] text-gray-700 uppercase">Sem Foto</div>
                                        )}
                                    </div>

                                    <div>
                                        <p className="font-bold text-gray-200 group-hover:text-white transition leading-tight">{p.name}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs text-[#D4AF37] font-mono">R$ {Number(p.price).toFixed(2)}</p>
                                            <span className="text-[9px] uppercase text-gray-600 bg-[#222] px-1.5 py-0.5 rounded">
                                                {p.categories?.name || "Geral"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingProduct(p);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="text-[10px] font-bold text-gray-500 hover:text-[#D4AF37] transition-colors uppercase tracking-widest p-2"
                                    >
                                        Editar
                                    </button>

                                    <form action={async () => {
                                        if (confirm(`Excluir "${p.name}"?`)) await deleteProduct(p.id);
                                    }}>
                                        <button type="submit" className="text-[10px] font-bold text-gray-500 hover:text-red-500 transition-colors uppercase tracking-widest p-2">
                                            Excluir
                                        </button>
                                    </form>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}