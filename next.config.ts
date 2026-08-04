import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Há um package-lock.json solto no diretório do usuário; sem isto o Next
  // elege a raiz errada para o tracing de arquivos.
  outputFileTracingRoot: import.meta.dirname,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
