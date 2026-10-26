import { Suspense } from "react";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getSessionProfile } from "@repo/auth/session";
import { BOARD_POST_LIMIT } from "@repo/db/boards";
import Button from "@repo/ui/components/button";

import BrandText from "@components/brandText";
import PageIntro from "@components/pageIntro";
import SkeletonText from "@components/skeletonText";
import { getBoardPost } from "@lib/board";

import { saveBoardPost } from "../actions";

export const metadata: Metadata = {
  title: "글쓰기",
  robots: { index: false, follow: false },
};

/**
 * types
 */
type Props = {
  searchParams: Promise<{ id?: string; error?: string }>;
};

type WriteSectionProps = {
  id: string;
  hasError: boolean;
};

type WriteFormProps = {
  id: string;
  post: { title: string; body: string } | null;
  userName: string | null;
  hasError: boolean;
};

/**
 * screen — 게시판 글쓰기. id가 있으면 본인 글 고치기. 세션과 글을 읽는 동안 같은 틀을 먼저 보인다
 */
const BoardWriteScreen = async ({ searchParams }: Props) => {
  // variables
  const params = await searchParams;
  const id = params.id ?? "";
  const hasError = Boolean(params.error);
  // render
  return (
    <Suspense
      key={id}
      fallback={
        <WriteForm id={id} post={null} userName={null} hasError={hasError} />
      }>
      <WriteSection id={id} hasError={hasError} />
    </Suspense>
  );
};

/**
 * section
 */
const WriteSection = async ({ id, hasError }: WriteSectionProps) => {
  // variables
  const user = await getSessionProfile();
  if (!user) {
    const next = id ? `/board/write?id=${id}` : "/board/write";
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }
  const post = id ? await getBoardPost(id).catch(() => null) : null;
  if (id && (!post || post.authorId !== user.id)) {
    notFound();
  }
  // render
  return (
    <WriteForm id={id} post={post} userName={user.name} hasError={hasError} />
  );
};

/**
 * inner components
 */

/**
 * 글쓰기 틀. `userName`이 없으면 읽는 중으로 보고 이름 자리를 칠하고 입력을 막는다
 */
const WriteForm = ({ id, post, userName, hasError }: WriteFormProps) => {
  // variables
  const isEditing = Boolean(id);
  const isLoading = userName === null;
  // render
  return (
    <section className="page-article py-10 lg:py-12">
      <Link
        href={isEditing ? `/board/${id}` : "/board"}
        className="text-4 leading-5 text-pine">
        {isEditing ? "글로 돌아가기" : "목록으로"}
      </Link>
      <div className="mt-6">
        <PageIntro
          eyebrow="게시판"
          title={isEditing ? "글 고치기" : "글쓰기"}
          lead={
            isLoading ? (
              <SkeletonText>회원 님의 이름으로 올라갑니다.</SkeletonText>
            ) : (
              `${userName} 님의 이름으로 올라갑니다.`
            )
          }
        />
      </div>
      <form
        action={saveBoardPost}
        inert={isLoading}
        className="mt-8 flex flex-col gap-5 rounded-2xlarge border border-beige bg-white px-5 py-6 md:px-8 md:py-8">
        <input type="hidden" name="id" value={id} />
        <label className="flex flex-col gap-2">
          <span className="text-4 leading-5 font-semibold text-pine">제목</span>
          <input
            name="title"
            required
            maxLength={BOARD_POST_LIMIT.title}
            defaultValue={post?.title}
            placeholder="제목을 입력해 주세요"
            className="h-12 rounded-large border border-beige bg-white px-4 outline-none focus:border-pine"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-4 leading-5 font-semibold text-pine">내용</span>
          <textarea
            name="body"
            required
            rows={14}
            maxLength={BOARD_POST_LIMIT.body}
            defaultValue={post?.body}
            placeholder="나누고 싶은 이야기를 적어 주세요. 문단은 빈 줄로 나뉩니다."
            className="resize-y rounded-large border border-beige bg-white px-4 py-3 leading-7 outline-none focus:border-pine"
          />
        </label>
        {hasError ? (
          <BrandText variant="smallCompact" color="goldDeep">
            제목과 내용을 모두 입력해 주세요. 제목은 {BOARD_POST_LIMIT.title}
            자, 내용은 {BOARD_POST_LIMIT.body.toLocaleString()}자까지 쓸 수
            있습니다.
          </BrandText>
        ) : null}
        <BrandText variant="smallCompact" color="muted">
          다른 사람을 비방하거나 개인정보가 담긴 글은 운영자가 지울 수 있습니다.
        </BrandText>
        <div className="flex justify-end">
          <Button
            variant="solid"
            color="pine"
            type="submit"
            text={isEditing ? "고친 내용 저장" : "올리기"}
            isRound
          />
        </div>
      </form>
    </section>
  );
};

export default BoardWriteScreen;
