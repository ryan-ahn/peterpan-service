import BrandSkeleton from "@components/brandSkeleton";
import HeaderSkeleton from "@components/headerSkeleton";

/**
 * screen — 후원하기 스켈레톤. 공식 후원 계좌 띠
 */
const DonateLoadingScreen = () => {
  // render
  return (
    <div className="min-h-dvh">
      <HeaderSkeleton />
      <div className="page-article py-10 lg:py-12">
        <BrandSkeleton className="h-4 w-32" />
        <BrandSkeleton className="mt-3 h-8 w-44" />
        <BrandSkeleton className="mt-4 h-5 w-full" />
        <BrandSkeleton className="mt-2 h-5 w-3/4" />
        <BrandSkeleton className="mt-8 h-56 w-full rounded-xlarge" />
        <BrandSkeleton isRound className="mt-6 h-12 w-40" />
      </div>
    </div>
  );
};

export default DonateLoadingScreen;
