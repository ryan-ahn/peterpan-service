import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDb, postFiles, posts, type posts as postsTable } from "@repo/db";

export const NEWS_CATEGORIES = [
  { id: "notice", label: "공지" },
  { id: "activity", label: "활동" },
  { id: "press", label: "언론보도" },
] as const;

export const BOARDS = [
  { id: "news", label: "재단소식" },
  { id: "management", label: "경영공시" },
  { id: "donation", label: "기부금 공시" },
] as const;

export type BoardId = (typeof BOARDS)[number]["id"];
export type NewsCategoryId = (typeof NEWS_CATEGORIES)[number]["id"];

export type PostRecord = typeof postsTable.$inferSelect;
export type PostFileRecord = typeof postFiles.$inferSelect;

const PAGE_SIZE = 10;

type ListPostsParams = {
  board: BoardId;
  category?: string;
  year?: number;
  query?: string;
  page?: number;
  includeDrafts?: boolean;
};

export const listPosts = async (params: ListPostsParams) => {
  const page = Math.max(1, params.page ?? 1);
  const filters = [eq(posts.board, params.board)];
  if (!params.includeDrafts) {
    filters.push(eq(posts.published, true));
  }
  if (params.category && params.category !== "all") {
    filters.push(eq(posts.category, params.category));
  }
  if (params.year) {
    filters.push(eq(posts.year, params.year));
  }
  const keyword = params.query?.trim();
  if (keyword) {
    const pattern = `%${keyword}%`;
    const search = or(ilike(posts.title, pattern), ilike(posts.body, pattern));
    if (search) {
      filters.push(search);
    }
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

export const listLatestNews = async (limit: number) => {
  return getDb()
    .select()
    .from(posts)
    .where(and(eq(posts.board, "news"), eq(posts.published, true)))
    .orderBy(desc(posts.pinned), desc(posts.createdAt))
    .limit(limit);
};

export const getPostBySlug = async (slug: string) => {
  const rows = await getDb()
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);
  return rows[0] ?? null;
};

export const getPostById = async (id: string) => {
  const rows = await getDb()
    .select()
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);
  return rows[0] ?? null;
};

export const listPostFiles = async (postId: string) => {
  return getDb()
    .select()
    .from(postFiles)
    .where(eq(postFiles.postId, postId))
    .orderBy(desc(postFiles.createdAt));
};

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

export const categoryLabel = (category: string | null) =>
  NEWS_CATEGORIES.find(item => item.id === category)?.label ?? "소식";
