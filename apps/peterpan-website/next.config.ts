import type { NextConfig } from "next";

import { loadEnvConfig } from "@next/env";
import { resolve } from "node:path";

// Next가 앱 디렉터리 env를 먼저 고정하므로, 루트 .env를 다시 읽는다.
loadEnvConfig(resolve(process.cwd(), "../.."), undefined, undefined, true);

const nextConfig: NextConfig = {
  transpilePackages: [
    "@repo/auth",
    "@repo/db",
    "@repo/tailwind-config",
    "@repo/ui",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
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
