import type { Metadata } from "next";
import Link from "next/link";

import BrandText from "@components/brandText";
import FoundationHeader from "@components/foundationHeader";

export const metadata: Metadata = {
  title: "정보공개",
  description: "피터팬 재단의 경영 공시와 기부금 공시를 투명하게 공개합니다.",
};

/**
 * constants
 */
const BOARDS = [
  {
    href: "/disclosure/management",
    title: "경영 공시",
    body: "사업계획과 예산, 결산과 재무제표, 감사보고서.",
  },
  {
    href: "/disclosure/donations",
    title: "기부금 공시",
    body: "모금과 활용 실적, 국세청 공시 자료 링크.",
  },
];

/**
 * screen — 정보공개 안내와 두 게시판 입구
 */
const DisclosureScreen = () => (
  <article>
    <FoundationHeader
      overline="Disclosure"
      title="경영과 기부를 공개합니다"
      lead="정관은 기부금 모금액과 활용실적, 사업실적을 홈페이지에 공개하도록 정하고 있습니다. 설립 등기 이후의 회계연도 자료를 파일로 올립니다."
    />
    <div className="page-article grid gap-4 py-10 md:grid-cols-2 lg:py-12">
      {BOARDS.map(board => (
        <Link
          key={board.href}
          href={board.href}
          className="rounded-xlarge border border-beige bg-white p-8 transition-colors hover:border-pine">
          <BrandText as="h2" variant="heading" color="pine">
            {board.title}
          </BrandText>
          <BrandText variant="bodyCompact" color="muted" className="mt-3">
            {board.body}
          </BrandText>
        </Link>
      ))}
    </div>
  </article>
);

export default DisclosureScreen;
