"use client";

import { useState, useMemo } from "react";
import { ProductForm } from "./ProductForm";
import { CSVImporter } from "./CSVImporter";
import { deleteProduct, updateProduct } from "@/app/actions/products";
import { Product, Category } from "@/types/store";
import { Search, Filter, Merge, Trash2, Edit2, CheckSquare, Square, Upload, X, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

// Helper: Transforma links comuns do Google Drive em links diretos de visualização (lh3)
const getAdminThumbnail = (url: string) => {
    if (!url) return null;
    const match = url.match(/\/d\/([^/]+)/) || url.match(/id=([^&]+)/);
    const fileId = match ? match[1] : null;
    if (fileId) return `https://lh3.googleusercontent.com/d/${fileId}`;
    return url;
};

export function AdminDashboardClient({ products, categories }: { products: Product[], categories: Category[] }) {
    const router = useRouter();
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Filtros
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Seleção para Merge
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [isMerging, setIsMerging] = useState(false);

    // Modal de Importação
    const [showImportModal, setShowImportModal] = useState(false);

    // Lógica de Filtragem
    const [showProductForm, setShowProductForm] = useState(false);

    // Lógica de Filtragem
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "all" || p.category_id === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);

    // Toggle Seleção
    const toggleSelectProduct = (id: string) => {
        setSelectedProductIds(prev =>
            prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
        );
    };

    // Lógica de Merge
    const handleMerge = async () => {
        if (selectedProductIds.length < 2) return;
        if (!confirm(`Tem certeza que deseja agrupar ${selectedProductIds.length} produtos? O primeiro selecionado (ou o mais antigo) será o principal e herdará as imagens dos outros.`)) return;

        setIsMerging(true);

        // 1. Identificar o produto principal (vamos usar o primeiro da seleção na lista filtrada para manter ordem visual)
        const mainProductIndex = filteredProducts.findIndex(p => selectedProductIds.includes(p.id));
        const mainProduct = filteredProducts[mainProductIndex];

        // Os outros são secundários
        const secondaryIds = selectedProductIds.filter(id => id !== mainProduct.id);
        const secondaryProducts = products.filter(p => secondaryIds.includes(p.id));

        // 2. Coletar imagens
        let allImages = [...(mainProduct.image_urls || [])];
        secondaryProducts.forEach(p => {
            if (p.image_urls) allImages.push(...p.image_urls);
        });

        // Remover duplicatas e limpar vazios
        allImages = Array.from(new Set(allImages)).filter(Boolean);

        // 3. Atualizar o principal
        const formData = new FormData();
        formData.append("name", mainProduct.name);
        formData.append("price", String(mainProduct.price));
        formData.append("description", mainProduct.description || "");
        formData.append("categoryId", mainProduct.category_id || "");
        formData.append("imageUrls", allImages.join('\n'));
        formData.append("sizes", JSON.stringify(mainProduct.sizes || []));
        if (mainProduct.discount_percent) {
            formData.append("discountPercent", String(mainProduct.discount_percent));
        }

        const updateResult = await updateProduct(mainProduct.id, null, formData);

        if (updateResult?.error) {
            alert("Erro ao atualizar o produto principal: " + updateResult.error);
            setIsMerging(false);
            return;
        }

        // 4. Deletar os secundários
        for (const id of secondaryIds) {
            await deleteProduct(id);
        }

        // Reset
        setSelectedProductIds([]);
        setIsMerging(false);
        alert("Produtos agrupados com sucesso!");
        router.refresh();
    };

    return (
        <>
            <main className="w-full min-h-screen bg-black text-gray-200">
                {/* Sticky Header */}
                <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-[#333] px-6 py-4 shadow-2xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                        {/* Title & Add Button */}
                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
                            <div>
                                <h1 className="text-xl font-serif text-[#D4AF37] uppercase tracking-widest">Inventário</h1>
                                <p className="text-[9px] text-gray-500 uppercase tracking-widest leading-none mt-1">{filteredProducts.length} PRODUTOS</p>
                            </div>

                            <button
                                onClick={() => {
                                    setEditingProduct(null);
                                    setShowProductForm(true);
                                }}
                                className="flex items-center gap-2 bg-[#D4AF37] text-black px-5 py-2.5 hover:bg-[#b5952f] transition-all uppercase text-[10px] font-bold tracking-[0.2em] shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                            >
                                <span className="text-lg leading-none mb-0.5">+</span>
                                <span>Novo Produto</span>
                            </button>
                        </div>

                        {/* Actions Bar (Search, Filter, Import, Merge) */}
                        <div className="flex items-center gap-3 w-full md:w-auto">

                            {/* Search */}
                            <div className="relative flex-1 md:w-64 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#D4AF37] transition" size={14} />
                                <input
                                    type="text"
                                    placeholder="BUSCAR..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-[#111] border border-[#333] pl-9 pr-4 py-2.5 text-[10px] text-white placeholder-gray-600 focus:border-[#D4AF37] outline-none transition uppercase tracking-wider"
                                />
                            </div>

                            {/* Filter */}
                            <div className="relative w-40">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full bg-[#111] border border-[#333] pl-9 pr-8 py-2.5 text-[10px] text-white focus:border-[#D4AF37] outline-none appearance-none cursor-pointer uppercase tracking-wider"
                                >
                                    <option value="all">Todas as Categorias</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Import Button */}
                            <button
                                onClick={() => setShowImportModal(true)}
                                className="p-2.5 bg-[#111] border border-[#333] text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition"
                                title="Importar CSV"
                            >
                                <Upload size={16} />
                            </button>

                            {/* Merge Button (Conditional) */}
                            {selectedProductIds.length > 0 && (
                                <button
                                    onClick={handleMerge}
                                    disabled={isMerging || selectedProductIds.length < 2}
                                    className="flex items-center gap-2 bg-[#D4AF37] text-black px-4 py-2.5 uppercase text-[10px] font-bold tracking-widest hover:bg-[#b5952f] disabled:opacity-50 transition"
                                >
                                    <Merge size={14} />
                                    <span>{isMerging ? "..." : `Agrupar (${selectedProductIds.length})`}</span>
                                </button>
                            )}

                            {selectedProductIds.length > 0 && (
                                <button
                                    onClick={() => setSelectedProductIds([])}
                                    className="p-2.5 bg-[#111] border border-[#333] text-gray-400 hover:text-white hover:border-[#D4AF37] transition uppercase text-[10px] font-bold tracking-widest group"
                                    title="Cancelar Seleção"
                                >
                                    <RotateCcw size={14} className="group-hover:-rotate-180 transition-transform duration-500" />
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Product Grid */}
                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {filteredProducts.map((p) => {
                            const rawUrl = Array.isArray(p.image_urls) ? p.image_urls[0] : p.image_urls;
                            const src = getAdminThumbnail(rawUrl);
                            const isSelected = selectedProductIds.includes(p.id);

                            return (
                                <div
                                    key={p.id}
                                    className={`group relative bg-[#0a0a0a] border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${isSelected ? 'border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)] ring-1 ring-[#D4AF37]/50' : 'border-[#222] hover:border-[#D4AF37]/50'}`}
                                >
                                    {/* Selection Overlay */}
                                    <div className="absolute top-2 left-2 z-20">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSelectProduct(p.id);
                                            }}
                                            className={`w-6 h-6 flex items-center justify-center border transition-all ${isSelected ? 'bg-[#D4AF37] border-[#D4AF37]' : 'bg-black/50 border-white/30 hover:border-[#D4AF37]'}`}
                                        >
                                            {isSelected && <CheckSquare size={14} className="text-black" />}
                                        </button>
                                    </div>

                                    {/* Image Aspect 1:1 */}
                                    <div className="relative aspect-square overflow-hidden bg-[#111]">
                                        {src ? (
                                            <img
                                                src={src}
                                                alt={p.name}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                                loading="lazy"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    if (!target.src.includes('placehold.co')) {
                                                        target.src = "https://placehold.co/400x400/000000/D4AF37?text=NO+IMAGE";
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-700 uppercase tracking-widest">
                                                Sem Imagem
                                            </div>
                                        )}

                                        {/* Actions Overlay (Edit/Delete) - Visible on Hover */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => {
                                                    setEditingProduct(p);
                                                    setShowProductForm(true);
                                                }}
                                                className="p-2 bg-[#D4AF37] text-black hover:bg-white transition rounded-full"
                                                title="Editar"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (confirm(`Excluir "${p.name}"?`)) await deleteProduct(p.id);
                                                }}
                                                className="p-2 bg-black border border-red-900/50 text-red-500 hover:bg-red-900 hover:text-white transition rounded-full"
                                                title="Excluir"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Card Info */}
                                    <div className="p-4">
                                        <h3 className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.15em] truncate mb-1 group-hover:text-white transition">
                                            {p.name}
                                        </h3>

                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                {p.discount_percent && p.discount_percent > 0 ? (
                                                    <>
                                                        <span className="text-[9px] text-gray-600 line-through">R$ {Number(p.price).toFixed(2)}</span>
                                                        <span className="text-xs text-[#D4AF37] font-mono leading-none">
                                                            R$ {(p.price * (1 - p.discount_percent / 100)).toFixed(2)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-[#D4AF37] font-mono leading-none">
                                                        R$ {Number(p.price).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>

                                            {p.discount_percent && p.discount_percent > 0 && (
                                                <span className="text-[9px] font-bold text-red-500 bg-red-900/10 px-1.5 py-0.5 border border-red-900/20 rounded">
                                                    -{p.discount_percent}%
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-2 pt-2 border-t border-[#222] flex justify-between items-center">
                                            <span className="text-[9px] text-gray-600 uppercase tracking-wider">{p.categories?.name || "Geral"}</span>
                                            <span className="text-[9px] text-gray-600 font-mono">{(p.sizes || []).length} CRADES</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                            <Search size={48} className="mb-4 opacity-20" />
                            <p className="text-xs uppercase tracking-widest">Nenhum produto encontrado</p>
                        </div>
                    )}
                </div>
            </main>

            {(showProductForm || editingProduct) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-200 backdrop-blur-sm">
                    <div className="relative w-full max-w-5xl">
                        <ProductForm
                            categories={categories}
                            editingProduct={editingProduct}
                            onCancelEdit={() => {
                                setShowProductForm(false);
                                setEditingProduct(null);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Modal: CSV Import */}
            {showImportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-200 backdrop-blur-sm">
                    <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-[#222] rounded-2xl p-8 shadow-2xl skew-y-0">
                        <button
                            onClick={() => setShowImportModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
                        >
                            <X size={20} />
                        </button>

                        <CSVImporter onImportSuccess={() => router.refresh()} />
                    </div>
                </div>
            )}
        </>
    );
}