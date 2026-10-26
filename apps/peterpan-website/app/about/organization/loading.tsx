import BrandSkeleton from "@components/brandSkeleton";
import HeaderSkeleton from "@components/headerSkeleton";

/**
 * constants
 */
const CARD_COUNT = 3;

/**
 * screen — 조직도 스켈레톤. 맨 위 카드 하나와 그 아래 갈래 카드들
 */
const OrganizationLoadingScreen = () => {
  // render
  return (
    <div className="min-h-dvh">
      <HeaderSkeleton />
      <div className="page-wide flex flex-col items-center gap-8 py-10 lg:py-12">
        <BrandSkeleton className="h-36 w-full rounded-xlarge md:w-52" />
        <div className="flex w-full flex-col gap-4 md:flex-row md:justify-center">
          {Array.from({ length: CARD_COUNT }, (_, index) => (
            <BrandSkeleton
              key={index}
              className="h-36 w-full rounded-xlarge md:w-52"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrganizationLoadingScreen;
