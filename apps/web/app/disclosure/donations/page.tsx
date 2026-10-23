import type { Metadata } from "next";

import DisclosureList from "@/components/disclosureList";
import { formatDate, publicStorageUrl } from "@/lib/format";
import { listPostFiles, listPosts, listYears } from "@/lib/posts";

export const metadata: Metadata = { title: "기부금 공시" };

const NTS_URL =
  "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2456&cntntsId=7782";

type PageProps = {
  searchParams: Promise<{ year?: string }>;
};

const DonationsDisclosurePage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const year = params.year ? Number(params.year) : undefined;
  const selectedYear = Number.isFinite(year) ? year : undefined;
  const years = await listYears("donation").catch(() => []);
  const result = await listPosts({
    board: "donation",
    year: selectedYear,
    page: 1,
  }).catch(() => null);
  const posts = result?.posts ?? [];
  const files = await Promise.all(
    posts.map(post => listPostFiles(post.id).catch(() => [])),
  );
  return (
    <DisclosureList
      title="기부금 공시"
      lead="기부금 모금액과 활용실적을 연도별 파일로 공개합니다. 국세청 공익법인 공시와도 연결합니다."
      years={years}
      currentYear={selectedYear}
      basePath="/disclosure/donations"
      empty="등록된 기부금 공시 자료가 없습니다. 모금이 시작되고 회계가 마감되면 실적 파일을 올립니다."
      rows={posts.map((post, index) => ({
        id: post.id,
        title: post.title,
        date: formatDate(post.createdAt),
        href: files[index]?.[0]
          ? publicStorageUrl({
              bucket: files[index][0].bucket,
              path: files[index][0].path,
            })
          : post.externalUrl,
      }))}
      extra={
        <a
          href={NTS_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex rounded-full border border-green px-5 py-3 text-sm text-green">
          국세청 공시자료 확인하기
        </a>
      }
    />
  );
};

export default DonationsDisclosurePage;
