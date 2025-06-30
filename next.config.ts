import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      // ===== AGGIUNGI QUESTO NUOVO BLOCCO =====
      // Questo autorizza tutti i domini di Google, inclusi quelli degli URL lunghi
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      // =======================================

      // Le tue regole esistenti (vanno benissimo così)
      {
        protocol: 'https',
        hostname: 'storage.cloud.google.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.elanco.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.my-personaltrainer.it',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blog.biopetstore.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.robinsonpetshop.it',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
