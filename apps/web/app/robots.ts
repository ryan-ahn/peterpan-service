import type { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => ({
  rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/login"] },
});

export default robots;
