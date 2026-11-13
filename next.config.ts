import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-ce263849f4154be483a563fb232c1dd0.r2.dev",
      },
      {
        protocol: "https",
        hostname: "hpicacbgzxmvvsmwevmc.supabase.co",
        pathname: "/storage/v1/object/public/**",
        
      }
    ],
  },

  //LIMIT IMAGE SIZE
  experimental: {
    serverActions : {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;

