import BrandSkeleton from "@components/brandSkeleton";
import HeaderSkeleton from "@components/headerSkeleton";

/**
 * constants
 */
const FACT_COUNT = 3;

/**
 * screen — 정관 스켈레톤. 요약(목적·구성), 조문 목록
 */
const BylawsLoadingScreen = () => {
  // render
  return (
    <div className="min-h-dvh">
      <HeaderSkeleton />
      <div className="page-article flex flex-col gap-6 py-10 lg:py-12">
        <BrandSkeleton className="h-7 w-28" />
        <BrandSkeleton className="h-28 w-full rounded-xlarge" />
        <div className="flex flex-col divide-y divide-beige border-t border-beige">
          {Array.from({ length: FACT_COUNT }, (_, index) => (
            <div key={index} className="flex gap-4 py-4">
              <BrandSkeleton className="h-5 w-16" />
              <BrandSkeleton className="h-5 flex-1" />
            </div>
          ))}
        </div>
        <BrandSkeleton className="h-56 w-full rounded-xlarge" />
      </div>
    </div>
  );
};

export default BylawsLoadingScreen;
