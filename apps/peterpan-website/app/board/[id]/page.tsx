import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { type SessionProfile, getSessionProfile } from "@repo/auth/session";
import { BOARD_POST_LIMIT } from "@repo/db/boards";
import Button, { buttonStyle } from "@repo/ui/components/button";
import Icon from "@repo/ui/icon";
import cn from "@repo/ui/lib/cn";

import BrandText from "@components/brandText";
import {
  getBoardPost,
  isUuid,
  listBoardComments,
  readBoardLikes,
} from "@lib/board";
import { formatDate, summarize } from "@lib/format";

import {
  addBoardComment,
  deleteBoardComment,
  deleteBoardPost,
  toggleBoardLike,
} from "../actions";

/**
 * types
 */
type Props = {
  params: Promise<{ id: string }>;
};

type Comment = Awaited<ReturnType<typeof listBoardComments>>[number];

type LikeSectionProps = {
  postId: string;
  count: number;
  isLiked: boolean;
  isSignedIn: boolean;
};

type CommentSectionProps = {
  postId: string;
  comments: Comment[];
  user: SessionProfile | null;
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { id } = await params;
  const post = await getBoardPost(id).catch(() => null);
  if (!post) {
    return { title: "게시판" };
  }
  const description = summarize(post.body) || "피터팬 재단 게시판 글";
  return {
    title: post.title,
    description,
    openGraph: {
      type: "article",
      title: post.title,
      description,
      publishedTime: post.createdAt.toISOString(),
    },
  };
};

/**
 * screen — 게시판 글 본문, 좋아요, 댓글. 글쓴이는 고치기·지우기, 어드민은 지우기
 */
const BoardDetailScreen = async ({ params }: Props) => {
  // variables
  const { id } = await params;
  const [post, user, comments] = await Promise.all([
    getBoardPost(id).catch(() => null),
    getSessionProfile(),
    isUuid(id) ? listBoardComments(id).catch(() => []) : [],
  ]);
  if (!post) {
    notFound();
  }
  const likes = await readBoardLikes({
    postId: post.id,
    userId: user?.id ?? null,
  }).catch(() => ({ count: 0, isLiked: false }));
  const isAuthor = Boolean(user && post.authorId === user.id);
  const canDelete = isAuthor || Boolean(user?.role);
  const isEdited = post.updatedAt.getTime() - post.createdAt.getTime() > 1000;
  const paragraphs = post.body
    .split(/\n{2,}/)
    .map(item => item.trim())
    .filter(Boolean);
  // render
  return (
    <article className="page-article py-10 lg:py-12">
      <Link href="/board" className="text-4 leading-5 text-pine">
        목록으로
      </Link>
      <BrandText variant="caption" color="goldDeep" className="mt-6">
        게시판
      </BrandText>
      <BrandText
        as="h1"
        variant="section"
        color="pine"
        className="mt-2 break-all">
        {post.title}
      </BrandText>
      <BrandText variant="caption" color="muted" className="mt-3">
        {post.authorName || "회원"} · {formatDate(post.createdAt)}
        {isEdited ? " · 수정됨" : ""}
      </BrandText>
      <div className="mt-8 flex flex-col gap-5 border-t border-beige pt-8">
        {paragraphs.map((paragraph, index) => (
          <BrandText
            key={index}
            variant="body"
            className="break-all whitespace-pre-line">
            {paragraph}
          </BrandText>
        ))}
      </div>
      <LikeSection
        postId={post.id}
        count={likes.count}
        isLiked={likes.isLiked}
        isSignedIn={Boolean(user)}
      />
      {canDelete ? (
        <div className="mt-8 flex justify-end gap-2">
          {isAuthor ? (
            <Link
              href={`/board/write?id=${post.id}`}
              className={buttonStyle({
                variant: "line",
                color: "pine",
                size: "small",
                isRound: true,
              })}>
              고치기
            </Link>
          ) : null}
          <form action={deleteBoardPost}>
            <input type="hidden" name="id" value={post.id} />
            <Button
              variant="line"
              color="danger"
              size="small"
              type="submit"
              text="지우기"
              isRound
            />
          </form>
        </div>
      ) : null}
      <CommentSection postId={post.id} comments={comments} user={user} />
    </article>
  );
};

