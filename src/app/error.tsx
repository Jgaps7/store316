"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
            <h2 className="text-2xl font-serif text-[#D4AF37] mb-4">Algo deu errado!</h2>
            <p className="text-gray-400 mb-8 text-center max-w-md">
                Não foi possível carregar o conteúdo. Por favor, tente novamente.
            </p>
            <button
                onClick={reset}
                className="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded hover:bg-[#b5952f] transition"
            >
                Tentar Novamente
            </button>
        </div>
    );
}
