import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

import { getDb, postFiles, posts } from "@repo/db";
import { type BoardId, publicStorageUrl } from "@repo/db/boards";

/**
 * 공개 게시글 조회. 웹사이트는 공개(published) 글만 읽는다.
 */

/**
 * constants
 */
const PAGE_SIZE = 10;

/**
 * types
 */
type ListPostsParams = {
  board: BoardId;
  category?: string;
  year?: number;
  query?: string;
  page?: number;
};

type ListDisclosureRowsParams = {
  board: BoardId;
  year?: number;
};

/**
 * actions
 */
export const listPosts = async (params: ListPostsParams) => {
  const { board, category, year, query } = params;
  const page = Math.max(1, params.page ?? 1);
  const filters = [eq(posts.board, board), eq(posts.published, true)];
  if (category && category !== "all") {
    filters.push(eq(posts.category, category));
  }
  if (year) {
    filters.push(eq(posts.year, year));
  }
  const keyword = query?.trim();
  const search = keyword
    ? or(ilike(posts.title, `%${keyword}%`), ilike(posts.body, `%${keyword}%`))
    : undefined;
  if (search) {
    filters.push(search);
  }
  const where = and(...filters);
  const db = getDb();
  const rows = await db
    .select()
    .from(posts)
    .where(where)
    .orderBy(desc(posts.pinned), desc(posts.createdAt))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);
  const countRows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(posts)
    .where(where);
  const total = countRows[0]?.count ?? 0;
  return {
    posts: rows,
    page,
    pageSize: PAGE_SIZE,
    total,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
};

export const listLatestNews = async (limit: number) =>
  getDb()
    .select()
    .from(posts)
    .where(and(eq(posts.board, "news"), eq(posts.published, true)))
    .orderBy(desc(posts.pinned), desc(posts.createdAt))
    .limit(limit);

export const getPostBySlug = async (slug: string) => {
  const rows = await getDb()
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);
  return rows[0] ?? null;
};

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
  const files = await Promise.all(
    rows.map(post => listPostFiles(post.id).catch(() => [])),
  );
  return rows.map((post, index) => {
    const file = files[index]?.[0];
    return {
      post,
      href: file
        ? publicStorageUrl({ bucket: file.bucket, path: file.path })
        : post.externalUrl,
    };
  });
};
