import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co", // Tüm supabase alt alan adları
      },
      {
        protocol: "https",
        hostname: "**.r2.dev", // Tüm r2.dev alt alan adları (Daha kapsayıcı)
      },
      {
        protocol: "https",
        hostname: "pub-ce263849f4154be483a563fb232c1dd0.r2.dev", // Sizin özel domaininiz
      },
    ],
  },
};

export default nextConfig;