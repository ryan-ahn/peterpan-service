import type { Metadata } from "next";
import Link from "next/link";

import { NEWS_CATEGORIES, categoryLabel } from "@repo/db/boards";
import Button from "@repo/ui/components/button";
import cn from "@repo/ui/lib/cn";

import BrandText from "@components/brandText";
import FoundationHeader from "@components/foundationHeader";
import { formatDate } from "@lib/format";
import { listNews } from "@lib/posts";

export const metadata: Metadata = {
  title: "재단 소식",
  description: "피터팬 재단의 공지, 활동 소식, 언론 보도를 모아 봅니다.",
};

/**
 * constants
 */
const TABS = [{ id: "all", label: "전체" }, ...NEWS_CATEGORIES];

/**
 * types
 */
type Props = {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
};

type NewsResult = NonNullable<Awaited<ReturnType<typeof listNews>>>;

type ListSectionProps = {
  result: NewsResult | null;
};

type PagerSectionProps = {
  result: NewsResult;
  category: string;
  query: string;
};

type FormatRowNumberParams = {
  result: NewsResult;
  index: number;
};

/**
 * screen — 소식 게시판. 분류 탭, 검색, 목록, 쪽 번호
 */
const NewsScreen = async ({ searchParams }: Props) => {
  // variables
  const params = await searchParams;
  const category = params.category ?? "all";
  const page = Number(params.page ?? "1");
  const query = params.q ?? "";
  const result = await listNews({
    category,
    query,
    page: Number.isFinite(page) ? page : 1,
  }).catch(() => null);
  // render
  return (
    <article>
      <FoundationHeader
        overline="News"
        title="재단 소식"
        lead="공지, 활동, 언론 보도를 한 목록에서 봅니다."
      />
      <div className="page-article py-10 lg:py-12">
        <div className="flex flex-wrap gap-2">
          {TABS.map(tab => (
            <Link
              key={tab.id}
              href={tab.id === "all" ? "/news" : `/news?category=${tab.id}`}
              className={cn(
                "rounded-full border px-4 py-2 text-4 leading-5",
                category === tab.id
                  ? "border-pine bg-pine text-white"
                  : "border-beige bg-white text-ink",
              )}>
              {tab.label}
            </Link>
          ))}
        </div>
        <form className="mt-5 flex gap-2" action="/news">
          {category !== "all" ? (
            <input type="hidden" name="category" value={category} />
          ) : null}
          <input
            name="q"
            defaultValue={query}
            placeholder="검색어 입력"
            className="h-12 flex-1 rounded-full border border-beige bg-white px-5 outline-none focus:border-pine"
          />
          <Button
            variant="solid"
            color="pine"
            type="submit"
            text="검색"
            isRound
          />
        </form>
        <ListSection result={result} />
        {result && result.pageCount > 1 ? (
          <PagerSection result={result} category={category} query={query} />
        ) : null}
      </div>
    </article>
  );
};

/**
 * section
 */
const ListSection = ({ result }: ListSectionProps) => {
  // render
  if (!result) {
    return (
      <BrandText variant="bodyCompact" color="muted" className="mt-10">
        소식을 불러오지 못했습니다. 잠시 후 다시 열어 주세요.
      </BrandText>
    );
  }
  if (result.posts.length === 0) {
    return (
      <BrandText
        variant="bodyCompact"
        color="muted"
        className="mt-10 rounded-2xlarge border border-beige bg-white px-6 py-10">
        등록된 소식이 없습니다.
      </BrandText>
    );
  }
  return (
    <div className="mt-8 overflow-hidden rounded-2xlarge border border-beige bg-white">
      <div className="hidden grid-cols-[5rem_6rem_1fr_8rem] gap-3 border-b border-beige px-6 py-3 text-4 leading-5 text-muted md:grid">
        <span>번호</span>
        <span>분류</span>
        <span>제목</span>
        <span>작성일</span>
      </div>
      {result.posts.map((post, index) => (
        <Link
          key={post.id}
          href={`/news/${post.slug}`}
          className="grid gap-1 border-b border-beige px-6 py-4 last:border-b-0 md:grid-cols-[5rem_6rem_1fr_8rem] md:items-center">
          <span className="text-4 leading-5 text-muted">
            {formatRowNumber({ result, index })}
          </span>
          <span className="text-4 leading-5 text-pine">
            {categoryLabel(post.category)}
          </span>
          <span className="font-medium">
            {post.pinned ? (
              <span className="mr-2 text-gold-deep">고정</span>
            ) : null}
            {post.title}
          </span>
          <span className="text-4 leading-5 text-muted">
            {formatDate(post.createdAt)}
          </span>
        </Link>
      ))}
    </div>
  );
};

const PagerSection = ({ result, category, query }: PagerSectionProps) => (
  <div className="mt-6 flex justify-center gap-2">
    {Array.from({ length: result.pageCount }, (_, item) => item + 1).map(
      number => (
        <Link
          key={number}
          href={`/news?category=${category}&q=${encodeURIComponent(query)}&page=${number}`}
          className={cn(
            "grid size-9 place-items-center rounded-full border text-4 leading-5",
            number === result.page
              ? "border-pine bg-pine text-white"
              : "border-beige bg-white",
          )}>
          {number}
        </Link>
      ),
    )}
  </div>
);

/**
 * utils
 */
const formatRowNumber = (params: FormatRowNumberParams) => {
  const { result, index } = params;
  const number = result.total - ((result.page - 1) * result.pageSize + index);
  return String(number).padStart(2, "0");
};

export default NewsScreen;
