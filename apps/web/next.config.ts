import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for optimal Vercel deployment
  output: "standalone",

  // Security and performance
  poweredByHeader: false,
  compress: true,

  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },

  // Image optimization for your CDN/Object Storage
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.oraclecloud.com",
        pathname: "/**",
      },
      // personal supabase
      {
        protocol: "https",
        hostname: "pyzddsvvazfrhohghuki.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      //personal supabase
      {
        protocol: "https",
        hostname: "rwutaufwmebkyipekybp.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      //current production supabase
      {
        protocol: "https",
        hostname: "rhbbxttxnvcziyqzptqs.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
