import type { Metadata } from "next";

import ToastProvider from "@repo/ui/components/toast";

import "@app/globals.css";

const PRETENDARD_CSS_URL =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css";

export const metadata: Metadata = {
  title: "피터팬 재단 어드민",
  description: "피터팬 재단 운영 어드민",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <head>
        <link
          crossOrigin="anonymous"
          href={PRETENDARD_CSS_URL}
          rel="stylesheet"
        />
      </head>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