/**
 * section
 */
const LikeSection = ({
  postId,
  count,
  isLiked,
  isSignedIn,
}: LikeSectionProps) => {
  // variables
  const className = cn(
    "inline-flex h-12 items-center gap-2 rounded-full border px-6 text-4 leading-5 font-semibold transition-colors",
    isLiked
      ? "border-pine bg-pine text-paper"
      : "border-beige bg-white text-pine hover:border-pine",
  );
  const content = (
    <>
      <Icon name="heart" size={18} />
      좋아요 {count}
    </>
  );
  // render
  return (
    <div className="mt-12 flex justify-center">
      {isSignedIn ? (
        <form action={toggleBoardLike}>
          <input type="hidden" name="postId" value={postId} />
          <button type="submit" aria-pressed={isLiked} className={className}>
            {content}
          </button>
        </form>
      ) : (
        <Link
          href={`/login?next=${encodeURIComponent(`/board/${postId}`)}`}
          className={className}>
          {content}
        </Link>
      )}
    </div>
  );
};

const CommentSection = ({ postId, comments, user }: CommentSectionProps) => (
  <section id="comments" className="mt-12 border-t border-beige pt-8">
    <h2 className="text-6 leading-8 font-semibold text-pine">
      댓글 <span className="text-gold-deep">{comments.length}</span>
    </h2>
    {comments.length === 0 ? (
      <BrandText variant="smallCompact" color="muted" className="mt-4">
        아직 댓글이 없습니다.
      </BrandText>
    ) : (
      <ul className="mt-4 flex flex-col divide-y divide-beige border-y border-beige">
        {comments.map(comment => (
          <li key={comment.id} className="flex flex-col gap-1 py-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-4 leading-5">
                <span className="font-semibold text-ink">
                  {comment.authorName || "회원"}
                </span>
                <span className="ml-2 text-muted">
                  {formatDate(comment.createdAt)}
                </span>
              </p>
              {user && (comment.authorId === user.id || user.role) ? (
                <form action={deleteBoardComment}>
                  <input type="hidden" name="id" value={comment.id} />
                  <input type="hidden" name="postId" value={postId} />
                  <button
                    type="submit"
                    className="text-4 leading-5 text-muted hover:text-pine">
                    지우기
                  </button>
                </form>
              ) : null}
            </div>
            <p className="text-4 leading-7 break-all whitespace-pre-line text-ink/90">
              {comment.body}
            </p>
          </li>
        ))}
      </ul>
    )}
    {user ? (
      <form action={addBoardComment} className="mt-6 flex flex-col gap-3">
        <input type="hidden" name="postId" value={postId} />
        <textarea
          name="body"
          required
          rows={3}
          maxLength={BOARD_POST_LIMIT.comment}
          placeholder="따뜻한 댓글을 남겨 주세요"
          aria-label="댓글"
          className="resize-y rounded-large border border-beige bg-white px-4 py-3 leading-7 outline-none focus:border-pine"
        />
        <div className="flex justify-end">
          <Button
            variant="solid"
            color="pine"
            size="small"
            type="submit"
            text="댓글 남기기"
            isRound
          />
        </div>
      </form>
    ) : (
      <Link
        href={`/login?next=${encodeURIComponent(`/board/${postId}`)}`}
        className="mt-6 block rounded-large border border-beige bg-white px-4 py-4 text-center text-4 leading-5 text-muted hover:text-pine">
        로그인하고 댓글 남기기
      </Link>
    )}
  </section>
);

export default BoardDetailScreen;
