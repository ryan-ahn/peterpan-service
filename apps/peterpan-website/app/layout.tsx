import type { ReactNode } from "react";

import type { Metadata } from "next";
import { Nanum_Pen_Script } from "next/font/google";

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

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "피터팬 재단",
    template: "%s · 피터팬 재단",
  },
  description:
    "성인 중증 자폐성장애인이 혼자가 되어도 혼자가 아닌 삶을 이어 가도록, 생활주거공동체를 준비하는 재단법인 피터팬 자폐인복지재단.",
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
    <html lang="ko" className={nanumPen.variable}>
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
        <main id="content">{children}</main>
        <SiteFooter contact={contact} />
      </body>
    </html>
  );
}
