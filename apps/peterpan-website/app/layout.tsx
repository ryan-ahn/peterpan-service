import type { ReactNode } from "react";

import type { Metadata } from "next";
import { Montserrat, Nanum_Pen_Script } from "next/font/google";

import { getSessionProfile } from "@repo/auth/session";
import { getSiteContact } from "@repo/db/siteContact";

import SiteFooter from "@components/siteFooter";
import SiteHeader from "@components/siteHeader";

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
  title: {
    default: "피터팬 재단",
    template: "%s · 피터팬 재단",
  },
  description:
    "자폐인의 오늘, 더 넓은 내일로. 성인 중증 자폐성장애인이 존엄하게 살아갈 생활주거공동체를 준비하는 재단법인 피터팬 자폐인복지재단.",
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
      <body>
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-3 focus:py-2">
          본문으로
        </a>
        <SiteHeader userName={user?.name ?? null} />
        <main id="content" className="pb-8 lg:pb-10">
          {children}
        </main>
        <SiteFooter contact={contact} />
      </body>
    </html>
  );
}
