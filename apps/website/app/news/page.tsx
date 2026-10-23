import type { Metadata } from "next";
import Link from "next/link";

import { NEWS_CATEGORIES, categoryLabel, listPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "재단소식" };

type NewsPageProps = {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
};

const NewsPage = async ({ searchParams }: NewsPageProps) => {
  const params = await searchParams;
  const category = params.category ?? "all";
  const page = Number(params.page ?? "1");
  const query = params.q ?? "";
  const result = await listPosts({
    board: "news",
    category,
    query,
    page: Number.isFinite(page) ? page : 1,
  }).catch(() => null);
  const tabs = [{ id: "all", label: "전체" }, ...NEWS_CATEGORIES];
  return (
    <section className="mx-auto w-[min(980px,calc(100%-2rem))] py-16">
      <p className="text-sm text-gold-deep">재단소식</p>
      <h1 className="mt-2 text-4xl font-semibold text-green">소식 게시판</h1>
      <p className="mt-4 text-muted">공지, 활동, 언론보도를 한 목록에서 봅니다.</p>
      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map(tab => {
          const active = category === tab.id;
          const href = tab.id === "all" ? "/news" : `/news?category=${tab.id}`;
          return (
            <Link
              key={tab.id}
              href={href}
              className={`rounded-full px-4 py-2 text-sm ${active ? "bg-green text-white" : "bg-white text-ink"}`}>
              {tab.label}
            </Link>
          );
        })}
      </div>
      <form className="mt-5 flex gap-2" action="/news">
        {category !== "all" ? <input type="hidden" name="category" value={category} /> : null}
        <input
          name="q"
          defaultValue={query}
          placeholder="검색어 입력"
          className="h-12 flex-1 rounded-full border border-beige bg-white px-5"
        />
        <button className="rounded-full bg-green px-5 text-sm text-white" type="submit">
          검색
        </button>
      </form>
      {!result ? (
        <p className="mt-10 text-muted">소식을 불러오지 못했습니다. 잠시 후 다시 열어 주세요.</p>
      ) : result.posts.length === 0 ? (
        <p className="mt-10 rounded-3xl bg-white px-6 py-10 text-muted">등록된 소식이 없습니다.</p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-3xl bg-white">
          <div className="hidden grid-cols-[5rem_6rem_1fr_8rem] gap-3 border-b border-beige px-6 py-3 text-sm text-muted md:grid">
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
              <span className="text-sm text-muted">
                {String(result.total - ((result.page - 1) * result.pageSize + index)).padStart(2, "0")}
              </span>
              <span className="text-sm text-green">{categoryLabel(post.category)}</span>
              <span className="font-medium">
                {post.pinned ? <span className="mr-2 text-gold-deep">고정</span> : null}
                {post.title}
              </span>
              <span className="text-sm text-muted">{formatDate(post.createdAt)}</span>
            </Link>
          ))}
        </div>
      )}
      {result && result.pageCount > 1 ? (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: result.pageCount }, (_, item) => item + 1).map(number => (
            <Link
              key={number}
              href={`/news?category=${category}&q=${encodeURIComponent(query)}&page=${number}`}
              className={`grid size-9 place-items-center rounded-full text-sm ${number === result.page ? "bg-green text-white" : "bg-white"}`}>
              {number}
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default NewsPage;
