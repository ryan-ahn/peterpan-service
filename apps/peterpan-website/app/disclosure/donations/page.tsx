import type { Metadata } from "next";

import { buttonStyle } from "@repo/ui/components/button";
import cn from "@repo/ui/lib/cn";

import DisclosureList from "@components/disclosureList";
import { formatDate } from "@lib/format";
import { listDisclosureRows, listYears } from "@lib/posts";

export const metadata: Metadata = {
  title: "기부금 공시",
  description: "피터팬 재단의 기부금 모금과 활용 실적 공시.",
};

/**
 * constants
 */
const NTS_URL =
  "https://hometax.go.kr/websquare/websquare.html?w2xPath=/ui/pp/index_pp.xml&tmIdx=44&tm2lIdx=4405000000&tm3lIdx=4405020000";

/**
 * types
 */
type Props = {
  searchParams: Promise<{ year?: string }>;
};

/**
 * screen — 기부금 공시 연도별 파일과 국세청 공시 링크
 */
const DonationsDisclosureScreen = async ({ searchParams }: Props) => {
  // variables
  const params = await searchParams;
  const year = params.year ? Number(params.year) : undefined;
  const selectedYear = Number.isFinite(year) ? year : undefined;
  const [years, rows] = await Promise.all([
    listYears("donation").catch(() => []),
    listDisclosureRows({ board: "donation", year: selectedYear }),
  ]);
  // render
  return (
    <DisclosureList
      overline="Donation disclosure"
      title="기부금 공시"
      lead="기부금 모금액과 활용실적을 회계연도가 마감되면 연도별 파일로 공개하겠습니다."
      years={years}
      currentYear={selectedYear}
      basePath="/disclosure/donations"
      empty="등록된 기부금 공시 자료가 없습니다. 모금이 시작되고 회계가 마감되면 실적 파일을 올립니다."
      rows={rows.map(({ post, href }) => ({
        id: post.id,
        title: post.title,
        date: formatDate(post.createdAt),
        href,
      }))}
      extra={
        <a
          href={NTS_URL}
          target="_blank"
          rel="noreferrer"
          className={cn(
            buttonStyle({ variant: "line", color: "pine", isRound: true }),
            "mt-6 border-pine",
          )}>
          국세청 공시자료 확인하기
        </a>
      }
    />
  );
};

export default DonationsDisclosureScreen;
