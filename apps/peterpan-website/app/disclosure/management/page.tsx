import type { Metadata } from "next";

import DisclosureList from "@components/disclosureList";
import { formatDate } from "@lib/format";
import { listDisclosureRows, listYears } from "@lib/posts";

export const metadata: Metadata = {
  title: "경영 공시",
  description: "재단법인 피터팬 자폐인복지재단의 결산 등 경영 공시 자료.",
};

/**
 * types
 */
type Props = {
  searchParams: Promise<{ year?: string }>;
};

/**
 * screen — 경영 공시 연도별 파일
 */
const ManagementScreen = async ({ searchParams }: Props) => {
  // variables
  const params = await searchParams;
  const year = params.year ? Number(params.year) : undefined;
  const selectedYear = Number.isFinite(year) ? year : undefined;
  const [years, rows] = await Promise.all([
    listYears("management").catch(() => []),
    listDisclosureRows({ board: "management", year: selectedYear }),
  ]);
  // render
  return (
    <DisclosureList
      overline="Management disclosure"
      title="경영 공시"
      lead="사업계획 및 예산, 결산서 및 재무제표, 감사보고서를 설립 등기 이후 연도별로 올리겠습니다."
      years={years}
      currentYear={selectedYear}
      basePath="/disclosure/management"
      empty="등록된 경영 공시 자료가 없습니다. 설립 등기 이후 첫 회계연도 자료를 게시합니다."
      rows={rows.map(({ post, href }) => ({
        id: post.id,
        title: post.title,
        date: formatDate(post.createdAt),
        href,
      }))}
    />
  );
};

export default ManagementScreen;
