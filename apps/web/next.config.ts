import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for optimal Vercel deployment
  output: 'standalone',
  
  // Security and performance
  poweredByHeader: false,
  compress: true,
  
  // Image optimization for your CDN/Object Storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.oraclecloud.com',
        pathname: '/**',
      },
      // Add your CDN domain if different
      // {
      //   protocol: 'https',
      //   hostname: 'your-cdn-domain.com',
      //   pathname: '/**',
      // },
    ],
  },
  
  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
