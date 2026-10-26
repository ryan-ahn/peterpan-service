import BrandSkeleton from "@components/brandSkeleton";
import HeaderSkeleton from "@components/headerSkeleton";

/**
 * constants
 */
const ROW_COUNT = 3;

/**
 * screen — 정보공개(경영·기부금 공시) 스켈레톤. 연도별 파일 줄
 */
const DisclosureLoadingScreen = () => {
  // render
  return (
    <div className="min-h-dvh">
      <HeaderSkeleton />
      <div className="page-article flex flex-col gap-3 py-10 lg:py-12">
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 rounded-xlarge border border-beige bg-white px-5 py-4">
            <div className="flex flex-1 flex-col gap-2">
              <BrandSkeleton className="h-5 w-2/3" />
              <BrandSkeleton className="h-4 w-24" />
            </div>
            <BrandSkeleton isRound className="h-9 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisclosureLoadingScreen;
