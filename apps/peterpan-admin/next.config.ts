import type { NextConfig } from "next";

import { loadEnvConfig } from "@next/env";
import { resolve } from "node:path";

loadEnvConfig(resolve(process.cwd(), "../.."));

const nextConfig: NextConfig = {
  transpilePackages: [
    "@repo/auth",
    "@repo/db",
    "@repo/tailwind-config",
    "@repo/ui",
  ],
  experimental: {
    serverActions: { bodySizeLimit: "25mb" },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.kakaocdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
