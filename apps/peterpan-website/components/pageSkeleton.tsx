import cn from "@repo/ui/lib/cn";

import BrandSkeleton from "@components/brandSkeleton";
import HeaderSkeleton from "@components/headerSkeleton";

/**
 * constants
 */
const LINE_WIDTHS = ["w-full", "w-11/12", "w-full", "w-3/4"];

/**
 * 머리(`FoundationHeader`)와 본문 글·카드가 이어지는 소개형 화면 스켈레톤. 헤더·푸터는 그대로 둔다.
 * 화면 높이만큼 차지해 본문이 들어올 때 푸터가 화면 안에서 밀려나지 않게 한다 (CLS)
 */
const PageSkeleton = () => {
  // render
  return (
    <div className="min-h-dvh">
      <HeaderSkeleton />
      <div className="page-article flex flex-col gap-3 py-10 lg:py-12">
        {LINE_WIDTHS.map((width, index) => (
          <BrandSkeleton key={index} className={cn("h-5", width)} />
        ))}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <BrandSkeleton className="h-40 rounded-xlarge" />
          <BrandSkeleton className="h-40 rounded-xlarge" />
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;
