import type { MetadataRoute } from "next";

import { SITE_URL } from "@lib/site";

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: "*",
    allow: "/",
    disallow: ["/login", "/mypage", "/auth/", "/board/write"],
  },
  sitemap: `${SITE_URL}/sitemap.xml`,
  host: SITE_URL,
});

export default robots;
