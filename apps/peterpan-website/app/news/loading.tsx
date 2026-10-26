import BrandSkeleton from "@components/brandSkeleton";
import HeaderSkeleton from "@components/headerSkeleton";
import RowListSkeleton from "@components/rowListSkeleton";

/**
 * constants
 */
const TAB_COUNT = 4;

/**
 * screen — 소식 목록 스켈레톤. 분류 탭, 검색, 목록
 */
const NewsLoadingScreen = () => {
  // render
  return (
    <div className="min-h-dvh">
      <HeaderSkeleton />
      <div className="page-article py-10 lg:py-12">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: TAB_COUNT }, (_, index) => (
            <BrandSkeleton key={index} isRound className="h-9 w-16" />
          ))}
        </div>
        <BrandSkeleton isRound className="mt-5 h-12 w-full" />
        <RowListSkeleton />
      </div>
    </div>
  );
};

export default NewsLoadingScreen;
