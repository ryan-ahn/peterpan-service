import { desc, eq, sql } from "drizzle-orm";

import { boardPosts, donationInquiries, getDb, profiles } from "@repo/db";

/**
 * 마이페이지 조회. 본인 profiles 행과 본인이 남긴 후원·게시글만 읽는다.
 */

/**
 * actions
 */
export const getMyProfile = async (userId: string) => {
  const rows = await getDb()
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);
  return rows[0] ?? null;
};

export const listMyInquiries = async (userId: string) =>
  getDb()
    .select({
      id: donationInquiries.id,
      kind: donationInquiries.kind,
      amount: donationInquiries.amount,
      message: donationInquiries.message,
      createdAt: donationInquiries.createdAt,
    })
    .from(donationInquiries)
    .where(eq(donationInquiries.userId, userId))
    .orderBy(desc(donationInquiries.createdAt));

export const listMyBoardPosts = async (userId: string) =>
  getDb()
    .select({
      id: boardPosts.id,
      title: boardPosts.title,
      createdAt: boardPosts.createdAt,
      likeCount: sql<number>`(select count(*)::int from board_likes where board_likes.post_id = board_posts.id)`,
      commentCount: sql<number>`(select count(*)::int from board_comments where board_comments.post_id = board_posts.id)`,
    })
    .from(boardPosts)
    .where(eq(boardPosts.authorId, userId))
    .orderBy(desc(boardPosts.createdAt));
