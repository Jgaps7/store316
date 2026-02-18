import { getProductById } from "@/app/actions/public";
import { Product } from "@/types/store";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getDirectDriveLink } from "@/lib/utils";
import ProductImages from "@/app/components/ProductImages";
import AddToCartButton from "@/app/components/AddToCartButton";
import ProductPriceDisplay from "@/app/components/ProductPriceDisplay";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ slug: string }>;
}

// SEO: Metadata otimizada para vestuário masculino premium
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const product = await getProductById(resolvedParams.slug) as Product | null;

    if (!product) {
        return {
            title: "Produto não encontrado | Store 316",
        };
    }

    const categoryName = product.categories?.name || "Moda Premium";
    const hasDiscount = product.discount_percent && product.discount_percent > 0;
    const finalPrice = hasDiscount
        ? product.price * (1 - product.discount_percent! / 100)
        : product.price;

    // Keywords estratégicas por categoria
    const categoryKeywords: Record<string, string> = {
        "Conjuntos": "conjunto masculino premium, outfit completo, look streetwear, roupa de grife",
        "Camisas": "camisa oversized, camisa de grife, camisa masculina luxo, shirt premium",
        "Calças": "calça cargo premium, calça masculina estilo, streetwear pants, calça de marca",
        "Tênis": "sneakers exclusivos, tênis de luxo, calçados premium, street shoes",
        "Casacos": "jaqueta premium, casaco masculino luxo, outerwear streetwear",
        "Bermudas": "bermuda premium, shorts masculino estilo, bermuda de grife",
        "Acessórios": "acessórios masculinos premium, itens de luxo, fashion accessories"
    };

    const categoryKeyword = categoryKeywords[categoryName] || "moda masculina premium, vestuário de luxo";
    const keywords = `${product.name}, ${categoryKeyword}, Store 316, moda masculina exclusiva, streetwear Brasil`;

    const description = product.description
        ? `${product.description.slice(0, 140)}... Compre agora na Store 316 com desconto exclusivo.`
        : `${product.name} - ${categoryName} premium. Moda masculina de luxo com estilo único. Entrega para todo Brasil.`;

    return {
        title: `${product.name} | ${categoryName} Premium - Store 316`,
        description,
        keywords,
        openGraph: {
            title: `${product.name} - Store 316`,
            description,
            images: product.image_urls?.map(url => ({
                url: getDirectDriveLink(url),
                width: 1200,
                height: 1200,
                alt: product.name,
            })) || [],
            type: "website",
            siteName: "Store 316",
        },
        twitter: {
            card: "summary_large_image",
            title: `${product.name} - Store 316`,
            description,
            images: product.image_urls?.[0] ? [getDirectDriveLink(product.image_urls[0])] : [],
        },
        alternates: {
            canonical: `https://www.store316.com.br/product/${resolvedParams.slug}`,
        },
    };
}

export default async function ProductPage({ params }: PageProps) {
    const resolvedParams = await params;
    const { slug } = resolvedParams; // Note: currently treating slug as ID based on our plan, or actual slug if supported.

    // We are using 'slug' from the URL, but our action seeks by ID. 
    // If the URL passes an ID, this works. If it passes a verbal slug, we need to change the action.
    // For now, let's assume the link will pass the ID.
    const product = await getProductById(slug) as Product | null;

    if (!product) {
        notFound();
    }

    const { name, price, description, images = [], sizes = [], discount_percent } = product as any;
    // Cast 'product as any' temporarily because 'images' might be mapped from 'image_urls' in the component or we need to align types.
    // Actually, type Product has `image_urls`.
    const productImages = product.image_urls || [];
    const productSizes = product.sizes || [];

    // Discount Calculation
    const hasDiscount = discount_percent && discount_percent > 0;
    const finalPrice = hasDiscount
        ? price * (1 - discount_percent / 100)
        : price;

    // Schema.org JSON-LD para Rich Snippets
    const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": name,
        "description": description || `${name} - Produto premium da Store 316`,
        "image": productImages.map(url => getDirectDriveLink(url)),
        "brand": {
            "@type": "Brand",
            "name": "Store 316"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://www.store316.com.br/product/${slug}`,
            "priceCurrency": "BRL",
            "price": finalPrice.toFixed(2),
            "availability": "https://schema.org/InStock",
            "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
    };

    return (
        <main className="min-h-screen bg-black text-white pt-32 pb-20">
            {/* Schema.org JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                {/* Left Column: Images (Carousel) */}
                <div className="w-full">
                    <ProductImages images={productImages} name={name} />
                </div>

                {/* Right Column: Details */}
                <div className="flex flex-col justify-start space-y-8 sticky top-32 h-fit">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif mb-2 tracking-tight">{name}</h1>
                        <p className="text-gray-400 text-xs uppercase tracking-[0.2em]">
                            {product.categories?.name || "Collection"}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <ProductPriceDisplay price={price} discountPercent={discount_percent} />
                    </div>

                    <div className="prose prose-invert prose-sm text-gray-300 font-light leading-relaxed">
                        <p>{description}</p>
                    </div>

                    <div className="border-t border-white/10 pt-8">
                        <AddToCartButton product={product} />
                    </div>
                </div>
            </div>
        </main>
    );
}
