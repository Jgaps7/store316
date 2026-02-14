
import { getProductById } from "@/app/actions/public";
import { Product } from "@/types/store";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getDirectDriveLink } from "@/lib/utils";
import ProductImages from "@/app/components/ProductImages"; // We'll create this client component for the carousel
import AddToCartButton from "@/app/components/AddToCartButton"; // We'll create/refactor this too

interface PageProps {
    params: Promise<{ slug: string }>;
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

    return (
        <main className="min-h-screen bg-black text-white pt-32 pb-20">
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
                        {hasDiscount ? (
                            <div className="flex items-center gap-4">
                                <span className="text-gray-500 line-through font-serif text-xl">
                                    R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                                <span className="text-[#D4AF37] font-serif text-3xl">
                                    R$ {finalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                                <span className="bg-[#D4AF37] text-black text-[10px] uppercase font-bold px-2 py-1 rounded-sm">
                                    {discount_percent}% OFF
                                </span>
                            </div>
                        ) : (
                            <p className="text-[#D4AF37] font-serif text-3xl">
                                R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        )}
                        <p className="text-gray-500 text-xs font-light">Em até 12x de R$ {(finalPrice / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
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
