import cn from "@repo/ui/lib/cn";

import BrandSkeleton from "@components/brandSkeleton";

/**
 * constants
 */
const LINE_WIDTHS = ["w-full", "w-full", "w-11/12", "w-full", "w-2/3"];

/**
 * 소식·게시판 글 본문 자리를 잡는 스켈레톤 (목록으로·분류·제목·날짜·문단)
 */
const ArticleSkeleton = () => {
  // render
  return (
    <div className="page-article min-h-dvh py-10 lg:py-12">
      <BrandSkeleton className="h-5 w-16" />
      <BrandSkeleton className="mt-6 h-4 w-14" />
      <BrandSkeleton className="mt-3 h-9 w-4/5" />
      <BrandSkeleton className="mt-3 h-4 w-36" />
      <div className="mt-8 flex flex-col gap-3 border-t border-beige pt-8">
        {LINE_WIDTHS.map((width, index) => (
          <BrandSkeleton key={index} className={cn("h-5", width)} />
        ))}
      </div>
    </div>
  );
};

export default ArticleSkeleton;
