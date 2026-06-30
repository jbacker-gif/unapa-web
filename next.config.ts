import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wmtopxzshgfegeqleojt.supabase.co',
      },
    ],
  },
};

export default nextConfig;
