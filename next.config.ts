import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co", // Yıldız sayısını ikiye çıkardık
      },
      {
        protocol: "https",
        hostname: "pub-ce263849f4154be483a563fb232c1dd0.r2.dev",
      },
    ],
  },
};

export default nextConfig;