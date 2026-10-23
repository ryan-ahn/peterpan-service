import type { Metadata } from "next";

import ArticlePage from "@/components/articlePage";
import { BYLAW_CHAPTERS } from "@/content/foundation";

export const metadata: Metadata = { title: "정관" };

const BylawsPage = () => (
  <ArticlePage
    eyebrow="재단소개"
    title="정관"
    lead="2026년 9월 15일 작성된 정관의 뼈대입니다. 전문은 PDF로 받을 수 있습니다. 시행은 주무관청 설립허가와 설립등기 이후입니다."
    sections={BYLAW_CHAPTERS}>
    <a
      href="/docs/bylaws.pdf"
      download
      className="inline-flex w-fit rounded-full bg-green px-5 py-3 text-sm font-medium text-white">
      정관 PDF 다운로드
    </a>
  </ArticlePage>
);

export default BylawsPage;
