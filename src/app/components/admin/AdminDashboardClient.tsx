"use client";

import { useState, useMemo } from "react";
import { ProductForm } from "./ProductForm";
import { CSVImporter } from "./CSVImporter";
import { deleteProduct, updateProduct } from "@/app/actions/products";
import { Product, Category } from "@/types/store";
import { Search, Filter, Merge, Trash2, Edit2, CheckSquare, Square, Upload, X } from "lucide-react";
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

        // 1. Identificar o produto principal (vamos usar o primeiro da seleção na lista filtrada para manter ordem visual, ou o primeiro do array de IDs)
        // Para ser consistente, vamos pegar o produto que está NA LISTA e é o primeiro entre os selecionados.
        // Isso garante que se o usuário vê uma ordem, o de cima é o principal.
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
        // Precisamos criar um FormData para usar a action existente updateProduct
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
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1 space-y-8">
                    <ProductForm
                        categories={categories}
                        editingProduct={editingProduct}
                        onCancelEdit={() => setEditingProduct(null)}
                    />
                </div>

                <div className="lg:col-span-2 bg-[#1A1A1A] p-6 rounded border border-[#333] flex flex-col h-full max-h-[calc(100vh-100px)]">
                    {/* Header & Filters */}
                    <div className="flex flex-col gap-4 mb-6 border-b border-[#222] pb-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xl font-serif text-[#D4AF37] uppercase tracking-wider">Inventário</h2>
                                <span className="text-gray-600 text-xs uppercase tracking-widest">{filteredProducts.length} Itens</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowImportModal(true)}
                                    className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b5952f] text-black px-4 py-2 rounded-sm text-xs uppercase font-bold tracking-widest transition shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                                >
                                    <Upload size={16} />
                                    <span>Importar CSV</span>
                                </button>

                                {selectedProductIds.length > 0 && (
                                    <button
                                        onClick={handleMerge}
                                        disabled={isMerging || selectedProductIds.length < 2}
                                        className="flex items-center gap-2 bg-[#D4AF37] text-black px-3 py-1.5 rounded text-[10px] uppercase font-bold tracking-widest hover:bg-[#b5952f] disabled:opacity-50 transition"
                                    >
                                        <Merge size={14} />
                                        {isMerging ? "Agrupando..." : `Agrupar (${selectedProductIds.length})`}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>


                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                            <input
                                type="text"
                                placeholder="Buscar produto..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black border border-[#333] pl-10 pr-4 py-2 text-xs text-white placeholder-gray-600 focus:border-[#D4AF37] outline-none rounded"
                            />
                        </div>
                        <div className="relative w-1/3">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full bg-black border border-[#333] pl-10 pr-4 py-2 text-xs text-white focus:border-[#D4AF37] outline-none rounded appearance-none cursor-pointer"
                            >
                                <option value="all">Todas as Categorias</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Lista de Produtos */}
                    <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                        {filteredProducts.map((p) => {
                            const rawUrl = Array.isArray(p.image_urls) ? p.image_urls[0] : p.image_urls;
                            const src = getAdminThumbnail(rawUrl);
                            const isSelected = selectedProductIds.includes(p.id);

                            return (
                                <div
                                    key={p.id}
                                    className={`flex justify-between items-center p-4 bg-black/40 border rounded-lg transition-all group ${isSelected ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-[#333] hover:border-[#D4AF37]/50'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => toggleSelectProduct(p.id)}
                                            className="text-gray-600 hover:text-[#D4AF37] transition"
                                        >
                                            {isSelected ? <CheckSquare size={18} className="text-[#D4AF37]" /> : <Square size={18} />}
                                        </button>

                                        <div className="w-14 h-14 rounded bg-[#111] overflow-hidden border border-[#222] flex-shrink-0 relative">
                                            {src ? (
                                                <img
                                                    src={src}
                                                    alt={p.name}
                                                    referrerPolicy="no-referrer"
                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-500"
                                                    loading="lazy"
                                                    onError={(e) => {
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
                                                {p.discount_percent && p.discount_percent > 0 ? (
                                                    <>
                                                        <span className="text-gray-600 line-through text-[10px]">R$ {Number(p.price).toFixed(2)}</span>
                                                        <span className="text-xs text-[#D4AF37] font-mono">
                                                            R$ {(p.price * (1 - p.discount_percent / 100)).toFixed(2)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <p className="text-xs text-[#D4AF37] font-mono">R$ {Number(p.price).toFixed(2)}</p>
                                                )}

                                                <span className="text-[9px] uppercase text-gray-600 bg-[#222] px-1.5 py-0.5 rounded">
                                                    {p.categories?.name || "Geral"}
                                                </span>
                                                {p.discount_percent && p.discount_percent > 0 && (
                                                    <span className="text-[9px] uppercase bg-red-900/30 text-red-400 px-1.5 py-0.5 rounded border border-red-900/50">
                                                        -{p.discount_percent}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingProduct(p);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="text-gray-500 hover:text-[#D4AF37] transition p-2"
                                            title="Editar"
                                        >
                                            <Edit2 size={16} />
                                        </button>

                                        <form action={async () => {
                                            if (confirm(`Excluir "${p.name}"?`)) await deleteProduct(p.id);
                                        }}>
                                            <button type="submit" className="text-gray-500 hover:text-red-500 transition p-2" title="Excluir">
                                                <Trash2 size={16} />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-10 text-gray-600">
                                Nenhum produto encontrado.
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal de Importação CSV */}
            {
                showImportModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200">
                        <div className="relative w-full max-w-lg bg-[#111] border border-[#333] rounded-lg p-6 shadow-2xl">
                            <button
                                onClick={() => setShowImportModal(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-6">
                                <h3 className="text-xl font-serif text-[#D4AF37] uppercase tracking-wider mb-1">Importação de Produtos</h3>
                                <p className="text-xs text-gray-500">Faça upload de um arquivo CSV para adicionar produtos em massa.</p>
                            </div>

                            <CSVImporter onImportSuccess={() => {
                                router.refresh();
                                // Optional: close modal on success?
                                // setShowImportModal(false); 
                            }} />
                        </div>
                    </div>
                )
            }
        </>
    );
}