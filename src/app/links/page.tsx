"use client";

import { Globe, MessageCircle, MapPin, Instagram } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function BioLinks() {
    const links = [
        { title: "Site Oficial", icon: <Globe size={18} />, url: "/" }, // Using root relative path or full domain
        { title: "Atendimento Vendedor 01", icon: <MessageCircle size={18} />, url: "https://wa.me/5561984611083" },
        { title: "Atendimento Vendedor 02", icon: <MessageCircle size={18} />, url: "https://wa.me/5561984611083" }, // Using same number as fallback
        { title: "Nossa Localização", icon: <MapPin size={18} />, url: "https://maps.google.com" }, // Placeholder as no address found
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <main className="min-h-screen relative flex flex-col items-center px-6 pt-20 pb-10 overflow-hidden font-sans bg-black">

            {/* --- CAMADA 1: FUNDO DE LUXO (Grid Atmosférico) --- */}
            <div className="absolute inset-0 z-0 grid grid-cols-2 grid-rows-3 gap-0.5 pointer-events-none opacity-60">
                <img src="https://placehold.co/600x800/111/333?text=Texture" alt="" className="w-full h-full object-cover row-span-2 brightness-50 grayscale" />
                <img src="https://placehold.co/600x400/0a0a0a/222?text=Lifestyle" alt="" className="w-full h-full object-cover brightness-50 grayscale" />
                <img src="https://placehold.co/600x400/050505/444?text=Detail" alt="" className="w-full h-full object-cover brightness-50 grayscale" />
                <img src="https://placehold.co/600x400/151515/333?text=Ambiance" alt="" className="w-full h-full object-cover col-span-2 brightness-50 grayscale" />
            </div>

            {/* --- CAMADA 2: OVERLAY DE LEITURA --- */}
            <div className="absolute inset-0 z-10 bg-black/85 backdrop-blur-[2px]" />

            {/* --- CAMADA 3: CONTEÚDO --- */}
            <div className="relative z-20 flex flex-col items-center w-full max-w-[400px] flex-1">

                {/* LOGO CENTRALIZADA COM GLOW */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-16 relative group"
                >
                    {/* Glow Dourado */}
                    <div className="absolute -inset-8 bg-[#D4AF37] blur-3xl rounded-full z-0 opacity-20 animate-pulse"></div>

                    {/* Container da Logo */}
                    <div className="w-32 h-32 rounded-full border-[3px] border-[#D4AF37] p-1 shadow-[0_0_40px_rgba(212,175,55,0.3)] relative z-10 bg-black overflow-hidden flex items-center justify-center">
                        <img
                            src="/logo.png"
                            alt="Store 316"
                            className="w-full h-full object-contain p-2"
                        />
                    </div>
                </motion.div>

                {/* LISTA DE LINKS (STAGGERED) */}
                <motion.div
                    className="w-full space-y-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {links.map((link, idx) => (
                        <motion.a
                            key={idx}
                            variants={itemVariants}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between w-full bg-zinc-900/60 backdrop-blur-md border border-[#D4AF37]/40 p-5 rounded-sm hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black group transition-all duration-300 hover:-translate-y-1 shadow-lg"
                        >
                            <span className="text-[#D4AF37] group-hover:text-black text-[10px] font-black uppercase tracking-[0.2em] transition-colors leading-none">
                                {link.title}
                            </span>
                            <div className="text-[#D4AF37] group-hover:text-black transition-colors drop-shadow-[0_0_8px_rgba(212,175,55,0.5)] group-hover:drop-shadow-none">
                                {link.icon}
                            </div>
                        </motion.a>
                    ))}
                </motion.div>

                {/* FOOTER SOCIAL */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="mt-auto pt-12 flex gap-6 text-zinc-600"
                >
                    <Instagram size={24} className="hover:text-[#D4AF37] transition-colors cursor-pointer hover:scale-110 duration-300" />
                </motion.div>

            </div>
        </main>
    );
}