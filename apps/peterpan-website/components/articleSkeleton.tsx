import Link from "next/link";

import cn from "@repo/ui/lib/cn";

import BrandText from "@components/brandText";
import SkeletonText from "@components/skeletonText";

/**
 * constants
 */
const PARAGRAPHS = [
  "본문 첫 문단이 이 자리에 들어갑니다. 실제 글과 같은 글자 크기와 줄간격으로 두 줄 남짓 자리를 잡아 두고 글이 들어오면 그대로 바뀝니다.",
  "두 번째 문단이 이 자리에 들어갑니다. 줄바꿈도 실제 글과 같은 폭에서 일어납니다.",
];

/**
 * types
 */
type Props = {
  variant: "news" | "board";
};

/**
 * 소식·게시판 글 본문과 같은 틀에 글자 자리만 칠한다. 목록으로·분류는 실제로 그린다
 * @param variant 소식은 분류를 모르므로 칠하고, 게시판은 "게시판"과 구분선을 그린다
 */
const ArticleSkeleton = ({ variant }: Props) => {
  // variables
  const isBoard = variant === "board";
  // render
  return (
    <article className="page-article py-10 lg:py-12">
      <Link
        href={isBoard ? "/board" : "/news"}
        className="text-4 leading-5 text-pine">
        목록으로
      </Link>
      <BrandText variant="caption" color="goldDeep" className="mt-6">
        {isBoard ? "게시판" : <SkeletonText>공지사항</SkeletonText>}
      </BrandText>
      <BrandText as="h1" variant="section" color="pine" className="mt-2">
        <SkeletonText>글 제목이 이 자리에 들어갑니다</SkeletonText>
      </BrandText>
      <BrandText variant="caption" color="muted" className="mt-3">
        <SkeletonText>
          {isBoard ? "회원 · 2026.10.27" : "2026.10.27"}
        </SkeletonText>
      </BrandText>
      <div
        className={cn(
          "mt-8 flex flex-col gap-5",
          isBoard && "border-t border-beige pt-8",
        )}>
        {PARAGRAPHS.map(paragraph => (
          <BrandText key={paragraph} variant="body">
            <SkeletonText>{paragraph}</SkeletonText>
          </BrandText>
        ))}
      </div>
    </article>
  );
};

export default ArticleSkeleton;
