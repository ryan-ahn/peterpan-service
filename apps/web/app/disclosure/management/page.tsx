import type { Metadata } from "next";

import DisclosureList from "@/components/disclosureList";
import { formatDate, publicStorageUrl } from "@/lib/format";
import { listPostFiles, listPosts, listYears } from "@/lib/posts";

export const metadata: Metadata = { title: "경영공시" };

type PageProps = {
  searchParams: Promise<{ year?: string }>;
};

const ManagementPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const year = params.year ? Number(params.year) : undefined;
  const selectedYear = Number.isFinite(year) ? year : undefined;
  const years = await listYears("management").catch(() => []);
  const result = await listPosts({
    board: "management",
    year: selectedYear,
    page: 1,
  }).catch(() => null);
  const posts = result?.posts ?? [];
  const files = await Promise.all(
    posts.map(post => listPostFiles(post.id).catch(() => [])),
  );
  return (
    <DisclosureList
      title="경영공시"
      lead="사업계획 및 예산, 결산서 및 재무제표, 감사보고서를 연도별로 올립니다."
      years={years}
      currentYear={selectedYear}
      basePath="/disclosure/management"
      empty="등록된 경영공시 자료가 없습니다. 설립 등기 이후 첫 회계연도 자료를 게시합니다."
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
    />
  );
};

export default ManagementPage;
