"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { and, eq } from "drizzle-orm";

import { getSessionProfile } from "@repo/auth/session";
import { boardComments, boardLikes, boardPosts, getDb } from "@repo/db";
import { BOARD_POST_LIMIT } from "@repo/db/boards";

import { getBoardPost, isUuid } from "@lib/board";

/**
 * 회원 게시판 글·댓글·좋아요. 글은 글쓴이 본인만 고치고, 글과 댓글은 글쓴이와 어드민이 지운다
 */

/**
 * actions
 */
export const saveBoardPost = async (formData: FormData) => {
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const user = await getSessionProfile();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent("/board/write")}`);
  }
  if (
    !title ||
    !body ||
    title.length > BOARD_POST_LIMIT.title ||
    body.length > BOARD_POST_LIMIT.body
  ) {
    redirect(id ? `/board/write?id=${id}&error=1` : "/board/write?error=1");
  }
  const db = getDb();
  if (!id) {
    const rows = await db
      .insert(boardPosts)
      .values({ authorId: user.id, authorName: user.name, title, body })
      .returning({ id: boardPosts.id });
    revalidatePath("/board");
    redirect(`/board/${rows[0]?.id ?? ""}`);
  }
  if (!isUuid(id)) {
    redirect("/board");
  }
  await db
    .update(boardPosts)
    .set({ title, body, updatedAt: new Date() })
    .where(and(eq(boardPosts.id, id), eq(boardPosts.authorId, user.id)));
  revalidatePath("/board");
  redirect(`/board/${id}`);
};

export const deleteBoardPost = async (formData: FormData) => {
  const id = String(formData.get("id") ?? "");
  const user = await getSessionProfile();
  const post = await getBoardPost(id);
  if (!user || !post) {
    redirect("/board");
  }
  if (post.authorId !== user.id && user.role === null) {
    redirect(`/board/${id}`);
  }
  await getDb().delete(boardPosts).where(eq(boardPosts.id, id));
  revalidatePath("/board");
  redirect("/board");
};

export const addBoardComment = async (formData: FormData) => {
  const postId = String(formData.get("postId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const user = await getSessionProfile();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/board/${postId}`)}`);
  }
  const post = await getBoardPost(postId);
  if (!post) {
    redirect("/board");
  }
  if (!body || body.length > BOARD_POST_LIMIT.comment) {
    redirect(`/board/${postId}#comments`);
  }
  await getDb()
    .insert(boardComments)
    .values({ postId, authorId: user.id, authorName: user.name, body });
  revalidatePath(`/board/${postId}`);
  revalidatePath("/board");
  redirect(`/board/${postId}#comments`);
};

export const deleteBoardComment = async (formData: FormData) => {
  const id = String(formData.get("id") ?? "");
  const postId = String(formData.get("postId") ?? "");
  const user = await getSessionProfile();
  if (!user || !isUuid(id) || !isUuid(postId)) {
    redirect("/board");
  }
  const isAdmin = user.role !== null;
  await getDb()
    .delete(boardComments)
    .where(
      isAdmin
        ? eq(boardComments.id, id)
        : and(eq(boardComments.id, id), eq(boardComments.authorId, user.id)),
    );
  revalidatePath(`/board/${postId}`);
  revalidatePath("/board");
  redirect(`/board/${postId}#comments`);
};

export const toggleBoardLike = async (formData: FormData) => {
  const postId = String(formData.get("postId") ?? "");
  const user = await getSessionProfile();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/board/${postId}`)}`);
  }
  const post = await getBoardPost(postId);
  if (!post) {
    redirect("/board");
  }
  const db = getDb();
  const removed = await db
    .delete(boardLikes)
    .where(and(eq(boardLikes.postId, postId), eq(boardLikes.userId, user.id)))
    .returning({ postId: boardLikes.postId });
  if (removed.length === 0) {
    await db
      .insert(boardLikes)
      .values({ postId, userId: user.id })
      .onConflictDoNothing();
  }
  revalidatePath(`/board/${postId}`);
  revalidatePath("/board");
};
