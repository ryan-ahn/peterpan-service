import type { MetadataRoute } from "next";

import { SITE_DESCRIPTION, SITE_LEGAL_NAME, SITE_NAME } from "@lib/site";

const manifest = (): MetadataRoute.Manifest => ({
  name: SITE_LEGAL_NAME,
  short_name: SITE_NAME,
  description: SITE_DESCRIPTION,
  start_url: "/",
  display: "standalone",
  lang: "ko",
  background_color: "#f7f3ea",
  theme_color: "#1e4336",
  icons: [
    { src: "/icon.png", sizes: "512x512", type: "image/png" },
    { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
  ],
});

export default manifest;
