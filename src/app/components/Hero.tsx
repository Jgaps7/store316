"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import { getDirectDriveLink } from "@/lib/utils";

export default function Hero() {
    return (
        <section className="relative h-[92vh] w-full bg-black overflow-hidden">
            {/* --- CAMADA 1: Fundo Texturizado (Atmosfera) --- */}
            <div className="absolute inset-0 opacity-30">
                <Image
                    src="https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?q=80&w=2070&auto=format&fit=crop" // Ex: Textura de mármore preto ou tecido
                    alt="Atmosphere"
                    fill
                    className="object-cover grayscale"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* --- CAMADA 2: Imagem Principal Assimétrica (Foco) --- */}
            {/* Posicionada à direita, criando espaço negativo na esquerda para o texto */}
            <div className="absolute top-0 right-0 w-[90%] md:w-[55%] h-full bg-[#0A0A0A] border-l border-white/10 overflow-hidden animate-in slide-in-from-right duration-1000">
                {/* Overlay de cor para unificar com o site */}
                <div className="absolute inset-0 bg-black/20 z-10 mix-blend-overlay pointer-events-none" />

                <Image
                    src={getDirectDriveLink("https://drive.google.com/file/d/1YVRtj64uAUjK9j0vRf-dWvhmc31H7Z76/view?usp=drive_link")}
                    alt="Nova Coleção Store 316"
                    fill
                    className="object-cover object-center scale-105 hover:scale-100 transition-transform duration-[2000ms] ease-out"
                    priority
                />
            </div>

            {/* --- CAMADA 3: Conteúdo Editorial (Texto) --- */}
            <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-24 md:justify-center md:pb-0 z-20 pointer-events-none">
                <div className="md:w-1/2 pointer-events-auto">
                    {/* Subtítulo Técnico */}
                    <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.4em] mb-6 animate-in slide-in-from-bottom fade-in duration-700 delay-300">
                        Edição Limitada • Outono/Inverno '24
                    </p>

                    {/* Título Gigante Serifado */}
                    <h2 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white leading-[0.9] tracking-tighter mb-12 animate-in slide-in-from-bottom fade-in duration-700 delay-500 mix-blend-difference">
                        A NOVA<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#777]">ESTÉTICA</span><br />
                        DO LUXO.
                    </h2>

                    {/* Botão "Anti-Botão" Minimalista */}
                    <Link
                        href="/categoria/conjuntos"
                        className="group inline-flex items-center gap-4 text-white uppercase tracking-[0.2em] text-xs hover:text-[#D4AF37] transition-all duration-500 animate-in fade-in duration-700 delay-700"
                    >
                        <span className="border-b border-white/30 group-hover:border-[#D4AF37] pb-2 transition-all duration-500">
                            Explorar a Coleção
                        </span>
                        <ArrowDownRight className="group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500" size={18} />
                    </Link>
                </div>
            </div>

            {/* Indicador de Scroll (Detalhe de Luxo) */}
            <div className="absolute bottom-8 left-6 text-white/30 text-[9px] uppercase tracking-widest animate-bounce-slow flex items-center gap-2">
                <div className="w-8 h-[1px] bg-white/30" /> Scroll para descobrir
            </div>
        </section>
    );
}