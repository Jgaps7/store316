import { getProductsByCategory } from "@/app/actions/public";
import ProductCard from "@/app/components/ProductCard";
import { Product } from "@/types/store";
import type { Metadata } from "next";

// No Next.js 15/16, o params é uma Promise
interface PageProps {
    params: Promise<{ slug: string }>;
}

// SEO otimizado por categoria de vestuário
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    // Mapeamento de categorias com descrições e keywords otimizadas
    const categoryMeta: Record<string, { title: string; description: string; keywords: string }> = {
        "conjuntos": {
            title: "Conjuntos Masculinos Premium | Outfits Completos - Store 316",
            description: "Conjuntos masculinos exclusivos na Store 316. Outfits completos de luxo, looks streetwear prontos para vestir. Estilo premium com desconto especial.",
            keywords: "conjunto masculino premium, outfit completo, look streetwear, conjunto de grife, roupa masculina coordenada, set masculino luxo"
        },
        "camisas": {
            title: "Camisas Masculinas Premium | Oversized & Grife - Store 316",
            description: "Camisas masculinas de luxo: oversized, premium e exclusivas. Shop online de camisas de grife com estilo streetwear único. Qualidade superior.",
            keywords: "camisa oversized, camisa de grife, camisa masculina luxo, shirt premium, camisa streetwear, camisa exclusiva"
        },
        "calcas": {
            title: "Calças Masculinas Premium | Cargo & Streetwear - Store 316",
            description: "Calças masculinas premium: cargo, streetwear e modelagens exclusivas. Peças de luxo com design contemporâneo. Shop online Store 316.",
            keywords: "calça cargo premium, calça masculina estilo, streetwear pants, calça de marca, pants masculino luxo"
        },
        "tenis": {
            title: "Tênis Masculinos Premium | Sneakers Exclusivos - Store 316",
            description: "Tênis e sneakers exclusivos de luxo. Calçados masculinos premium com design único. Lançamentos e edições limitadas na Store 316.",
            keywords: "sneakers exclusivos, tênis de luxo, calçados premium, street shoes, tênis masculino grife, sneakers brasil"
        },
        "casacos": {
            title: "Casacos & Jaquetas Premium | Outerwear Masculino - Store 316",
            description: "Casacos e jaquetas masculinas de luxo. Outerwear premium com qualidade superior. Peças exclusivas para todas as estações.",
            keywords: "jaqueta premium, casaco masculino luxo, outerwear streetwear, jaqueta de grife, casaco exclusivo"
        },
        "bermudas": {
            title: "Bermudas Masculinas Premium | Shorts de Grife - Store 316",
            description: "Bermudas e shorts masculinos premium. Modelagens exclusivas com tecidos nobres. Estilo streetwear de luxo na Store 316.",
            keywords: "bermuda premium, shorts masculino estilo, bermuda de grife, bermuda cargo, shorts streetwear"
        },
        "acessorios": {
            title: "Acessórios Masculinos Premium | Itens de Luxo - Store 316",
            description: "Acessórios masculinos exclusivos: bonés, bolsas, carteiras e mais. Complementos premium para looks de alto padrão.",
            keywords: "acessórios masculinos premium, itens de luxo, fashion accessories, boné premium, bolsa masculina grife"
        }
    };

    const displayTitle = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Categoria";
    const meta = categoryMeta[slug] || {
        title: `${displayTitle} - Store 316`,
        description: `Explore nossa coleção de ${displayTitle.toLowerCase()} premium. Peças exclusivas de moda masculina de luxo na Store 316.`,
        keywords: `${displayTitle.toLowerCase()}, moda masculina premium, Store 316, vestuário de luxo`
    };

    return {
        title: meta.title,
        description: meta.description,
        keywords: meta.keywords,
        openGraph: {
            title: `${displayTitle} Premium - Store 316`,
            description: meta.description,
            type: "website",
            siteName: "Store 316",
        },
        twitter: {
            card: "summary_large_image",
            title: `${displayTitle} - Store 316`,
            description: meta.description,
        },
        alternates: {
            canonical: `https://www.store316.com.br/categoria/${slug}`,
        },
    };
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
                        <p className="font-serif italic text-gray-400 text-xl">
                            Ainda não temos itens exclusivos nesta categoria.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}