import { cache } from "react";

import { type SQL, and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { unionAll } from "drizzle-orm/pg-core";

import { getDb, notices, postFiles, posts } from "@repo/db";
import { type BoardId, publicStorageUrl } from "@repo/db/boards";

/**
 * 공개 게시글 조회. 웹사이트는 공개(published) 글만 읽는다.
 * 재단 소식은 posts(활동·언론 보도)와 notices(공지)를 합쳐 보여 준다.
 */

/**
 * constants
 */
export const NEWS_PAGE_SIZE = 10;

/**
 * types
 */
type ListPostsParams = {
  board: BoardId;
  year?: number;
  page?: number;
};

type ListNewsParams = {
  category: string;
  query: string;
  page: number;
};

type ListNewsRowsParams = {
  category: string;
  query: string;
  limit: number;
  offset: number;
};

type ListDisclosureRowsParams = {
  board: BoardId;
  year?: number;
};

type ReadNewsFiltersParams = {
  category: string;
  query: string;
};

export type NewsRow = {
  id: string;
  slug: string;
  category: string | null;
  title: string;
  pinned: boolean;
  createdAt: Date;
};

/**
 * actions
 */
export const listPosts = async (params: ListPostsParams) => {
  const { board, year } = params;
  const page = Math.max(1, params.page ?? 1);
  const filters = [eq(posts.board, board), eq(posts.published, true)];
  if (year) {
    filters.push(eq(posts.year, year));
  }
  const where = and(...filters);
  const db = getDb();
  const [rows, countRows] = await Promise.all([
    db
      .select()
      .from(posts)
      .where(where)
      .orderBy(desc(posts.pinned), desc(posts.createdAt))
      .limit(NEWS_PAGE_SIZE)
      .offset((page - 1) * NEWS_PAGE_SIZE),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(posts)
      .where(where),
  ]);
  const total = countRows[0]?.count ?? 0;
  return {
    posts: rows,
    page,
    pageSize: NEWS_PAGE_SIZE,
    total,
    pageCount: Math.max(1, Math.ceil(total / NEWS_PAGE_SIZE)),
  };
};

export const listNews = async (params: ListNewsParams) => {
  const { category, query } = params;
  const page = Math.max(1, params.page);
  const { postWhere, noticeWhere } = readNewsFilters({ category, query });
  const db = getDb();
  const [rows, postCount, noticeCount] = await Promise.all([
    listNewsRows({
      category,
      query,
      limit: NEWS_PAGE_SIZE,
      offset: (page - 1) * NEWS_PAGE_SIZE,
    }),
    postWhere
      ? db
          .select({ count: sql<number>`count(*)::int` })
          .from(posts)
          .where(postWhere)
      : [],
    noticeWhere
      ? db
          .select({ count: sql<number>`count(*)::int` })
          .from(notices)
          .where(noticeWhere)
      : [],
  ]);
  const total = (postCount[0]?.count ?? 0) + (noticeCount[0]?.count ?? 0);
  return {
    posts: rows,
    page,
    pageSize: NEWS_PAGE_SIZE,
    total,
    pageCount: Math.max(1, Math.ceil(total / NEWS_PAGE_SIZE)),
  };
};

export const listLatestNews = async (limit: number) =>
  listNewsRows({ category: "all", query: "", limit, offset: 0 });

/**
 * 재단 소식 본문. 활동·언론 보도를 먼저 보고, 없으면 공지를 본다. 두 곳은 함께 읽는다.
 * 메타데이터와 본문이 같은 글을 읽으므로 한 요청 안에서는 한 번만 조회한다
 */
export const getNewsBySlug = cache(async (slug: string) => {
  const db = getDb();
  const [postRows, noticeRows] = await Promise.all([
    db
      .select()
      .from(posts)
      .where(
        and(
          eq(posts.slug, slug),
          eq(posts.board, "news"),
          eq(posts.published, true),
        ),
      )
      .limit(1),
    db
      .select()
      .from(notices)
      .where(and(eq(notices.slug, slug), eq(notices.published, true)))
      .limit(1),
  ]);
  const post = postRows[0];
  if (post) {
    return {
      id: post.id,
      category: post.category,
      title: post.title,
      summary: post.summary,
      body: post.body,
      externalUrl: post.externalUrl,
      createdAt: post.createdAt,
    };
  }
  const notice = noticeRows[0];
  if (!notice) {
    return null;
  }
  return {
    id: notice.id,
    category: "notice",
    title: notice.title,
    summary: "",
    body: notice.body,
    externalUrl: null,
    createdAt: notice.createdAt,
  };
});

export const listPostFiles = async (postId: string) =>
  getDb()
    .select()
    .from(postFiles)
    .where(eq(postFiles.postId, postId))
    .orderBy(desc(postFiles.createdAt));

export const listYears = async (board: BoardId) => {
  const rows = await getDb()
    .selectDistinct({ year: posts.year })
    .from(posts)
    .where(and(eq(posts.board, board), eq(posts.published, true)));
  return rows
    .map(row => row.year)
    .filter((year): year is number => typeof year === "number")
    .sort((left, right) => right - left);
};

/**
 * 공시 목록. 글마다 첫 첨부파일(없으면 외부 링크)을 연결한다
 */
export const listDisclosureRows = async (params: ListDisclosureRowsParams) => {
  const { board, year } = params;
  const result = await listPosts({ board, year, page: 1 }).catch(() => null);
  const rows = result?.posts ?? [];
  const files = rows.length
    ? await getDb()
        .select()
        .from(postFiles)
        .where(
          inArray(
            postFiles.postId,
            rows.map(post => post.id),
          ),
        )
        .orderBy(desc(postFiles.createdAt))
        .catch(() => [])
    : [];
  return rows.map(post => {
    const file = files.find(item => item.postId === post.id);
    return {
      post,
      href: file
        ? publicStorageUrl({ bucket: file.bucket, path: file.path })
        : post.externalUrl,
    };
  });
};

const listNewsRows = async (params: ListNewsRowsParams): Promise<NewsRow[]> => {
  const { category, query, limit, offset } = params;
  const { postWhere, noticeWhere } = readNewsFilters({ category, query });
  const db = getDb();
  const postSelect = db
    .select({
      id: posts.id,
      slug: posts.slug,
      category: posts.category,
      title: posts.title,
      pinned: posts.pinned,
      createdAt: posts.createdAt,
    })
    .from(posts)
    .where(postWhere);
  const noticeSelect = db
    .select({
      id: notices.id,
      slug: notices.slug,
      category: sql<string | null>`'notice'::text`.as("category"),
      title: notices.title,
      pinned: notices.pinned,
      createdAt: notices.createdAt,
    })
    .from(notices)
    .where(noticeWhere);
  const order = sql`pinned desc, created_at desc`;
  if (!noticeWhere) {
    return postSelect.orderBy(order).limit(limit).offset(offset);
  }
  if (!postWhere) {
    return noticeSelect.orderBy(order).limit(limit).offset(offset);
  }
  return unionAll(postSelect, noticeSelect)
    .orderBy(order)
    .limit(limit)
    .offset(offset);
};

/**
 * utils
 */
const readNewsFilters = (params: ReadNewsFiltersParams) => {
  const { category, query } = params;
  const keyword = query.trim();
  const postFilters: (SQL | undefined)[] = [
    eq(posts.board, "news"),
    eq(posts.published, true),
    keyword
      ? or(
          ilike(posts.title, `%${keyword}%`),
          ilike(posts.body, `%${keyword}%`),
        )
      : undefined,
  ];
  const noticeFilters: (SQL | undefined)[] = [
    eq(notices.published, true),
    keyword
      ? or(
          ilike(notices.title, `%${keyword}%`),
          ilike(notices.body, `%${keyword}%`),
        )
      : undefined,
  ];
  if (category === "notice") {
    return { postWhere: undefined, noticeWhere: and(...noticeFilters) };
  }
  if (category !== "all") {
    postFilters.push(eq(posts.category, category));
    return { postWhere: and(...postFilters), noticeWhere: undefined };
  }
  return { postWhere: and(...postFilters), noticeWhere: and(...noticeFilters) };
};
