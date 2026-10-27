import { type ReactNode, Suspense } from "react";

import type { Metadata, Viewport } from "next";
import { Montserrat, Nanum_Pen_Script } from "next/font/google";
import Script from "next/script";

import { getSessionProfile } from "@repo/auth/session";
import { getSiteContact } from "@repo/db/siteContact";
import ToastProvider from "@repo/ui/components/toast";

import SiteFooter from "@components/siteFooter";
import SiteHeader from "@components/siteHeader";
import {
  GA_MEASUREMENT_ID,
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
    other: {
      "naver-site-verification": "945ff80d6246b31c944487d0b53d54e8752cd196",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#1e4336",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ko"
      data-scroll-behavior="smooth"
      className={`${nanumPen.variable} ${montserrat.variable}`}
      suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-3 focus:py-2">
          본문으로
        </a>
        <ToastProvider>
          <Suspense fallback={<SiteHeader user={null} />}>
            <SessionHeader />
          </Suspense>
          <main id="content" className="flex-1 pb-8 lg:pb-10">
            {children}
          </main>
          <Suspense>
            <ContactFooter />
          </Suspense>
        </ToastProvider>
        {GA_MEASUREMENT_ID ? <GoogleAnalytics id={GA_MEASUREMENT_ID} /> : null}
      </body>
    </html>
  );
}

/**
 * section
 */

/**
 * 세션을 읽어 헤더를 그린다. 읽는 동안은 로그아웃 상태 헤더를 같은 크기로 먼저 보이고, 본문은 이 읽기를 기다리지 않는다
 */
const SessionHeader = async () => {
  // variables
  const user = await getSessionProfile();
  // render
  return (
    <SiteHeader
      user={user ? { name: user.name, avatarUrl: user.avatarUrl } : null}
    />
  );
};

/**
 * 하단 연락처를 읽어 푸터와 재단 구조화 데이터를 그린다
 */
const ContactFooter = async () => {
  // variables
  const contact = await getSiteContact();
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
  // render
  return (
    <>
      <SiteFooter contact={contact} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organization).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
};

/**
 * inner components
 */

/**
 * GA4 태그. 하이드레이션 뒤에 불러오고, 페이지 이동은 GA4 향상된 측정이 기록 변화로 집계한다
 */
const GoogleAnalytics = ({ id }: { id: string }) => {
  // render
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
};
