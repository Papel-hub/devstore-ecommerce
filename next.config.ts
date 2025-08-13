import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "via.placeholder.com",
      "firebasestorage.googleapis.com", // Para imagens do Firebase
      "imgur.com",
      "i.imgur.com",
      "res.cloudinary.com",
      "your-custom-domain.com", // Substitua pelo domínio das suas imagens
    ],
    // Opcional: limitar tamanhos de imagem
    minimumCacheTTL: 60,
  },

  // Opcional: habilitar strict mode
  reactStrictMode: true,

  // Opcional: habilitar fontes personalizadas (se usar)
  // experimental: {
  //   optimizeCss: true,
  // },
};

export default nextConfig;