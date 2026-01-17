import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "lxnebomsftrsyfznhsph.supabase.co",
      },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
