import type { NextConfig } from "next";

const SUPABASE_PROJECT_REF = 'hpicacbgzxmvvsmwevmc';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${SUPABASE_PROJECT_REF}.supabase.co`,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
