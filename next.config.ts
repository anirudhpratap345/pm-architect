import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['recharts', 'framer-motion'],
  },

  // Proxy API requests to backend during development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL 
          ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
          : 'http://localhost:8000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
