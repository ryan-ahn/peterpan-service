import type { ReactNode } from "react";

import type { Metadata, Viewport } from "next";
import { Montserrat, Nanum_Pen_Script } from "next/font/google";

import { getSessionProfile } from "@repo/auth/session";
import { getSiteContact } from "@repo/db/siteContact";

import SiteFooter from "@components/siteFooter";
import SiteHeader from "@components/siteHeader";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LEGAL_NAME,
  SITE_NAME,
  SITE_URL,
} from "@lib/site";

import "./globals.css";

const nanumPen = Nanum_Pen_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-nanum-pen",
});

const montserrat = Montserrat({
  weight: ["500", "600"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_LEGAL_NAME}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_LEGAL_NAME, url: SITE_URL }],
  publisher: SITE_LEGAL_NAME,
  category: "nonprofit",
  alternates: { canonical: "./" },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NAVER_SITE_VERIFICATION
      ? { "naver-site-verification": process.env.NAVER_SITE_VERIFICATION }
      : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#1e4336",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [user, contact] = await Promise.all([
    getSessionProfile(),
    getSiteContact(),
  ]);
  const organization = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: SITE_LEGAL_NAME,
    alternateName: [SITE_NAME, "Peter Pan Foundation", "피터팬의 네버랜드"],
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    description: SITE_DESCRIPTION,
    address: contact.address || undefined,
    email: contact.email || undefined,
    telephone: contact.phone || undefined,
    founder: contact.representative || undefined,
  };
  return (
    <html
      lang="ko"
      data-scroll-behavior="smooth"
      className={`${nanumPen.variable} ${montserrat.variable}`}
      suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-3 focus:py-2">
          본문으로
        </a>
        <SiteHeader
          user={user ? { name: user.name, avatarUrl: user.avatarUrl } : null}
        />
        <main id="content" className="flex-1 pb-8 lg:pb-10">
          {children}
        </main>
        <SiteFooter contact={contact} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organization).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
