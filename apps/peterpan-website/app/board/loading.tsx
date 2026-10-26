import BrandSkeleton from "@components/brandSkeleton";
import HeaderSkeleton from "@components/headerSkeleton";
import RowListSkeleton from "@components/rowListSkeleton";

/**
 * screen — 게시판 목록 스켈레톤. 검색·글쓰기, 목록
 */
const BoardLoadingScreen = () => {
  // render
  return (
    <div className="min-h-dvh">
      <HeaderSkeleton />
      <div className="page-article py-10 lg:py-12">
        <div className="flex flex-col gap-3 md:flex-row">
          <BrandSkeleton isRound className="h-12 flex-1" />
          <BrandSkeleton isRound className="h-12 w-full md:w-40" />
        </div>
        <RowListSkeleton />
      </div>
    </div>
  );
};

export default BoardLoadingScreen;
