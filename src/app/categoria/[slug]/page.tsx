import { getProductsByCategory } from "@/app/actions/public";
import ProductCard from "@/app/components/ProductCard";
import { Product } from "@/types/store";

// No Next.js 15/16, o params é uma Promise
interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
    // 1. PRECISA dar await no params para pegar o slug
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    // 2. Agora o slug existe e podemos formatar o título
    const products = await getProductsByCategory(slug);

    // Transforma 'tenis' em 'Tênis' ou 'conjuntos' em 'Conjuntos'
    const displayTitle = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "";

    return (
        <main className="min-h-screen bg-black text-white pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">

                <header className="mb-20 border-b border-white/10 pb-10">
                    <span className="text-[#D4AF37] text-[10px] uppercase tracking-[0.5em] mb-4 block">
                        Collection
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif uppercase tracking-tighter">
                        {displayTitle}
                    </h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                    {products.map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-40">
                        <p className="font-serif italic text-gray-600 text-xl">
                            Ainda não temos itens exclusivos nesta categoria.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}