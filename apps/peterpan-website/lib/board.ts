import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";

import { boardComments, boardLikes, boardPosts, getDb } from "@repo/db";

/**
 * 회원 게시판 조회. 공개(published) 글만 읽는다.
 */

/**
 * constants
 */
const PAGE_SIZE = 15;

/**
 * types
 */
type ListBoardPostsParams = {
  query: string;
  page: number;
};

type ReadBoardLikesParams = {
  postId: string;
  userId: string | null;
};

/**
 * actions
 */
export const listBoardPosts = async (params: ListBoardPostsParams) => {
  const { query } = params;
  const page = Math.max(1, params.page);
  const keyword = query.trim();
  const where = and(
    eq(boardPosts.published, true),
    keyword
      ? or(
          ilike(boardPosts.title, `%${keyword}%`),
          ilike(boardPosts.body, `%${keyword}%`),
        )
      : undefined,
  );
  const db = getDb();
  const [rows, countRows] = await Promise.all([
    db
      .select({
        id: boardPosts.id,
        title: boardPosts.title,
        authorName: boardPosts.authorName,
        createdAt: boardPosts.createdAt,
        likeCount: sql<number>`(select count(*)::int from board_likes where board_likes.post_id = board_posts.id)`,
        commentCount: sql<number>`(select count(*)::int from board_comments where board_comments.post_id = board_posts.id)`,
      })
      .from(boardPosts)
      .where(where)
      .orderBy(desc(boardPosts.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(boardPosts)
      .where(where),
  ]);
  const total = countRows[0]?.count ?? 0;
  return {
    posts: rows,
    page,
    pageSize: PAGE_SIZE,
    total,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
};

export const getBoardPost = async (id: string) => {
  if (!isUuid(id)) {
    return null;
  }
  const rows = await getDb()
    .select()
    .from(boardPosts)
    .where(and(eq(boardPosts.id, id), eq(boardPosts.published, true)))
    .limit(1);
  return rows[0] ?? null;
};

export const listBoardComments = async (postId: string) =>
  getDb()
    .select()
    .from(boardComments)
    .where(eq(boardComments.postId, postId))
    .orderBy(asc(boardComments.createdAt));

/**
 * 글의 좋아요 수와 내가 눌렀는지. 로그인하지 않았으면 isLiked는 false
 */
export const readBoardLikes = async (params: ReadBoardLikesParams) => {
  const { postId, userId } = params;
  const rows = await getDb()
    .select({
      count: sql<number>`count(*)::int`,
      isLiked: userId
        ? sql<boolean>`coalesce(bool_or(${boardLikes.userId} = ${userId}), false)`
        : sql<boolean>`false`,
    })
    .from(boardLikes)
    .where(eq(boardLikes.postId, postId));
  return { count: rows[0]?.count ?? 0, isLiked: rows[0]?.isLiked ?? false };
};

/**
 * utils
 */
export const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
