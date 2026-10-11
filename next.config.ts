import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img1.brunch.co.kr",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img2.brunch.co.kr",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "image.brunch.co.kr",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.kakaocdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.daumcdn.net",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
