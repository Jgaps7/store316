
"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { getDirectDriveLink } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImagesProps {
    images: string[];
    name: string;
}

export default function ProductImages({ images, name }: ProductImagesProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
    }, [emblaApi, onSelect]);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[3/4] bg-[#111] flex items-center justify-center border border-[#333]">
                <span className="text-gray-600 text-xs uppercase tracking-widest">Sem Imagem</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Carousel */}
            <div className="relative group">
                <div className="overflow-hidden border border-[#333] bg-[#0A0A0A]" ref={emblaRef}>
                    <div className="flex">
                        {images.map((img, index) => (
                            <div key={index} className="flex-[0_0_100%] min-w-0 relative aspect-[3/4]">
                                <Image
                                    src={getDirectDriveLink(img)}
                                    alt={`${name} - Imagem ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={scrollPrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#D4AF37] text-white hover:text-black p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                            aria-label="Imagem Anterior"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={scrollNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#D4AF37] text-white hover:text-black p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                            aria-label="Próxima Imagem"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => emblaApi && emblaApi.scrollTo(index)}
                            className={`relative w-20 aspect-[3/4] flex-shrink-0 border transition-all ${selectedIndex === index ? "border-[#D4AF37] opacity-100" : "border-transparent opacity-50 hover:opacity-100"
                                }`}
                            aria-label={`Ver miniatura ${index + 1}`}
                        >
                            <Image
                                src={getDirectDriveLink(img)}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
