import type { MetadataRoute } from "next";

const routes = [
  "",
  "/about",
  "/about/greeting",
  "/about/organization",
  "/about/bylaws",
  "/village",
  "/village/spaces",
  "/village/operation",
  "/news",
  "/disclosure",
  "/disclosure/management",
  "/disclosure/donations",
  "/donate",
  "/privacy",
];

const sitemap = (): MetadataRoute.Sitemap => {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return routes.map(route => ({
    url: `${origin}${route}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.6,
  }));
};

export default sitemap;
