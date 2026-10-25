import type { Metadata } from "next";

import { buttonStyle } from "@repo/ui/components/button";
import cn from "@repo/ui/lib/cn";

import DisclosureList from "@components/disclosureList";
import { formatDate } from "@lib/format";
import { listDisclosureRows, listYears } from "@lib/posts";

export const metadata: Metadata = { title: "기부금 공시" };

/**
 * constants
 */
const NTS_URL =
  "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2456&cntntsId=7782";

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
      title="기부금 공시"
      lead="기부금 모금액과 활용실적을 연도별 파일로 공개합니다. 국세청 공익법인 공시와도 연결합니다."
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
