import Image from "next/image";
import { getPublicProducts } from "@/app/actions/public";
import ProductCard from "@/app/components/ProductCard";
import Hero from "@/app/components/Hero";
import { Product } from "@/types/store";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store 316 | Moda Masculina Premium - Streetwear de Luxo",
  description: "Descubra a Store 316: vestuário masculino premium, streetwear exclusivo e peças de luxo. Conjuntos, camisas, tênis e acessórios com estilo único. Entrega para todo Brasil.",
  keywords: "moda masculina premium, streetwear luxo, roupas masculinas exclusivas, Store 316, vestuário de grife, conjuntos masculinos, tênis premium, camisas oversized, moda urbana Brasil",
  openGraph: {
    title: "Store 316 - Moda Masculina Premium",
    description: "Vestuário masculino de luxo com estilo único. Coleção exclusiva de streetwear premium.",
    images: ["/logo.png"],
    type: "website",
    siteName: "Store 316",
  },
  twitter: {
    card: "summary_large_image",
    title: "Store 316 - Streetwear Premium",
    description: "Moda masculina de luxo com identidade brasileira.",
  },
};

export const revalidate = 3600;

export default async function Home() {
  const products = await getPublicProducts();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#D4AF37] selection:text-black">

      <Hero />

      <section className="py-24 border-y border-white/5 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-[#D4AF37] text-[10px] uppercase tracking-[0.5em] mb-8 block">
            Visão
          </span>
          <p className="text-xl md:text-2xl font-serif font-light leading-relaxed text-gray-300 italic">
            "Não vendemos apenas peças de vestuário. Entregamos fragmentos de uma narrativa onde a excelência é o único padrão aceitável."
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-serif tracking-tight">Coleção <span className="text-[#D4AF37]">01</span></h2>
            <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em]">Peças Selecionadas • Fevereiro 2026</p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-gray-400 text-[9px] uppercase tracking-widest max-w-[200px]">
              Cada item é numerado e verificado sob os mais rígidos controles de qualidade.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {products.length === 0 && (
            <div className="col-span-full text-center py-40 border border-dashed border-white/10 rounded-lg">
              <p className="font-serif italic text-gray-400">Aguardando o próximo drop exclusivo...</p>
            </div>
          )}
        </div>
      </main>

      {/* 4. FOOTER: Atualizado com a Logo */}
      <footer className="bg-[#0A0A0A] border-t border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            {/* SUBSTITUIÇÃO DO TEXTO PELA IMAGEM DA LOGO */}
            <div className="relative w-36 h-14 mb-4">
              <Image
                src="/logo.png" // Certifique-se que o arquivo está em /public/logo.png
                alt="Store 316"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 144px, 144px"
                quality={76}
              />
            </div>
            <p className="text-gray-400 text-[9px] uppercase tracking-[0.2em]">Onde o luxo encontra a autenticidade.</p>
          </div>

          <div className="flex gap-8 text-[10px] uppercase tracking-widest text-gray-400">
            <a href="https://www.instagram.com/store_316_?igsh=MTdzNjZxMWIzMmJ4dw==" className="hover:text-[#D4AF37] transition-colors">Instagram</a>
            <a href="https://wa.me/5561984611083" className="hover:text-[#D4AF37] transition-colors">WhatsApp</a>
            <a href="https://wa.me/5561984611083" className="hover:text-[#D4AF37] transition-colors">Suporte</a>
          </div>

          <div className="text-gray-400 text-[9px] uppercase tracking-tighter text-center md:text-right">
            <p>&copy; 2026 Store 316. All rights reserved.</p>
            <p className="mt-1 opacity-50 hover:opacity-100 transition-opacity">Design by @agencia.growsolutions</p>
          </div>
        </div>
      </footer>
    </div>
  );
}