import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Lista de domínios confiáveis para carregar imagens.
    // Adicionamos apenas fontes que realmente usamos para evitar injeção de imagens maliciosas.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    formats: ['image/webp'],
    qualities: [60, 75, 85, 90, 100],
    minimumCacheTTL: 86400,
  },
  // Nota: O Turbopack já está ativo no Next 16, então não precisamos de configurações extras de build.
};

export default nextConfig;