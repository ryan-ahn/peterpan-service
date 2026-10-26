import type { Metadata } from "next";
import Link from "next/link";

import { getSessionProfile } from "@repo/auth/session";
import Button, { buttonStyle } from "@repo/ui/components/button";
import Icon from "@repo/ui/icon";
import cn from "@repo/ui/lib/cn";

import BrandText from "@components/brandText";
import PageIntro from "@components/pageIntro";
import { listBoardPosts } from "@lib/board";
import { formatDate } from "@lib/format";

export const metadata: Metadata = { title: "게시판" };

/**
 * types
 */
type Props = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

type BoardResult = Awaited<ReturnType<typeof listBoardPosts>>;

type ListSectionProps = {
  result: BoardResult | null;
};

type PagerSectionProps = {
  result: BoardResult;
  query: string;
};

type FormatRowNumberParams = {
  result: BoardResult;
  index: number;
};

/**
 * screen — 회원 게시판. 검색, 글쓰기, 목록, 쪽 번호
 */
const BoardScreen = async ({ searchParams }: Props) => {
  // variables
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const query = params.q ?? "";
  const [user, result] = await Promise.all([
    getSessionProfile(),
    listBoardPosts({
      query,
      page: Number.isFinite(page) ? page : 1,
    }).catch(() => null),
  ]);
  const writeHref = user
    ? "/board/write"
    : `/login?next=${encodeURIComponent("/board/write")}`;
  // render
  return (
    <section className="page-list py-16">
      <PageIntro
        eyebrow="게시판"
        title="함께 나누는 이야기"
        lead="회원 누구나 글을 남길 수 있습니다. 서로를 배려하는 말로 마음을 나눠 주세요."
      />
      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
        <form className="flex flex-1 gap-2" action="/board">
          <input
            name="q"
            defaultValue={query}
            placeholder="검색어 입력"
            className="h-12 min-w-0 flex-1 rounded-full border border-beige bg-white px-5 outline-none focus:border-pine"
          />
          <Button
            variant="line"
            color="pine"
            type="submit"
            text="검색"
            isRound
          />
        </form>
        <Link
          href={writeHref}
          className={buttonStyle({
            variant: "solid",
            color: "pine",
            size: "medium",
            isRound: true,
          })}>
          <Icon name="edit" size={18} />
          {user ? "글쓰기" : "로그인하고 글쓰기"}
        </Link>
      </div>
      <ListSection result={result} />
      {result && result.pageCount > 1 ? (
        <PagerSection result={result} query={query} />
      ) : null}
    </section>
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
        글을 불러오지 못했습니다. 잠시 후 다시 열어 주세요.
      </BrandText>
    );
  }
  if (result.posts.length === 0) {
    return (
      <BrandText
        variant="bodyCompact"
        color="muted"
        className="mt-8 rounded-2xlarge bg-white px-6 py-10">
        아직 글이 없습니다. 첫 이야기를 남겨 주세요.
      </BrandText>
    );
  }
  return (
    <div className="mt-8 overflow-hidden rounded-2xlarge bg-white">
      <div className="hidden grid-cols-[5rem_1fr_8rem_5rem_7rem] gap-3 border-b border-beige px-6 py-3 text-4 leading-5 text-muted md:grid">
        <span>번호</span>
        <span>제목</span>
        <span>글쓴이</span>
        <span>좋아요</span>
        <span>작성일</span>
      </div>
      {result.posts.map((post, index) => (
        <Link
          key={post.id}
          href={`/board/${post.id}`}
          className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 border-b border-beige px-6 py-4 last:border-b-0 hover:bg-paper/60 md:grid-cols-[5rem_1fr_8rem_5rem_7rem] md:items-center">
          <span className="hidden text-4 leading-5 text-muted md:block">
            {formatRowNumber({ result, index })}
          </span>
          <span className="col-span-2 font-medium break-all md:col-span-1">
            {post.title}
            {post.commentCount > 0 ? (
              <span className="ml-1.5 text-4 leading-5 font-semibold text-gold-deep">
                [{post.commentCount}]
              </span>
            ) : null}
          </span>
          <span className="truncate text-4 leading-5 text-ink/80">
            {post.authorName || "회원"}
            <span className="ml-2 text-muted md:hidden">
              {formatDate(post.createdAt)}
            </span>
          </span>
          <span
            className={cn(
              "text-4 leading-5",
              post.likeCount > 0 ? "text-pine" : "text-muted",
            )}
            aria-label={`좋아요 ${post.likeCount}`}>
            {post.likeCount}
          </span>
          <span className="hidden text-4 leading-5 text-muted md:block">
            {formatDate(post.createdAt)}
          </span>
        </Link>
      ))}
    </div>
  );
};

const PagerSection = ({ result, query }: PagerSectionProps) => (
  <div className="mt-6 flex justify-center gap-2">
    {Array.from({ length: result.pageCount }, (_, item) => item + 1).map(
      number => (
        <Link
          key={number}
          href={`/board?q=${encodeURIComponent(query)}&page=${number}`}
          className={cn(
            "grid size-9 place-items-center rounded-full text-4 leading-5",
            number === result.page ? "bg-pine text-white" : "bg-white",
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

export default BoardScreen;
